import { BarChart3, CalendarClock, CircleDot, Medal, Shield, Trophy } from "lucide-react";
import { getLeaderboard, type LeaderboardUser } from "@/lib/backend/leaderboard";
import { getPrimaryLeague } from "@/lib/backend/league";
import { MATCH_LOCK_MINUTES } from "@/lib/rules";
import { createClient } from "@/lib/supabase/server";
import { formatWarsawDateTime } from "@/lib/time";
import type { PredictionStatus } from "@/lib/types";

export type DashboardFixture = {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  date: string;
  deadline: string;
  status: PredictionStatus;
  prediction?: [number, number];
};

export type DashboardStat = {
  label: string;
  value: string;
  detail: string;
  icon: typeof Trophy;
};

export type DashboardData = {
  stats: DashboardStat[];
  missingPredictions: DashboardFixture[];
  nextMatches: DashboardFixture[];
  leaderboard: LeaderboardUser[];
  draftGroupsCount: number;
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const league = await getPrimaryLeague();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!league?.id || !userId) {
    return emptyDashboard();
  }

  const leaderboard = await getLeaderboard(league.id);
  const currentRank = Math.max(leaderboard.findIndex((user) => user.id === userId) + 1, 0);
  const currentUser = leaderboard.find((user) => user.id === userId);
  const now = new Date();

  const [{ data: upcomingFixtures }, { data: userPredictions }, { data: groupRows }, { data: groupPredictions }] =
    await Promise.all([
      supabase
        .from("fixtures")
        .select("id, starts_at, status, stage, round, group_code, team_a:team_a_id(name, flag_code), team_b:team_b_id(name, flag_code), placeholder_a, placeholder_b")
        .eq("league_id", league.id)
        .gte("starts_at", now.toISOString())
        .order("starts_at", { ascending: true })
        .limit(18),
      supabase.from("match_predictions").select("fixture_id, score_a, score_b").eq("user_id", userId),
      supabase.from("world_cup_groups").select("id, status"),
      supabase.from("group_standing_predictions").select("group_id").eq("user_id", userId)
    ]);

  const predictionByFixture = new Map((userPredictions ?? []).map((prediction) => [prediction.fixture_id, prediction]));
  const predictionFixtureIds = new Set(predictionByFixture.keys());
  const predictedGroupIds = new Set((groupPredictions ?? []).map((prediction) => prediction.group_id));

  const missingPredictions = (upcomingFixtures ?? [])
    .filter((fixture) => !predictionFixtureIds.has(fixture.id))
    .filter((fixture) => new Date(fixture.starts_at).getTime() - MATCH_LOCK_MINUTES * 60 * 1000 > now.getTime())
    .slice(0, 4)
    .map((fixture) => fromDbFixture(fixture, predictionByFixture.get(fixture.id), now));

  const draftGroupsCount = (groupRows ?? []).filter((group) => !predictedGroupIds.has(group.id)).length;
  const nextMatches = (upcomingFixtures ?? [])
    .slice(0, 6)
    .map((fixture) => fromDbFixture(fixture, predictionByFixture.get(fixture.id), now));

  return {
    stats: [
      {
        label: "Pozycja",
        value: currentRank ? `#${currentRank}` : "-",
        detail: currentUser?.label ?? "Brak punktów",
        icon: Trophy
      },
      {
        label: "Punkty łącznie",
        value: String(currentUser?.points.total ?? 0),
        detail: `+${currentUser?.points.last ?? 0} dziś`,
        icon: BarChart3
      },
      {
        label: "Punkty za mecze",
        value: String(currentUser?.points.groupMatches ?? 0),
        detail: "Mecze fazy grupowej",
        icon: CircleDot
      },
      {
        label: "Punkty za tabele",
        value: String(currentUser?.points.groupStandings ?? 0),
        detail: `${Math.max(0, 12 - draftGroupsCount)}/12 grup zapisanych`,
        icon: Shield
      },
      {
        label: "Punkty za puchar",
        value: String(currentUser?.points.knockout ?? 0),
        detail: "Mecze i podium",
        icon: Medal
      },
      {
        label: "Najbliższy deadline",
        value: nextMatches[0]?.deadline.split(", ").at(-1) ?? "-",
        detail: nextMatches[0] ? `${nextMatches[0].teamA} vs ${nextMatches[0].teamB}` : "Brak nadchodzących meczów",
        icon: CalendarClock
      }
    ],
    missingPredictions,
    nextMatches,
    leaderboard,
    draftGroupsCount
  };
}

function emptyDashboard(): DashboardData {
  return {
    stats: [
      { label: "Pozycja", value: "-", detail: "Zaloguj się do Gwardia Piwo", icon: Trophy },
      { label: "Punkty łącznie", value: "0", detail: "Brak profilu", icon: BarChart3 },
      { label: "Punkty za mecze", value: "0", detail: "Brak typów", icon: CircleDot },
      { label: "Punkty za tabele", value: "0", detail: "Brak zapisanych grup", icon: Shield },
      { label: "Punkty za puchar", value: "0", detail: "Brak typów pucharowych", icon: Medal },
      { label: "Najbliższy deadline", value: "-", detail: "Brak meczów", icon: CalendarClock }
    ],
    missingPredictions: [],
    nextMatches: [],
    leaderboard: [],
    draftGroupsCount: 12
  };
}

function fromDbFixture(
  fixture: any,
  prediction: { score_a: number; score_b: number } | undefined,
  now: Date
): DashboardFixture {
  const startsAt = new Date(fixture.starts_at);
  const lockAt = new Date(startsAt.getTime() - MATCH_LOCK_MINUTES * 60 * 1000);
  const teamA = Array.isArray(fixture.team_a) ? fixture.team_a[0] : fixture.team_a;
  const teamB = Array.isArray(fixture.team_b) ? fixture.team_b[0] : fixture.team_b;

  return {
    id: fixture.id,
    teamA: teamA?.name ?? fixture.placeholder_a ?? "TBD",
    teamB: teamB?.name ?? fixture.placeholder_b ?? "TBD",
    flagA: teamA?.flag_code ?? "A",
    flagB: teamB?.flag_code ?? "B",
    date: formatWarsawDateTime(startsAt),
    deadline: formatWarsawDateTime(lockAt),
    status: resolveStatus(fixture.status, lockAt, now, Boolean(prediction)),
    prediction: prediction ? [prediction.score_a, prediction.score_b] : undefined
  };
}

// Combines the football-data fixture status with the local lock window and the
// user's own prediction so the badge reflects what the user actually sees:
// scored/live come from the feed, a passed lock shows "locked", a saved pick
// shows "saved", otherwise it's an open match with no pick yet ("draft").
function resolveStatus(fixtureStatus: string, lockAt: Date, now: Date, hasPrediction: boolean): PredictionStatus {
  if (fixtureStatus === "finished") return "scored";
  if (fixtureStatus === "live") return "live";
  if (fixtureStatus === "locked" || now >= lockAt) return "locked";
  if (hasPrediction) return "saved";
  return "draft";
}
