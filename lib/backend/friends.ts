import { getLeaderboard } from "@/lib/backend/leaderboard";
import { getPrimaryLeague } from "@/lib/backend/league";
import { createClient } from "@/lib/supabase/server";

// A fun, league-relative superlative awarded to exactly one player (the leader of
// that category). Purely cosmetic — adds banter to the friends tab.
export type PlayerBadge = {
  emoji: string;
  label: string;
  hint: string;
};

export type BestHit = { label: string; points: number };

export type PlayerStats = {
  predictions: number; // scored match typy counted toward stats
  exact: number; // 5 pkt (idealny wynik)
  exactPct: number; // 0..100
  margin: number; // 4 pkt (trafiony zwycięzca + dokładna różnica)
  correctOutcome: number; // >= 3 pkt (trafiony rezultat)
  accuracyPct: number; // % typów z dodatnimi punktami
  zero: number; // 0 pkt — kompletne pudła
  avgPoints: number; // średnia pkt na mecz (1 miejsce po przecinku)
  avgGoals: number; // średnia liczba goli w typie
  drawPredPct: number; // % typów na remis
  favoriteScore: string | null; // najczęściej typowany wynik, np. "2:1"
  bestHit: BestHit | null; // najlepszy pojedynczy typ
};

export type PlayerProfile = {
  id: string;
  name: string;
  initials: string;
  rank: number;
  label: string;
  roast?: string;
  isBeerPayer: boolean;
  points: {
    total: number;
    groupMatches: number;
    groupStandings: number;
    knockout: number;
    bonus: number;
  };
  stats: PlayerStats;
  badges: PlayerBadge[];
};

// Players need at least this many scored typy before they're eligible for the
// league-relative superlative badges (keeps a 1-match fluke from "winning").
const BADGE_MIN_PREDICTIONS = 5;

type RawPrediction = {
  user_id: string;
  score_a: number;
  score_b: number;
  points: number | null;
  status: string;
  fixtures: unknown;
};

type FixtureInfo = {
  score_a: number | null;
  score_b: number | null;
  team_a: { name: string | null } | null;
  team_b: { name: string | null } | null;
};

