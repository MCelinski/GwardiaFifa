export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabasePublishableKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function getSupabaseSecretKey() {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function requireSupabaseBrowserConfig() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }

  return { url, key };
}

export function requireSupabaseAdminConfig() {
  const url = getSupabaseUrl();
  const key = getSupabaseSecretKey();

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  }

  return { url, key };
}
