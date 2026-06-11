import { NextRequest, NextResponse } from "next/server";
import { groupMatches, groups, knockoutMatches, league } from "@/lib/mock-data";
import { isAuthorizedAdminRequest } from "@/lib/backend/admin-auth";
import { canUseSupabaseAdmin, createAdminClient } from "@/lib/supabase/server";
import { GROUP_STANDINGS_DEADLINE_ISO } from "@/lib/rules";

export async function POST(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: "Supabase admin env is not configured." }, { status: 500 });
  }

  const supabase = createAdminClient();

  const { data: leagueRow, error: leagueError } = await supabase
    .from("leagues")
    .upsert({ name: league.name, invite_code: league.inviteCode, is_private: true }, { onConflict: "invite_code" })
    .select("id")
    .single();

  if (leagueError) return NextResponse.json({ error: leagueError.message }, { status: 500 });

  const groupRows = groups.map((group, index) => ({
    code: group.group,
    standings_deadline: GROUP_STANDINGS_DEADLINE_ISO,
    status: group.status === "draft" ? "editable" : group.status === "live" ? "locked" : group.status
  }));

  const { error: groupsError } = await supabase
    .from("world_cup_groups")
    .upsert(groupRows, { onConflict: "code" });

  if (groupsError) return NextResponse.json({ error: groupsError.message }, { status: 500 });

  const teamRows = groups.flatMap((group) =>
    group.teams.map((team) => ({
      name: team.name,
      flag_code: team.flag,
      fifa_rank: team.fifaRank,
      group_code: team.group
    }))
  );

  const { error: teamsError } = await supabase.from("teams").upsert(teamRows, { onConflict: "name" });
  if (teamsError) return NextResponse.json({ error: teamsError.message }, { status: 500 });

  const { data: teamData, error: teamFetchError } = await supabase.from("teams").select("id, name");
  if (teamFetchError) return NextResponse.json({ error: teamFetchError.message }, { status: 500 });
  const teamByName = new Map(teamData.map((team) => [team.name, team.id]));

  const groupFixtureRows = groupMatches.map((match) => ({
    external_id: match.id,
    league_id: leagueRow.id,
    stage: "group" as const,
    round: "Group Stage",
    group_code: match.group,
    team_a_id: teamByName.get(match.teamA) ?? null,
    team_b_id: teamByName.get(match.teamB) ?? null,
    starts_at: new Date(match.date).toISOString(),
    status: match.status === "scored" ? "finished" : match.status === "live" ? "live" : match.status === "locked" ? "locked" : "scheduled",
    score_a: match.result?.[0] ?? null,
    score_b: match.result?.[1] ?? null
  }));

  const knockoutFixtureRows = knockoutMatches.map((match) => ({
    external_id: match.id,
    league_id: leagueRow.id,
    stage: "knockout" as const,
    round: match.round,
    placeholder_a: match.teamA,
    placeholder_b: match.teamB,
    starts_at: new Date(match.date).toISOString(),
    status: match.status === "scored" ? "finished" : match.status === "live" ? "live" : match.status === "locked" ? "locked" : "scheduled"
  }));

  const { error: fixturesError } = await supabase
    .from("fixtures")
    .upsert([...groupFixtureRows, ...knockoutFixtureRows], { onConflict: "external_id" });

  if (fixturesError) return NextResponse.json({ error: fixturesError.message }, { status: 500 });

  await supabase.from("sync_logs").insert({
    job: "mock.import",
    status: "success",
    detail: "Imported Gwardia Piwo mock league, teams, groups, and fixtures.",
    meta: { groupFixtures: groupFixtureRows.length, knockoutFixtures: knockoutFixtureRows.length }
  });

  return NextResponse.json({
    ok: true,
    leagueId: leagueRow.id,
    teams: teamRows.length,
    fixtures: groupFixtureRows.length + knockoutFixtureRows.length
  });
}
