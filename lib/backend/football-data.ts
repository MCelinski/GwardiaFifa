import { league } from "@/lib/mock-data";
import { createAdminClient } from "@/lib/supabase/server";
import { toDateInputValue } from "@/lib/time";

type FootballDataTeam = {
  id: number | null;
  name: string | null;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
};

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED";
  stage?: string | null;
  group?: string | null;
  matchday?: number | null;
  homeTeam: FootballDataTeam;
  awayTeam: FootballDataTeam;
  score: {
    winner?: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
    fullTime?: {
      home: number | null;
      away: number | null;
    };
  };
};

type FootballDataResponse = {
  filters?: Record<string, unknown>;
  resultSet?: {
    count: number;
    first?: string;
    last?: string;
    played?: number;
  };
  matches: FootballDataMatch[];
};

export type FootballDataSyncResult = {
  fetched: number;
  upserted: number;
  recalculated: number;
  competition: string;
  dateFrom: string;
  dateTo: string;
};

export const WORLD_CUP_2026_DATE_FROM = "2026-06-11";
export const WORLD_CUP_2026_DATE_TO = "2026-07-19";

const statusMap: Record<FootballDataMatch["status"], "scheduled" | "live" | "finished" | "locked"> = {
  SCHEDULED: "scheduled",
  TIMED: "scheduled",
  IN_PLAY: "live",
  PAUSED: "live",
  FINISHED: "finished",
  POSTPONED: "scheduled",
  SUSPENDED: "locked",
  CANCELLED: "locked"
};

export async function syncFootballDataMatches(options: { dateFrom?: string; dateTo?: string } = {}): Promise<FootballDataSyncResult> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    throw new Error("Missing FOOTBALL_DATA_API_KEY.");
  }

  const competition = process.env.FOOTBALL_DATA_COMPETITION ?? "WC";
  const season = process.env.FOOTBALL_DATA_SEASON ?? "2026";
  const dateFrom = options.dateFrom ?? toDateInputValue();
  const dateTo = options.dateTo ?? dateFrom;
  const url = new URL(`https://api.football-data.org/v4/competitions/${competition}/matches`);
  url.searchParams.set("season", season);
  url.searchParams.set("dateFrom", dateFrom);
  url.searchParams.set("dateTo", dateTo);

  const response = await fetch(url, {
    headers: {
      "X-Auth-Token": apiKey
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`football-data.org ${response.status}: ${text.slice(0, 300)}`);
  }

  const payload = (await response.json()) as FootballDataResponse;
  const supabase = createAdminClient();

  const { data: leagueRow, error: leagueError } = await supabase
    .from("leagues")
    .upsert(
      {
        name: league.name,
        invite_code: league.inviteCode,
        is_private: true
      },
      { onConflict: "invite_code" }
    )
    .select("id")
    .maybeSingle();

  if (leagueError || !leagueRow) {
    throw new Error(leagueError?.message ?? `League ${league.inviteCode} could not be created or loaded.`);
  }

  const { error: groupsError } = await supabase.from("world_cup_groups").upsert(
    Array.from({ length: 12 }, (_, index) => ({
      code: String.fromCharCode("A".charCodeAt(0) + index),
      standings_deadline: "2026-06-11T21:59:59.000Z",
      status: "editable"
    })),
    { onConflict: "code" }
  );

  if (groupsError) throw groupsError;

  const teamRows = payload.matches.flatMap((match) => [match.homeTeam, match.awayTeam]).filter((team) => team?.name);

  if (teamRows.length) {
    const uniqueTeams = new Map(teamRows.map((team) => [team.name, team]));
    const { error: teamError } = await supabase.from("teams").upsert(
      Array.from(uniqueTeams.values()).map((team) => ({
        name: team.name!,
        flag_code: team.tla ?? team.shortName?.slice(0, 3).toUpperCase() ?? "TBD",
        fifa_rank: null,
        group_code: normalizeGroup(matchGroupForTeam(payload.matches, team.name!))
      })),
      { onConflict: "name" }
    );

    if (teamError) throw teamError;
  }

  const { data: teams, error: teamsError } = await supabase.from("teams").select("id, name");
  if (teamsError) throw teamsError;

  const teamByName = new Map((teams ?? []).map((team) => [team.name, team.id]));

  const fixtures = payload.matches.map((match) => {
    const groupCode = normalizeGroup(match.group);
    const stage = inferStage(match.stage, groupCode);

    return {
      external_id: `football-data:${match.id}`,
      league_id: leagueRow.id,
      stage,
      round: match.stage ?? (stage === "group" ? "Group Stage" : "Knockout"),
      group_code: groupCode,
      team_a_id: match.homeTeam.name ? teamByName.get(match.homeTeam.name) ?? null : null,
      team_b_id: match.awayTeam.name ? teamByName.get(match.awayTeam.name) ?? null : null,
      placeholder_a: match.homeTeam.name ?? "TBD",
      placeholder_b: match.awayTeam.name ?? "TBD",
      starts_at: match.utcDate,
      status: statusMap[match.status],
      score_a: match.score.fullTime?.home ?? null,
      score_b: match.score.fullTime?.away ?? null,
      winner_team_id:
        match.score.winner === "HOME_TEAM" && match.homeTeam.name
          ? teamByName.get(match.homeTeam.name) ?? null
          : match.score.winner === "AWAY_TEAM" && match.awayTeam.name
            ? teamByName.get(match.awayTeam.name) ?? null
            : null
    };
  });

  if (fixtures.length) {
    const { error: fixturesError } = await supabase.from("fixtures").upsert(fixtures, { onConflict: "external_id" });
    if (fixturesError) throw fixturesError;
  }

  const { data: recalculated, error: recalcError } = await (
    supabase.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>
    ) => Promise<{ data: number | null; error: { message: string } | null }>
  )("recalculate_league_points", { target_league_id: leagueRow.id });

  if (recalcError) throw new Error(recalcError.message);

  const result = {
    fetched: payload.matches.length,
    upserted: fixtures.length,
    recalculated: recalculated ?? 0,
    competition,
    dateFrom,
    dateTo
  };

  await supabase.from("sync_logs").insert({
    job: "football-data.sync",
    status: "success",
    detail: `Fetched ${result.fetched} matches, upserted ${result.upserted}, recalculated ${result.recalculated}.`,
    meta: result
  });

  return result;
}

export function syncFullWorldCupSchedule() {
  return syncFootballDataMatches({
    dateFrom: WORLD_CUP_2026_DATE_FROM,
    dateTo: WORLD_CUP_2026_DATE_TO
  });
}

function inferStage(stage: string | null | undefined, groupCode: string | null): "group" | "knockout" {
  if (groupCode) return "group";
  if (!stage) return "knockout";
  return stage.toUpperCase().includes("GROUP") ? "group" : "knockout";
}

function normalizeGroup(group: string | null | undefined) {
  if (!group) return null;
  const directMatch = group.match(/[A-L]$/i);
  const namedMatch = group.match(/GROUP_([A-L])/i);
  return (namedMatch?.[1] ?? directMatch?.[0] ?? null)?.toUpperCase() ?? null;
}

function matchGroupForTeam(matches: FootballDataMatch[], teamName: string) {
  return matches.find((match) => match.homeTeam.name === teamName || match.awayTeam.name === teamName)?.group ?? null;
}
