import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/backend/admin-auth";
import { canUseSupabaseAdmin } from "@/lib/supabase/server";
import { syncFootballDataMatches } from "@/lib/backend/football-data";

export async function GET(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: "Supabase admin env is not configured." }, { status: 500 });
  }

  try {
    const result = await syncFootballDataMatches();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown sync error" }, { status: 500 });
  }
}
