import { getPrimaryLeague } from "@/lib/backend/league";
import { scoreGroupOrder } from "@/lib/backend/scoring";
import { GROUP_STANDINGS_DEADLINE_LABEL, MATCH_LOCK_MINUTES } from "@/lib/rules";
import { createClient } from "@/lib/supabase/server";
import { formatWarsawDateTime, getWarsawDateKey } from "@/lib/time";
import type { GroupStandingPrediction, GroupTable, GroupTableRow, KnockoutMatch, Match, PredictionStatus, Team } from "@/lib/types";

// Number of best third-placed teams that advance from the group stage.
const BEST_THIRD_QUALIFIERS = 8;

function pickTeam(value: unknown): { name: string | null; flag_code: string | null } | null {
  if (Array.isArray(value)) return (value[0] ?? null) as { name: string | null; flag_code: string | null } | null;
  return (value ?? null) as { name: string | null; flag_code: string | null } | null;
}

// Status shown on a prediction card. Combines the feed status with the local
// 10-minute lock window and whether the user already saved a pick, so the badge
// and the edit button match what the server will actually allow.
function resolveMatchStatus(fixtureStatus: string, lockAt: Date, now: Date, hasPrediction: boolean): PredictionStatus {
  if (fixtureStatus === "finished") return "scored";
  if (fixtureStatus === "live") return "live";
  if (fixtureStatus === "locked" || now >= lockAt) return "locked";
  if (hasPrediction) return "saved";
  return "draft";
}

// Friends' match picks are revealed at kickoff (not at the 10-minute edit lock),
// per the league rules.
function areFriendsPicksVisible(fixtureStatus: string, startsAt: Date, now: Date): boolean {
  return now >= startsAt || fixtureStatus === "live" || fixtureStatus === "finished";
}

const KNOCKOUT_ROUND_LABELS: Record<string, string> = {
  LAST_32: "1/16 finału",
  LAST_16: "1/8 finału",
  QUARTER_FINALS: "Ćwierćfinał",
  SEMI_FINALS: "Półfinał",
  THIRD_PLACE: "Mecz o 3. miejsce",
  FINAL: "Finał"
};

export function knockoutRoundLabel(round: string | null): string {
  if (!round) return "Faza pucharowa";
  return KNOCKOUT_ROUND_LABELS[round.toUpperCase()] ?? round;
}

async function getSessionContext() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub ?? null;
  const league = await getPrimaryLeague();
  return { supabase, userId, leagueId: league?.id ?? null };
}

// A prediction that nailed the exact scoreline (5 pts). Used to fire the hit
// celebration on the dashboard. Because the score was exact, the predicted
// score equals the real result.
export type ExactHit = {
  fixtureId: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
};

export async function getExactHits(): Promise<{ userId: string | null; hits: ExactHit[] }> {
  const { supabase, userId } = await getSessionContext();
  if (!userId) return { userId: null, hits: [] };

  const { data } = await supabase
    .from("match_predictions")
    .select("fixture_id, score_a, score_b, fixtures:fixture_id(team_a:team_a_id(name), team_b:team_b_id(name))")
    .eq("user_id", userId)
    .eq("status", "scored")
    .eq("points", 5);

  const hits = (data ?? []).map((row) => {
    const fixture = Array.isArray(row.fixtures) ? row.fixtures[0] : row.fixtures;
    return {
      fixtureId: row.fixture_id,
      teamA: pickTeam(fixture?.team_a)?.name ?? "?",
      teamB: pickTeam(fixture?.team_b)?.name ?? "?",
      scoreA: row.score_a,
      scoreB: row.score_b
    } satisfies ExactHit;
  });

  return { userId, hits };
}

