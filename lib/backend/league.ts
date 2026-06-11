import { league } from "@/lib/league";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserProfile() {
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
  const supabase = await createClient();
  const { data } = await supabase
    .from("leagues")
    .select("id, name, invite_code")
    .eq("invite_code", league.inviteCode)
    .single();

  return data;
}
