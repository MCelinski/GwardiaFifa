import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/backend/admin-auth";
import { canUseSupabaseAdmin, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: "Supabase admin env is not configured." }, { status: 500 });
  }

  const supabase = createAdminClient();
  const hasFootballKey = Boolean(process.env.FOOTBALL_DATA_API_KEY);

  await supabase.from("sync_logs").insert({
    job: "results.sync",
    status: hasFootballKey ? "success" : "warning",
    detail: hasFootballKey
      ? "Football API key configured. Replace placeholder adapter with football-data.org fetch."
      : "FOOTBALL_DATA_API_KEY missing. No external results were fetched.",
    meta: { provider: "football-data.org", implemented: false }
  });

  return NextResponse.json({
    ok: true,
    provider: "football-data.org",
    fetched: 0,
    note: "Adapter placeholder is ready; no real external calls are made yet."
  });
}
