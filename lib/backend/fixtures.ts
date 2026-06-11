import { MATCH_LOCK_MINUTES } from "@/lib/rules";
import { formatWarsawDateTime } from "@/lib/time";
import { createClient } from "@/lib/supabase/server";

export type TodayBettableMatch = {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  startsAt: string;
  displayStartsAt: string;
  lockAt: string;
  displayLockAt: string;
  stage: "group" | "knockout";
  groupCode: string | null;
  round: string | null;
  status: string;
  canPredict: boolean;
  result: [number, number] | null;
  prediction: {
    scoreA: number;
    scoreB: number;
    status: string;
  } | null;
};

export async function getTodaysBettableMatches(): Promise<TodayBettableMatch[]> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!userId) return [];

  const today = new Date();
  const todayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(today);

  const start = new Date(`${todayKey}T00:00:00+02:00`);
  const end = new Date(`${todayKey}T23:59:59+02:00`);

  const { data: fixtures, error } = await supabase
    .from("fixtures")
    .select(
      "id, starts_at, status, stage, round, group_code, placeholder_a, placeholder_b, score_a, score_b, team_a:team_a_id(name, flag_code), team_b:team_b_id(name, flag_code)"
    )
    .gte("starts_at", start.toISOString())
    .lte("starts_at", end.toISOString())
    .order("starts_at", { ascending: true });

  if (error || !fixtures?.length) return [];

  const fixtureIds = fixtures.map((fixture) => fixture.id);
  const { data: predictions } = await supabase
    .from("match_predictions")
    .select("fixture_id, score_a, score_b, status")
    .eq("user_id", userId)
    .in("fixture_id", fixtureIds);

  const predictionByFixture = new Map((predictions ?? []).map((prediction) => [prediction.fixture_id, prediction]));
  const now = new Date();

  return fixtures.map((fixture) => {
    const startsAt = new Date(fixture.starts_at);
    const lockAt = new Date(startsAt.getTime() - MATCH_LOCK_MINUTES * 60 * 1000);
    const prediction = predictionByFixture.get(fixture.id);
    const teamA = Array.isArray(fixture.team_a) ? fixture.team_a[0] : fixture.team_a;
    const teamB = Array.isArray(fixture.team_b) ? fixture.team_b[0] : fixture.team_b;

    return {
      id: fixture.id,
      teamA: teamA?.name ?? fixture.placeholder_a ?? "TBD",
      teamB: teamB?.name ?? fixture.placeholder_b ?? "TBD",
      flagA: teamA?.flag_code ?? "A",
      flagB: teamB?.flag_code ?? "B",
      startsAt: fixture.starts_at,
      displayStartsAt: formatWarsawDateTime(fixture.starts_at),
      lockAt: lockAt.toISOString(),
      displayLockAt: formatWarsawDateTime(lockAt),
      stage: fixture.stage,
      groupCode: fixture.group_code,
      round: fixture.round,
      status: fixture.status,
      canPredict: lockAt > now,
      result:
        fixture.score_a !== null && fixture.score_b !== null
          ? [fixture.score_a, fixture.score_b]
          : null,
      prediction: prediction
        ? {
            scoreA: prediction.score_a,
            scoreB: prediction.score_b,
            status: prediction.status
          }
        : null
    };
  });
}
