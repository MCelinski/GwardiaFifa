import { NextResponse } from "next/server";
import { canUseSupabase, createClient } from "@/lib/supabase/server";
import { groups } from "@/lib/mock-data";

export async function GET(_request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  if (!canUseSupabase()) {
    return NextResponse.json({ groupId, predictions: groups.slice(0, 1) });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("group_standing_predictions")
    .select("id, points, status, profiles:user_id(display_name, avatar_initials), group_standing_prediction_items(predicted_position, points, teams:team_id(name, flag_code))")
    .eq("group_id", groupId)
    .order("points", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });

  return NextResponse.json({ groupId, predictions: data });
}
