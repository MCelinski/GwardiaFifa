import { knockoutRoundLabel } from "@/lib/backend/predictions-view";
import { createClient } from "@/lib/supabase/server";
import { formatWarsawDateTime } from "@/lib/time";
import type { PredictionStatus } from "@/lib/types";

export type HistoryPlayerPick = {
  userId: string;
  name: string;
  initials: string;
  score: [number, number];
  points: number | null;
  isExact: boolean;
};

export type HistoryMatch = {
  id: string;
  roundLabel: string;
  date: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  status: PredictionStatus;
  result: [number, number] | null;
  picks: HistoryPlayerPick[];
};

function pickTeam(value: unknown): { name: string | null; flag_code: string | null } | null {
  if (Array.isArray(value)) return (value[0] ?? null) as { name: string | null; flag_code: string | null } | null;
  return (value ?? null) as { name: string | null; flag_code: string | null } | null;
}

function readProfile(value: unknown): { display_name: string | null; avatar_initials: string | null } | null {
  if (Array.isArray(value)) return (value[0] ?? null) as { display_name: string | null; avatar_initials: string | null } | null;
  return (value ?? null) as { display_name: string | null; avatar_initials: string | null } | null;
}

function mapStatus(status: string): PredictionStatus {
  if (status === "finished") return "scored";
  if (status === "live") return "live";
  if (status === "locked") return "locked";
  return "draft";
}

function roundLabel(stage: string, round: string | null, groupCode: string | null): string {
  if (stage === "group") return groupCode ? `Grupa ${groupCode}` : "Faza grupowa";
  return knockoutRoundLabel(round);
}

/**
 * Read-only history of every match that has already kicked off, together with
 * how each league member predicted it. Uses the RLS-bound client, so other
 * players' picks are only returned for matches that have started — un-started
 * matches stay private and are excluded entirely.
 */
export async function getMatchHistory(): Promise<HistoryMatch[]> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims.sub) return [];

  const now = new Date();

  const { data: fixtures, error: fixturesError } = await supabase
    .from("fixtures")
    .select(
      "id, starts_at, status, stage, round, group_code, placeholder_a, placeholder_b, team_a:team_a_id(name, flag_code), team_b:team_b_id(name, flag_code), score_a, score_b"
    )
    .lte("starts_at", now.toISOString())
    .order("starts_at", { ascending: false });

  if (fixturesError) throw fixturesError;
  if (!fixtures?.length) return [];

  const fixtureIds = fixtures.map((fixture) => fixture.id);

  const { data: predictions, error: predictionsError } = await supabase
    .from("match_predictions")
    .select("fixture_id, user_id, score_a, score_b, points, status, profiles:user_id(display_name, avatar_initials)")
    .in("fixture_id", fixtureIds)
    .order("points", { ascending: false });

  if (predictionsError) throw predictionsError;

  const picksByFixture = new Map<string, HistoryPlayerPick[]>();
  for (const prediction of predictions ?? []) {
    const fixture = fixtures.find((row) => row.id === prediction.fixture_id);
    const profile = readProfile(prediction.profiles);
    const resultKnown = fixture?.score_a !== null && fixture?.score_b !== null;
    const isExact =
      resultKnown && prediction.score_a === fixture?.score_a && prediction.score_b === fixture?.score_b;

    const pick: HistoryPlayerPick = {
      userId: prediction.user_id,
      name: profile?.display_name ?? "Gracz",
      initials: profile?.avatar_initials ?? "?",
      score: [prediction.score_a, prediction.score_b],
      points: prediction.points,
      isExact: Boolean(isExact)
    };

    const list = picksByFixture.get(prediction.fixture_id) ?? [];
    list.push(pick);
    picksByFixture.set(prediction.fixture_id, list);
  }

  return fixtures.map((fixture) => {
    const teamA = pickTeam(fixture.team_a);
    const teamB = pickTeam(fixture.team_b);
    const result =
      fixture.score_a !== null && fixture.score_b !== null
        ? ([fixture.score_a, fixture.score_b] as [number, number])
        : null;

    return {
      id: fixture.id,
      roundLabel: roundLabel(fixture.stage, fixture.round, fixture.group_code),
      date: formatWarsawDateTime(new Date(fixture.starts_at)),
      teamA: teamA?.name ?? fixture.placeholder_a ?? "TBD",
      teamB: teamB?.name ?? fixture.placeholder_b ?? "TBD",
      flagA: teamA?.flag_code ?? "A",
      flagB: teamB?.flag_code ?? "B",
      status: mapStatus(fixture.status),
      result,
      picks: picksByFixture.get(fixture.id) ?? []
    } satisfies HistoryMatch;
  });
}
