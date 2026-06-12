"use client";

import { useEffect, useState } from "react";
import { Beer } from "lucide-react";
import { pickRandomQuote } from "@/lib/quotes";

// Picks a fresh quote on every dashboard entry. Chosen on the client after mount
// (so there is no SSR hydration mismatch) and held in state, so the 60s
// auto-refresh does not reshuffle it — it only changes when you actually revisit
// the dashboard. A non-breaking space reserves the line height before mount.
export function DashboardQuote() {
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    setQuote(pickRandomQuote());
  }, []);

  return (
    <p className="mt-3 flex items-center gap-2 text-sm italic text-amber-300/80">
      <Beer className="h-4 w-4 shrink-0 text-gold" />
      <span>{quote ?? " "}</span>
    </p>
  );
}
