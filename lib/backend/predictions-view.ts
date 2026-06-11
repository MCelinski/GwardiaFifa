import { getPrimaryLeague } from "@/lib/backend/league";
import { GROUP_STANDINGS_DEADLINE_LABEL, MATCH_LOCK_MINUTES } from "@/lib/rules";
import { createClient } from "@/lib/supabase/server";
import { formatWarsawDateTime } from "@/lib/time";
import type { GroupStandingPrediction, KnockoutMatch, Match, PredictionStatus, Team } from "@/lib/types";

function pickTeam(value: unknown): { name: string | null; flag_code: string | null } | null {
  if (Array.isArray(value)) return (value[0] ?? null) as { name: string | null; flag_code: string | null } | null;
  return (value ?? null) as { name: string | null; flag_code: string | null } | null;
}

function mapFixtureStatus(status: string): PredictionStatus {
  if (status === "finished") return "scored";
  if (status === "live") return "live";
  if (status === "locked") return "locked";
  return "draft";
}

const KNOCKOUT_ROUND_LABELS: Record<string, string> = {
  LAST_32: "Round of 32",
  LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarter-finals",
  SEMI_FINALS: "Semi-finals",
  THIRD_PLACE: "Third-place match",
  FINAL: "Final"
};

function knockoutRoundLabel(round: string | null): string {
  if (!round) return "Knockout";
  return KNOCKOUT_ROUND_LABELS[round.toUpperCase()] ?? round;
}

async function getSessionContext() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub ?? null;
  const league = await getPrimaryLeague();
  return { supabase, userId, leagueId: league?.id ?? null };
}

export async function getGroupStageMatches(): Promise<Match[]> {
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

  return (fixtures ?? []).map((fixture) => {
    const startsAt = new Date(fixture.starts_at);
    const lockAt = new Date(startsAt.getTime() - MATCH_LOCK_MINUTES * 60 * 1000);
    const status = mapFixtureStatus(fixture.status);
    const teamA = pickTeam(fixture.team_a);
    const teamB = pickTeam(fixture.team_b);
    const prediction = predictionByFixture.get(fixture.id);
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
      friendsVisible: ["locked", "live", "scored"].includes(status)
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

export async function getKnockoutMatches(): Promise<KnockoutMatch[]> {
  const { supabase, userId, leagueId } = await getSessionContext();
  if (!userId || !leagueId) return [];

  const [{ data: fixtures }, { data: predictions }] = await Promise.all([
    supabase
      .from("fixtures")
      .select(
        "id, starts_at, status, round, placeholder_a, placeholder_b, team_a:team_a_id(name), team_b:team_b_id(name)"
      )
      .eq("league_id", leagueId)
      .eq("stage", "knockout")
      .order("starts_at", { ascending: true }),
    supabase.from("match_predictions").select("fixture_id, score_a, score_b").eq("user_id", userId)
  ]);

  const predictionByFixture = new Map((predictions ?? []).map((row) => [row.fixture_id, row]));

  return (fixtures ?? [])
    .map((fixture) => {
      const status = mapFixtureStatus(fixture.status);
      const teamA = pickTeam(fixture.team_a);
      const teamB = pickTeam(fixture.team_b);
      const prediction = predictionByFixture.get(fixture.id);

      return {
        knownTeams: Boolean(teamA?.name && teamB?.name),
        match: {
          id: fixture.id,
          round: knockoutRoundLabel(fixture.round),
          date: formatWarsawDateTime(new Date(fixture.starts_at)),
          teamA: teamA?.name ?? fixture.placeholder_a ?? "TBD",
          teamB: teamB?.name ?? fixture.placeholder_b ?? "TBD",
          status,
          prediction: prediction ? ([prediction.score_a, prediction.score_b] as [number, number]) : undefined,
          friendsVisible: ["locked", "live", "scored"].includes(status)
        } satisfies KnockoutMatch
      };
    })
    // Only matches whose teams are actually decided can be predicted — no TBD bracket.
    .filter((entry) => entry.knownTeams)
    .map((entry) => entry.match);
}
