"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseBrowserConfig } from "@/lib/supabase/config";

export function createClient() {
  const { url, key } = requireSupabaseBrowserConfig();
  return createBrowserClient(url, key);
}
