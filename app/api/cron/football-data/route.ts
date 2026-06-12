import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/backend/admin-auth";
import { canUseSupabaseAdmin } from "@/lib/supabase/server";
import { syncFullWorldCupSchedule } from "@/lib/backend/football-data";

export async function GET(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: "Supabase admin env is not configured." }, { status: 500 });
  }

  try {
    // Sync the whole tournament window on every run, not just "today". A single-day
    // window meant a result was only captured if a cron happened to run after the
    // final whistle but still on the same Warsaw day — so matches finishing late in
    // the day (e.g. Mexico–South Africa, 21:00 Warsaw) were never back-filled and
    // their predictions stayed unscored. Re-fetching the full range is one cheap API
    // call and makes result ingestion robust to timezone and finalization timing.
    const result = await syncFullWorldCupSchedule();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown sync error" }, { status: 500 });
  }
}
