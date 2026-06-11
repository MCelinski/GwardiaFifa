import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/backend/admin-auth";
import { importOfficialSchedule } from "@/lib/backend/import-official-schedule";
import { canUseSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseSupabaseAdmin()) {
    return NextResponse.json({ error: "Supabase admin env is not configured." }, { status: 500 });
  }

  try {
    const result = await importOfficialSchedule();
    return NextResponse.json({ ok: true, source: "static-official-schedule", result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, source: "static-official-schedule", error: error instanceof Error ? error.message : "Unknown import error" },
      { status: 500 }
    );
  }
}
