"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Keeps a long-open tab fresh. router.refresh() re-runs the server components
// for the current route (so results, the leaderboard, live group tables and
// deadline-derived lock states update) while preserving client state like
// typed-but-unsaved scores. Refreshes on an interval and whenever the tab
// regains focus — and never while hidden, to avoid pointless background work.
export function AutoRefresh({ intervalMs = 60000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") router.refresh();
    };

    const interval = setInterval(refreshIfVisible, intervalMs);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [router, intervalMs]);

  return null;
}
