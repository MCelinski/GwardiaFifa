import { league as mockLeague, users as mockUsers } from "@/lib/mock-data";
import { canUseSupabase, createClient } from "@/lib/supabase/server";

export async function getCurrentUserProfile() {
  if (!canUseSupabase()) {
    return {
      id: "mock-user",
      display_name: mockUsers[0].name,
      avatar_initials: mockUsers[0].avatar,
      is_admin: true
    };
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!userId) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_initials, is_admin")
    .eq("id", userId)
    .single();

  return data;
}

export async function getPrimaryLeague() {
  if (!canUseSupabase()) {
    return { id: "mock-league", name: mockLeague.name, invite_code: mockLeague.inviteCode };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("leagues")
    .select("id, name, invite_code")
    .eq("invite_code", mockLeague.inviteCode)
    .single();

  return data;
}
