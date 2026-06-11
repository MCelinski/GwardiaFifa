import { NextRequest } from "next/server";
import { canUseSupabase, createClient } from "@/lib/supabase/server";

export async function isAuthorizedAdminRequest(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (configuredSecret && token === configuredSecret) {
    return true;
  }

  if (!configuredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  if (!canUseSupabase()) {
    return false;
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!userId) {
    return false;
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userId).single();
  if (profile?.is_admin) {
    return true;
  }

  const { data: membership } = await supabase
    .from("league_members")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  return membership?.role === "admin";
}
