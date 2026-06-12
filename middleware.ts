import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const runtime = "nodejs";

export const config = {
  // Exclude PWA resources (manifest + service worker) and static assets from the
  // session guard. The manifest is fetched without credentials, so without this
  // the auth redirect turns it into a 307 and the app is not installable.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)"
  ]
};