function readFixture(value: unknown): FixtureInfo | null {
  const fixture = Array.isArray(value) ? value[0] : value;
  if (!fixture || typeof fixture !== "object") return null;
  const f = fixture as Record<string, unknown>;
  const pickTeam = (v: unknown) => {
    const t = Array.isArray(v) ? v[0] : v;
    return t && typeof t === "object" ? (t as { name: string | null }) : null;
  };
  return {
    score_a: (f.score_a as number | null) ?? null,
    score_b: (f.score_b as number | null) ?? null,
    team_a: pickTeam(f.team_a),
    team_b: pickTeam(f.team_b)
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

// Builds one player's match stats from their scored predictions (each paired
// with the real, finished fixture).
function buildStats(rows: { pred: RawPrediction; fixture: FixtureInfo }[]): PlayerStats {
  const count = rows.length;
  if (!count) {
    return {
      predictions: 0,
      exact: 0,
      exactPct: 0,
      margin: 0,
      correctOutcome: 0,
      accuracyPct: 0,
      zero: 0,
      avgPoints: 0,
      avgGoals: 0,
      drawPredPct: 0,
      favoriteScore: null,
      bestHit: null
    };
  }

  let exact = 0;
  let margin = 0;
  let correctOutcome = 0;
  let zero = 0;
  let totalPoints = 0;
  let totalGoals = 0;
  let draws = 0;
  const scoreTally = new Map<string, number>();
  let bestHit: BestHit | null = null;
  let bestHitGoals = -1; // tiebreak: among equal points, prefer the goal-fest

  for (const { pred, fixture } of rows) {
    const points = pred.points ?? 0;
    totalPoints += points;
    if (points === 5) exact += 1;
    if (points === 4) margin += 1;
    if (points >= 3) correctOutcome += 1;
    if (points === 0) zero += 1;

    totalGoals += pred.score_a + pred.score_b;
    if (pred.score_a === pred.score_b) draws += 1;

    const key = `${pred.score_a}:${pred.score_b}`;
    scoreTally.set(key, (scoreTally.get(key) ?? 0) + 1);

    const resultGoals = (fixture.score_a ?? 0) + (fixture.score_b ?? 0);
    const currentBestPoints: number = bestHit ? bestHit.points : 0;
    const beatsBest = points > currentBestPoints || (points === currentBestPoints && resultGoals > bestHitGoals);
    if (points > 0 && beatsBest) {
      bestHit = {
        label: `${fixture.team_a?.name ?? "?"} ${fixture.score_a}:${fixture.score_b} ${fixture.team_b?.name ?? "?"}`,
        points
      };
      bestHitGoals = resultGoals;
    }
  }

  let favoriteScore: string | null = null;
  let favoriteCount = 0;
  for (const [score, n] of scoreTally) {
    if (n > favoriteCount) {
      favoriteCount = n;
      favoriteScore = score;
    }
  }

  return {
    predictions: count,
    exact,
    exactPct: Math.round((exact / count) * 100),
    margin,
    correctOutcome,
    accuracyPct: Math.round((correctOutcome / count) * 100),
    zero,
    avgPoints: round1(totalPoints / count),
    avgGoals: round1(totalGoals / count),
    drawPredPct: Math.round((draws / count) * 100),
    favoriteScore,
    bestHit
  };
}

// Awards each league-relative superlative to the single best-qualifying player.
function assignBadges(profiles: PlayerProfile[]): void {
  const eligible = profiles.filter((p) => p.stats.predictions >= BADGE_MIN_PREDICTIONS);
  if (!eligible.length) return;

  const award = (
    emoji: string,
    label: string,
    hint: string,
    pick: (candidates: PlayerProfile[]) => PlayerProfile | null
  ) => {
    const winner = pick(eligible);
    if (winner) winner.badges.push({ emoji, label, hint });
  };

  const maxBy = (key: (p: PlayerProfile) => number, requirePositive = true) => (candidates: PlayerProfile[]) => {
    let best: PlayerProfile | null = null;
    let bestValue = -Infinity;
    for (const p of candidates) {
      const value = key(p);
      if (value > bestValue) {
        bestValue = value;
        best = p;
      }
    }
    return best && (!requirePositive || bestValue > 0) ? best : null;
  };

  award("🎯", "Snajper", "Najwięcej idealnych wyników", maxBy((p) => p.stats.exact));
  award("🔥", "Maszyna", "Najwyższa skuteczność typów", maxBy((p) => p.stats.accuracyPct));
  award("🎰", "Hazardzista", "Najwięcej goli w typach", maxBy((p) => p.stats.avgGoals));
  award("🛡️", "Beton", "Najbardziej zachowawcze typy", maxBy((p) => p.stats.drawPredPct));
  award("📈", "Wyrocznia", "Najlepsza średnia punktów", maxBy((p) => p.stats.avgPoints));
}

// Every league member's public profile with fun, comparable match stats. All
// stats are derived from already-scored matches, so they respect privacy (no
// un-started picks leak) while still letting everyone see everyone.
export async function getPlayerProfiles(): Promise<PlayerProfile[]> {
  const league = await getPrimaryLeague();
  if (!league?.id) return [];

  const supabase = await createClient();
  const leaderboard = await getLeaderboard(league.id);
  if (!leaderboard.length) return [];

  // RLS returns other players' picks only for fixtures that have already started,
  // so filtering to scored typy here is both correct and safe.
  const { data: predictions } = await supabase
    .from("match_predictions")
    .select(
      "user_id, score_a, score_b, points, status, fixtures:fixture_id(score_a, score_b, team_a:team_a_id(name), team_b:team_b_id(name))"
    )
    .eq("status", "scored");

  const rowsByUser = new Map<string, { pred: RawPrediction; fixture: FixtureInfo }[]>();
  for (const row of (predictions ?? []) as RawPrediction[]) {
    const fixture = readFixture(row.fixtures);
    if (!fixture || fixture.score_a === null || fixture.score_b === null) continue;
    const list = rowsByUser.get(row.user_id) ?? [];
    list.push({ pred: row, fixture });
    rowsByUser.set(row.user_id, list);
  }

  const profiles: PlayerProfile[] = leaderboard.map((user, index) => ({
    id: user.id,
    name: user.name,
    initials: user.avatar,
    rank: index + 1,
    label: user.label,
    roast: user.roast,
    isBeerPayer: Boolean(user.roast),
    points: {
      total: user.points.total,
      groupMatches: user.points.groupMatches,
      groupStandings: user.points.groupStandings,
      knockout: user.points.knockout,
      bonus: user.points.bonus
    },
    stats: buildStats(rowsByUser.get(user.id) ?? []),
    badges: []
  }));

  assignBadges(profiles);
  return profiles;
}