export async function getGroupStageMatches(opts?: { upcomingOnly?: boolean }): Promise<Match[]> {
  const { supabase, userId, leagueId } = await getSessionContext();
  if (!userId || !leagueId) return [];

  const [{ data: fixtures }, { data: predictions }] = await Promise.all([
    supabase
      .from("fixtures")
      .select(
        "id, starts_at, status, group_code, placeholder_a, placeholder_b, team_a:team_a_id(name, flag_code), team_b:team_b_id(name, flag_code), score_a, score_b"
      )
      .eq("league_id", leagueId)
      .eq("stage", "group")
      .order("starts_at", { ascending: true }),
    supabase.from("match_predictions").select("fixture_id, score_a, score_b").eq("user_id", userId)
  ]);

  const predictionByFixture = new Map((predictions ?? []).map((row) => [row.fixture_id, row]));

  const now = new Date();

  // When upcomingOnly, hide matches whose calendar day (Warsaw) is before today —
  // today's matches stay even after kickoff, so the betting list isn't cluttered
  // with already-played days. Past matches remain reachable via the history modal.
  const todayKey = getWarsawDateKey(now);
  const visibleFixtures = opts?.upcomingOnly
    ? (fixtures ?? []).filter((fixture) => getWarsawDateKey(new Date(fixture.starts_at)) >= todayKey)
    : fixtures ?? [];

  return visibleFixtures.map((fixture) => {
    const startsAt = new Date(fixture.starts_at);
    const lockAt = new Date(startsAt.getTime() - MATCH_LOCK_MINUTES * 60 * 1000);
    const teamA = pickTeam(fixture.team_a);
    const teamB = pickTeam(fixture.team_b);
    const prediction = predictionByFixture.get(fixture.id);
    const status = resolveMatchStatus(fixture.status, lockAt, now, Boolean(prediction));
    const result =
      fixture.score_a !== null && fixture.score_b !== null
        ? ([fixture.score_a, fixture.score_b] as [number, number])
        : undefined;

    return {
      id: fixture.id,
      group: fixture.group_code ?? undefined,
      date: formatWarsawDateTime(startsAt),
      deadline: formatWarsawDateTime(lockAt),
      teamA: teamA?.name ?? fixture.placeholder_a ?? "TBD",
      teamB: teamB?.name ?? fixture.placeholder_b ?? "TBD",
      flagA: teamA?.flag_code ?? "A",
      flagB: teamB?.flag_code ?? "B",
      status,
      prediction: prediction ? [prediction.score_a, prediction.score_b] : undefined,
      result,
      friendsVisible: areFriendsPicksVisible(fixture.status, startsAt, now)
    } satisfies Match;
  });
}

export async function getGroupStandings(): Promise<GroupStandingPrediction[]> {
  const { supabase, userId } = await getSessionContext();
  if (!userId) return [];

  const [{ data: groups }, { data: teams }, { data: predictions }] = await Promise.all([
    supabase.from("world_cup_groups").select("id, code, standings_deadline, status").order("code", { ascending: true }),
    supabase.from("teams").select("id, name, flag_code, fifa_rank, group_code").order("name", { ascending: true }),
    supabase
      .from("group_standing_predictions")
      .select("group_id, status, group_standing_prediction_items(team_id, predicted_position)")
      .eq("user_id", userId)
  ]);

  const predictionByGroup = new Map((predictions ?? []).map((row) => [row.group_id, row]));
  const now = new Date();

  return (groups ?? []).map((group) => {
    const deadlinePassed = group.standings_deadline ? new Date(group.standings_deadline) <= now : false;
    const prediction = predictionByGroup.get(group.id);

    const groupTeams: Team[] = (teams ?? [])
      .filter((team) => team.group_code === group.code)
      .map((team) => ({
        id: team.id,
        name: team.name,
        flag: team.flag_code ?? "TBD",
        fifaRank: team.fifa_rank ?? 0,
        group: group.code
      }));

    const orderedItems = [...(prediction?.group_standing_prediction_items ?? [])].sort(
      (a, b) => a.predicted_position - b.predicted_position
    );
    const orderedTeams = orderedItems.length
      ? orderedItems
          .map((item) => groupTeams.find((team) => team.id === item.team_id))
          .filter((team): team is Team => Boolean(team))
      : groupTeams;

    const status: PredictionStatus = deadlinePassed ? "locked" : prediction ? "saved" : "draft";

    return {
      group: group.code,
      groupId: group.id,
      status,
      deadline: GROUP_STANDINGS_DEADLINE_LABEL,
      teams: orderedTeams
    } satisfies GroupStandingPrediction;
  });
}

