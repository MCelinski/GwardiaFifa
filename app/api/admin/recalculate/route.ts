import { NextRequest, NextResponse } from "next/server";
import { league } from "@/lib/mock-data";
import { isAuthorizedAdminRequest } from "@/lib/backend/admin-auth";
import { canUseSupabaseAdmin, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: "Supabase admin env is not configured." }, { status: 500 });
  }

  const supabase = createAdminClient();
  const body = (await request.json().catch(() => ({}))) as { leagueId?: string };

  const leagueId =
    body.leagueId ??
    (
      await supabase
        .from("leagues")
        .select("id")
        .eq("invite_code", league.inviteCode)
        .single()
    ).data?.id;

  if (!leagueId) {
    return NextResponse.json({ error: "League not found." }, { status: 404 });
  }

  const { data, error } = await (
    supabase.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>
    ) => Promise<{ data: number | null; error: { message: string } | null }>
  )("recalculate_league_points", { target_league_id: leagueId });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, updatedPredictions: data });
}
