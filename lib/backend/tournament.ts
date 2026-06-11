import { getPrimaryLeague } from "@/lib/backend/league";
import { GROUP_STANDINGS_DEADLINE_LABEL } from "@/lib/rules";
import { createClient } from "@/lib/supabase/server";

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

function isMissingColumnError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "42703"
  );
}

export async function getTournamentPredictionState(): Promise<TournamentPredictionState> {
  const empty: TournamentPredictionState = {
    leagueId: "",
    teams: [],
    prediction: null,
    locked: false,
    deadlineLabel: GROUP_STANDINGS_DEADLINE_LABEL
  };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  const league = await getPrimaryLeague();

  if (!userId || !league?.id) return empty;

  const [{ data: teams }, { data: deadline }] = await Promise.all([
    supabase.from("teams").select("id, name, flag_code").order("name", { ascending: true }),
    supabase.from("world_cup_groups").select("standings_deadline").order("standings_deadline", { ascending: true }).limit(1).single()
  ]);

  const predictionQueries = [
    supabase
      .from("tournament_predictions")
      .select("champion_team_id, finalist_a_team_id, finalist_b_team_id, points, status")
      .eq("league_id", league.id)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("tournament_predictions")
      .select("champion_team_id, runner_up_team_id, third_place_team_id, points, status")
      .eq("league_id", league.id)
      .eq("user_id", userId)
      .maybeSingle()
  ] as const;

  let prediction: any = null;
  let predictionError: unknown = null;
  for (const query of predictionQueries) {
    const result = await query;
    if (!result.error) {
      prediction = result.data as typeof prediction;
      predictionError = null;
      break;
    }
    predictionError = result.error;
    if (!isMissingColumnError(result.error)) break;
  }

  if (predictionError) throw predictionError;

  const deadlineDate = deadline?.standings_deadline ? new Date(deadline.standings_deadline) : null;

  const dbTeams =
    teams?.map((team) => ({
      id: team.id,
      name: team.name,
      flag: team.flag_code
    })) ?? [];

  return {
    leagueId: league.id,
    teams: dbTeams,
    prediction: prediction
      ? {
          championTeamId: prediction.champion_team_id,
          runnerUpTeamId: "finalist_a_team_id" in prediction ? prediction.finalist_a_team_id : prediction.runner_up_team_id,
          thirdPlaceTeamId: "finalist_b_team_id" in prediction ? prediction.finalist_b_team_id : prediction.third_place_team_id,
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
      : empty.deadlineLabel
  };
}
