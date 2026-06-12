"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { PartyPopper, X } from "lucide-react";
import type { ExactHit } from "@/lib/backend/predictions-view";
import { pickPraise } from "@/lib/praises";
import { Button } from "@/components/ui/button";

const COLORS = ["#d6a83d", "#f4e7bd", "#19a463"];

function fireConfetti() {
  // Center burst + a short stream from both edges.
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors: COLORS });
  const end = Date.now() + 800;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// Fires confetti + a popup the first time the user sees each exact-score hit.
// Celebrated fixture ids are remembered in localStorage (per user) so a hit is
// celebrated once, not on every visit or auto-refresh.
export function HitCelebration({ userId, hits }: { userId: string; hits: ExactHit[] }) {
  const [celebration, setCelebration] = useState<{ hit: ExactHit; praise: string; extra: number } | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || hits.length === 0) return;
    firedRef.current = true;

    const key = `gp-celebrated-hits:${userId}`;
    let seen: string[] = [];
    try {
      seen = JSON.parse(localStorage.getItem(key) ?? "[]");
    } catch {
      seen = [];
    }
    const seenSet = new Set(seen);
    const fresh = hits.filter((hit) => !seenSet.has(hit.fixtureId));

    // Always sync storage to the current hits so it never grows stale.
    localStorage.setItem(key, JSON.stringify(hits.map((hit) => hit.fixtureId)));

    if (fresh.length === 0) return;

    setCelebration({ hit: fresh[0], praise: pickPraise(), extra: fresh.length - 1 });
    fireConfetti();
  }, [userId, hits]);

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => setCelebration(null), 7000);
    return () => clearTimeout(timer);
  }, [celebration]);

  if (!celebration) return null;

  const { hit, praise, extra } = celebration;

  return (
    <div className="fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4 lg:bottom-8">
      <div className="relative w-full max-w-sm rounded-xl border border-gold/40 bg-ink/95 p-5 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <button
          type="button"
          aria-label="Zamknij"
          onClick={() => setCelebration(null)}
          className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <PartyPopper className="mx-auto h-8 w-8 text-gold" />
        <p className="mt-2 text-xl font-black text-foam">{praise}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Trafiłeś dokładny wynik <span className="font-bold text-foreground">{hit.teamA} {hit.scoreA}:{hit.scoreB} {hit.teamB}</span>
        </p>
        <p className="mt-3 inline-flex items-center gap-1 rounded-full border border-gold/35 bg-gold/15 px-3 py-1 text-sm font-bold text-foam">
          +5 pkt
        </p>
        {extra > 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">…i jeszcze {extra} {extra === 1 ? "takie trafienie" : "takie trafienia"}! 🔥</p>
        ) : null}
        <div className="mt-4">
          <Button size="sm" variant="secondary" onClick={() => setCelebration(null)}>
            Czapki z głów 🍺
          </Button>
        </div>
      </div>
    </div>
  );
}