// Live, Flashscore-style group tables computed straight from finished group
// fixtures (independent of group_actual_standings, so they reflect results the
// instant they land). Also returns the player's own predicted order and a live
// simulation of the points that order would earn if the stage ended now. The
// simulation is a preview only — official group points are added to the
// leaderboard after the whole group stage finishes (migration 0007).
type TeamStat = {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
};

function emptyStat(): TeamStat {
  return { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };
}

export async function getGroupTables(): Promise<GroupTable[]> {
  const { supabase, userId, leagueId } = await getSessionContext();
  if (!userId || !leagueId) return [];

  const [{ data: groups }, { data: teams }, { data: fixtures }, { data: predictions }] = await Promise.all([
    supabase.from("world_cup_groups").select("id, code, standings_deadline").order("code", { ascending: true }),
    supabase.from("teams").select("id, name, flag_code, group_code"),
    supabase
      .from("fixtures")
      .select("team_a_id, team_b_id, score_a, score_b")
      .eq("league_id", leagueId)
      .eq("stage", "group")
      .eq("status", "finished")
      .not("score_a", "is", null)
      .not("score_b", "is", null),
    supabase
      .from("group_standing_predictions")
      .select("group_id, group_standing_prediction_items(team_id, predicted_position)")
      .eq("user_id", userId)
  ]);

  const now = new Date();
  const predictionByGroup = new Map((predictions ?? []).map((row) => [row.group_id, row]));

  // 1) Aggregate per-team stats from finished group fixtures.
  const statByTeam = new Map<string, TeamStat>();
  const ensureStat = (teamId: string) => {
    const existing = statByTeam.get(teamId);
    if (existing) return existing;
    const created = emptyStat();
    statByTeam.set(teamId, created);
    return created;
  };

  for (const fixture of fixtures ?? []) {
    const { team_a_id: a, team_b_id: b, score_a: sa, score_b: sb } = fixture;
    if (a == null || b == null || sa == null || sb == null) continue;
    const statA = ensureStat(a);
    const statB = ensureStat(b);
    statA.played += 1;
    statB.played += 1;
    statA.goalsFor += sa;
    statA.goalsAgainst += sb;
    statB.goalsFor += sb;
    statB.goalsAgainst += sa;
    if (sa > sb) {
      statA.won += 1;
      statB.lost += 1;
    } else if (sa < sb) {
      statB.won += 1;
      statA.lost += 1;
    } else {
      statA.drawn += 1;
      statB.drawn += 1;
    }
  }

  // 2) Build sorted standings per group (same tie-break as the DB:
  //    points desc, goal difference desc, goals for desc, name asc).
  const buildRows = (groupCode: string): GroupTableRow[] => {
    const rows = (teams ?? [])
      .filter((team) => team.group_code === groupCode)
      .map((team) => {
        const stat = statByTeam.get(team.id) ?? emptyStat();
        return {
          teamId: team.id,
          name: team.name,
          flag: team.flag_code ?? "TBD",
          position: 0,
          played: stat.played,
          won: stat.won,
          drawn: stat.drawn,
          lost: stat.lost,
          goalsFor: stat.goalsFor,
          goalsAgainst: stat.goalsAgainst,
          goalDifference: stat.goalsFor - stat.goalsAgainst,
          points: stat.won * 3 + stat.drawn,
          isBestThird: false
        } satisfies GroupTableRow;
      });

    rows.sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.name.localeCompare(b.name)
    );
    rows.forEach((row, index) => {
      row.position = index + 1;
    });
    return rows;
  };

  const rowsByGroup = new Map<string, GroupTableRow[]>();
  for (const group of groups ?? []) rowsByGroup.set(group.code, buildRows(group.code));

  // 3) Best third-placed teams across all groups (top 8).
  const thirds = [...rowsByGroup.values()].map((rows) => rows[2]).filter((row): row is GroupTableRow => Boolean(row));
  thirds.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.teamId.localeCompare(b.teamId)
  );
  const bestThirdIds = new Set(thirds.slice(0, BEST_THIRD_QUALIFIERS).map((row) => row.teamId));
  for (const rows of rowsByGroup.values()) {
    const third = rows[2];
    if (third && bestThirdIds.has(third.teamId)) third.isBestThird = true;
  }

  // 4) Assemble each group with the player's prediction + live simulation.
  return (groups ?? []).map((group) => {
    const deadlinePassed = group.standings_deadline ? new Date(group.standings_deadline) <= now : false;
    const standings = rowsByGroup.get(group.code) ?? [];
    const rowByTeam = new Map(standings.map((row) => [row.teamId, row] as const));

    const saved = predictionByGroup.get(group.id);
    const orderedItems = [...(saved?.group_standing_prediction_items ?? [])].sort(
      (a, b) => a.predicted_position - b.predicted_position
    );
    const prediction = orderedItems.length
      ? orderedItems
          .map((item) => {
            const row = rowByTeam.get(item.team_id);
            return row ? { teamId: row.teamId, name: row.name, flag: row.flag } : null;
          })
          .filter((entry): entry is { teamId: string; name: string; flag: string } => Boolean(entry))
      : null;

    const groupBestThirdIds = standings.filter((row) => row.isBestThird).map((row) => row.teamId);
    const simulatedPoints = prediction
      ? scoreGroupOrder(
          prediction.map((entry) => entry.teamId),
          standings.map((row) => row.teamId),
          groupBestThirdIds
        )
      : null;

    const status: PredictionStatus = deadlinePassed ? "locked" : saved ? "saved" : "draft";

    return {
      group: group.code,
      groupId: group.id,
      status,
      deadline: GROUP_STANDINGS_DEADLINE_LABEL,
      standings,
      prediction,
      simulatedPoints
    } satisfies GroupTable;
  });
}

