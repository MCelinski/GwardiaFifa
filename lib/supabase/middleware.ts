import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();

  let response = NextResponse.next({ request });

  if (!url || !key) {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  const path = request.nextUrl.pathname;
  // API routes authenticate themselves (Bearer token / RLS), so the session
  // guard must not touch them — redirecting the cron or admin endpoints to the
  // login page would break them.
  const isApiRoute = path.startsWith("/api");
  // The landing page ("/") hosts login + registration and is the only public page.
  const isPublicPage = path === "/";

  if (!isApiRoute) {
    if (!isAuthenticated && !isPublicPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isPublicPage) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return response;
}
