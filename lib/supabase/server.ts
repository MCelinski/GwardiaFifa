import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  getSupabasePublishableKey,
  getSupabaseSecretKey,
  getSupabaseUrl,
  requireSupabaseAdminConfig,
  requireSupabaseBrowserConfig
} from "@/lib/supabase/config";

export async function createClient() {
  const { url, key } = requireSupabaseBrowserConfig();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot set cookies. Middleware refreshes auth state.
        }
      }
    }
  });
}

export function createAdminClient() {
  const { url, key } = requireSupabaseAdminConfig();
  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function canUseSupabase() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function canUseSupabaseAdmin() {
  return Boolean(getSupabaseUrl() && getSupabaseSecretKey());
}