export async function getKnockoutMatches(opts?: { upcomingOnly?: boolean }): Promise<KnockoutMatch[]> {
  const { supabase, userId, leagueId } = await getSessionContext();
  if (!userId || !leagueId) return [];

  const [{ data: fixtures }, { data: predictions }] = await Promise.all([
    supabase
      .from("fixtures")
      .select(
        "id, starts_at, status, round, placeholder_a, placeholder_b, score_a, score_b, team_a:team_a_id(name, flag_code), team_b:team_b_id(name, flag_code)"
      )
      .eq("league_id", leagueId)
      .eq("stage", "knockout")
      .order("starts_at", { ascending: true }),
    supabase.from("match_predictions").select("fixture_id, score_a, score_b").eq("user_id", userId)
  ]);

  const predictionByFixture = new Map((predictions ?? []).map((row) => [row.fixture_id, row]));
  const now = new Date();

  // Same day-based filter as the group stage: hide knockout days before today,
  // keep today and future. Played matches live in the history modal.
  const todayKey = getWarsawDateKey(now);
  const visibleFixtures = opts?.upcomingOnly
    ? (fixtures ?? []).filter((fixture) => getWarsawDateKey(new Date(fixture.starts_at)) >= todayKey)
    : fixtures ?? [];

  return visibleFixtures
    .map((fixture) => {
      const startsAt = new Date(fixture.starts_at);
      const lockAt = new Date(startsAt.getTime() - MATCH_LOCK_MINUTES * 60 * 1000);
      const teamA = pickTeam(fixture.team_a);
      const teamB = pickTeam(fixture.team_b);
      const prediction = predictionByFixture.get(fixture.id);
      const status = resolveMatchStatus(fixture.status, lockAt, now, Boolean(prediction));
      const result =
        fixture.score_a !== null && fixture.score_b !== null
          ? ([fixture.score_a, fixture.score_b] as [number, number])
          : undefined;

      return {
        knownTeams: Boolean(teamA?.name && teamB?.name),
        match: {
          id: fixture.id,
          round: knockoutRoundLabel(fixture.round),
          date: formatWarsawDateTime(startsAt),
          teamA: teamA?.name ?? fixture.placeholder_a ?? "TBD",
          teamB: teamB?.name ?? fixture.placeholder_b ?? "TBD",
          flagA: teamA?.flag_code ?? "A",
          flagB: teamB?.flag_code ?? "B",
          status,
          prediction: prediction ? ([prediction.score_a, prediction.score_b] as [number, number]) : undefined,
          result,
          friendsVisible: areFriendsPicksVisible(fixture.status, startsAt, now)
        } satisfies KnockoutMatch
      };
    })
    // Only matches whose teams are actually decided can be predicted — no TBD bracket.
    .filter((entry) => entry.knownTeams)
    .map((entry) => entry.match);
}
