import { groups, teams as mockTeams } from "@/lib/mock-data";
import { getPrimaryLeague } from "@/lib/backend/league";
import { canUseSupabase, createClient } from "@/lib/supabase/server";

export type TournamentPickTeam = {
  id: string;
  name: string;
  flag: string;
};

export type TournamentPredictionState = {
  leagueId: string;
  teams: TournamentPickTeam[];
  prediction: {
    championTeamId: string | null;
    runnerUpTeamId: string | null;
    thirdPlaceTeamId: string | null;
    points: number;
    status: string;
  } | null;
  locked: boolean;
  deadlineLabel: string;
};

export async function getTournamentPredictionState(): Promise<TournamentPredictionState> {
  const fallback = {
    leagueId: "mock-league",
    teams: mockTeams.map((team) => ({ id: team.id, name: team.name, flag: team.flag })),
    prediction: null,
    locked: false,
    deadlineLabel: groups[0]?.deadline ?? "11 czerwca 2026, 23:59"
  };

  if (!canUseSupabase()) return fallback;

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  const league = await getPrimaryLeague();

  if (!userId || !league?.id) return fallback;

  const [{ data: teams }, { data: deadline }, { data: prediction }] = await Promise.all([
    supabase.from("teams").select("id, name, flag_code").order("name", { ascending: true }),
    supabase.from("world_cup_groups").select("standings_deadline").order("standings_deadline", { ascending: true }).limit(1).single(),
    supabase
      .from("tournament_predictions")
      .select("champion_team_id, runner_up_team_id, third_place_team_id, points, status")
      .eq("league_id", league.id)
      .eq("user_id", userId)
      .maybeSingle()
  ]);

  const deadlineDate = deadline?.standings_deadline ? new Date(deadline.standings_deadline) : null;

  const dbTeams =
    teams?.map((team) => ({
      id: team.id,
      name: team.name,
      flag: team.flag_code
    })) ?? [];

  return {
    leagueId: league.id,
    teams: dbTeams.length ? dbTeams : fallback.teams,
    prediction: prediction
      ? {
          championTeamId: prediction.champion_team_id,
          runnerUpTeamId: prediction.runner_up_team_id,
          thirdPlaceTeamId: prediction.third_place_team_id,
          points: prediction.points,
          status: prediction.status
        }
      : null,
    locked: deadlineDate ? deadlineDate <= new Date() : false,
    deadlineLabel: deadlineDate
      ? new Intl.DateTimeFormat("pl-PL", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Europe/Warsaw"
        }).format(deadlineDate)
      : fallback.deadlineLabel
  };
}
