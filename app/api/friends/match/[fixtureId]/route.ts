import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ fixtureId: string }> }) {
  const { fixtureId } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("match_predictions")
    .select("id, score_a, score_b, points, status, profiles:user_id(display_name, avatar_initials)")
    .eq("fixture_id", fixtureId)
    .order("points", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });

  return NextResponse.json({ fixtureId, predictions: data });
}
