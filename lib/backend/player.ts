import { knockoutRoundLabel } from "@/lib/backend/predictions-view";
import { createClient } from "@/lib/supabase/server";

// One earned-points entry on a player's timeline, derived live from scored
// predictions (the `points_events` table is never populated, so the timeline is
// computed from the same `.points` columns the leaderboard sums).
export type PointTimelineEvent = {
  id: string;
  label: string; // e.g. "Niemcy 7:1 Curaçao" or "Tabela grupy C"
  category: string; // e.g. "Grupa A", "1/8 finału", "Tabela grupy", "Podium"
  points: number;
  at: string; // ISO timestamp, used for ordering + display
  exact: boolean; // true when the match score was nailed exactly (5 pkt)
};

function pickTeamName(value: unknown): string | null {
  const team = Array.isArray(value) ? value[0] : value;
  if (team && typeof team === "object" && "name" in team) {
    return (team as { name: string | null }).name ?? null;
  }
  return null;
}

function pickOne<T>(value: unknown): T | null {
  return (Array.isArray(value) ? value[0] : value) as T | null;
}

type MatchRow = {
  id: string;
  points: number | null;
  status: string;
  fixtures: unknown;
};

type GroupRow = {
  id: string;
  points: number | null;
  status: string;
  groups: unknown;
};

type TournamentRow = {
  id: string;
  points: number | null;
  status: string;
};

// Builds a single player's points timeline from every scored prediction:
// individual matches (group + knockout), group-table predictions, and the
// tournament podium. Ordered most-recent first by when the points became real.
export async function getPlayerPointsTimeline(userId: string): Promise<PointTimelineEvent[]> {
  const supabase = await createClient();

  const [{ data: matchRows }, { data: groupRows }, { data: tournamentRow }] = await Promise.all([
    supabase
      .from("match_predictions")
      .select(
        "id, points, status, fixtures:fixture_id(stage, round, group_code, score_a, score_b, starts_at, team_a:team_a_id(name), team_b:team_b_id(name))"
      )
      .eq("user_id", userId)
      .eq("status", "scored"),
    supabase
      .from("group_standing_predictions")
      .select("id, points, status, groups:group_id(code, standings_deadline)")
      .eq("user_id", userId)
      .eq("status", "scored"),
    supabase
      .from("tournament_predictions")
      .select("id, points, status")
      .eq("user_id", userId)
      .maybeSingle()
  ]);

  const events: PointTimelineEvent[] = [];

  // Match events — dated at kickoff (a good proxy for "when this was scored").
  let latestMatchAt: string | null = null;
  let latestGroupMatchAt: string | null = null;
  for (const row of (matchRows ?? []) as MatchRow[]) {
    const fixture = pickOne<{
      stage: string;
      round: string | null;
      group_code: string | null;
      score_a: number | null;
      score_b: number | null;
      starts_at: string;
      team_a: unknown;
      team_b: unknown;
    }>(row.fixtures);
    if (!fixture || fixture.score_a === null || fixture.score_b === null) continue;

    const points = row.points ?? 0;
    const isKnockout = fixture.stage === "knockout";
    const teamA = pickTeamName(fixture.team_a) ?? "?";
    const teamB = pickTeamName(fixture.team_b) ?? "?";

    events.push({
      id: `match-${row.id}`,
      label: `${teamA} ${fixture.score_a}:${fixture.score_b} ${teamB}`,
      category: isKnockout
        ? knockoutRoundLabel(fixture.round)
        : fixture.group_code
          ? `Grupa ${fixture.group_code}`
          : "Faza grupowa",
      points,
      at: fixture.starts_at,
      exact: points === 5
    });

    if (!latestMatchAt || fixture.starts_at > latestMatchAt) latestMatchAt = fixture.starts_at;
    if (!isKnockout && (!latestGroupMatchAt || fixture.starts_at > latestGroupMatchAt)) {
      latestGroupMatchAt = fixture.starts_at;
    }
  }

  // Group-table events — all scored together once the group stage finished, so
  // date them at the last group kickoff (falls back to the typing deadline).
  for (const row of (groupRows ?? []) as GroupRow[]) {
    const group = pickOne<{ code: string | null; standings_deadline: string | null }>(row.groups);
    const code = group?.code ?? "?";
    events.push({
      id: `group-${row.id}`,
      label: `Tabela grupy ${code}`,
      category: "Faza grupowa",
      points: row.points ?? 0,
      at: latestGroupMatchAt ?? group?.standings_deadline ?? new Date().toISOString(),
      exact: false
    });
  }

  // Podium — only once the tournament prediction has actually been scored.
  const tournament = tournamentRow as TournamentRow | null;
  if (tournament && tournament.status === "scored") {
    events.push({
      id: `tournament-${tournament.id}`,
      label: "Podium turnieju",
      category: "Faza pucharowa",
      points: tournament.points ?? 0,
      at: latestMatchAt ?? new Date().toISOString(),
      exact: false
    });
  }

  events.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  return events;
}
