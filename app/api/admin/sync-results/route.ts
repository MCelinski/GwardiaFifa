import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/backend/admin-auth";
import { syncFootballDataMatches } from "@/lib/backend/football-data";
import { canUseSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: "Supabase admin env is not configured." }, { status: 500 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { dateFrom?: string; dateTo?: string };
    const result = await syncFootballDataMatches({ dateFrom: body.dateFrom, dateTo: body.dateTo });
    return NextResponse.json({ ok: true, provider: "football-data.org", result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, provider: "football-data.org", error: error instanceof Error ? error.message : "Unknown sync error" },
      { status: 500 }
    );
  }
}
