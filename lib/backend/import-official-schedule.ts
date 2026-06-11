import { officialWorldCupSchedule } from "@/lib/official-schedule";
import { league } from "@/lib/league";
import { createAdminClient } from "@/lib/supabase/server";

const statusMap: Record<string, "scheduled" | "live" | "finished" | "locked"> = {
  SCHEDULED: "scheduled",
  TIMED: "scheduled",
  IN_PLAY: "live",
  PAUSED: "live",
  FINISHED: "finished",
  POSTPONED: "scheduled",
  SUSPENDED: "locked",
  CANCELLED: "locked"
};

export async function importOfficialSchedule() {
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

  const teamByName = new Map<string, { name: string; tla: string | null; groupCode: string | null }>();

  for (const match of officialWorldCupSchedule) {
    const groupCode = normalizeGroup(match.group);
    for (const team of [match.homeTeam, match.awayTeam]) {
      if (!team.name || team.name.toUpperCase() === "TBD") continue;
      teamByName.set(team.name, {
        name: team.name,
        tla: team.tla,
        groupCode
      });
    }
  }

  const { error: teamsError } = await supabase.from("teams").upsert(
    Array.from(teamByName.values()).map((team) => ({
      name: team.name,
      flag_code: team.tla ?? team.name.slice(0, 3).toUpperCase(),
      fifa_rank: null,
      group_code: team.groupCode
    })),
    { onConflict: "name" }
  );

  if (teamsError) throw teamsError;

  const { data: teams, error: teamFetchError } = await supabase.from("teams").select("id, name");
  if (teamFetchError) throw teamFetchError;

  const dbTeamByName = new Map((teams ?? []).map((team) => [team.name, team.id]));

  const fixtures = officialWorldCupSchedule.map((match) => {
    const groupCode = normalizeGroup(match.group);
    const stage = groupCode || match.stage?.toUpperCase().includes("GROUP") ? "group" : "knockout";

    return {
      external_id: `football-data:${match.id}`,
      league_id: leagueRow.id,
      stage,
      round: match.stage ?? (stage === "group" ? "Group Stage" : "Knockout"),
      group_code: groupCode,
      team_a_id: match.homeTeam.name ? dbTeamByName.get(match.homeTeam.name) ?? null : null,
      team_b_id: match.awayTeam.name ? dbTeamByName.get(match.awayTeam.name) ?? null : null,
      placeholder_a: match.homeTeam.name ?? "TBD",
      placeholder_b: match.awayTeam.name ?? "TBD",
      starts_at: match.utcDate,
      status: statusMap[match.status] ?? "scheduled",
      score_a: null,
      score_b: null,
      winner_team_id: null
    };
  });

  const { error: fixturesError } = await supabase.from("fixtures").upsert(fixtures, { onConflict: "external_id" });
  if (fixturesError) throw fixturesError;

  await supabase.from("sync_logs").insert({
    job: "official-schedule.import",
    status: "success",
    detail: `Imported ${fixtures.length} official World Cup 2026 fixtures from static schedule.`,
    meta: { fixtures: fixtures.length, teams: teamByName.size, source: "football-data.org snapshot" }
  });

  return {
    leagueId: leagueRow.id,
    fixtures: fixtures.length,
    teams: teamByName.size
  };
}

function normalizeGroup(group: string | null | undefined) {
  if (!group) return null;
  const directMatch = group.match(/[A-L]$/i);
  const namedMatch = group.match(/GROUP_([A-L])/i);
  return (namedMatch?.[1] ?? directMatch?.[0] ?? null)?.toUpperCase() ?? null;
}
