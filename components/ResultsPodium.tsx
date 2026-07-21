"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Crown, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#d6a83d", "#f4e7bd", "#19a463"];

export type PodiumPlayer = { name: string; points: number; label: string };

// Celebratory 3-step podium with a one-shot confetti burst on mount. Mirrors the
// confetti pattern from HitCelebration; the ref guard keeps the 60s auto-refresh
// from re-firing it.
function fireConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: COLORS });
  const end = Date.now() + 900;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

const STEP: Record<number, { height: string; pedestal: string; badge: string; icon: typeof Trophy }> = {
  1: { height: "h-36 sm:h-44", pedestal: "from-gold/40 to-gold/5 border-gold/50", badge: "text-gold", icon: Crown },
  2: { height: "h-28 sm:h-32", pedestal: "from-foam/25 to-foam/5 border-foam/40", badge: "text-foam", icon: Medal },
  3: { height: "h-20 sm:h-24", pedestal: "from-pitch/35 to-pitch/5 border-pitch/40", badge: "text-emerald-300", icon: Medal }
};

export function ResultsPodium({ players }: { players: PodiumPlayer[] }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || players.length === 0) return;
    firedRef.current = true;
    fireConfetti();
  }, [players.length]);

  const [first, second, third] = players;
  // Wyświetlamy w kolejności: 2 (lewo) — 1 (środek) — 3 (prawo).
  const columns = [
    second ? { ...second, place: 2 } : null,
    first ? { ...first, place: 1 } : null,
    third ? { ...third, place: 3 } : null
  ].filter((column): column is PodiumPlayer & { place: number } => column !== null);

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-5">
      {columns.map((column, index) => {
        const step = STEP[column.place];
        const Icon = step.icon;
        return (
          <motion.div
            key={column.place}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            className="flex w-24 flex-col items-center sm:w-32"
          >
            <Icon className={cn("h-7 w-7 sm:h-8 sm:w-8", step.badge)} />
            <p className="mt-2 max-w-full truncate text-center text-sm font-bold sm:text-base">{column.name}</p>
            <p className="text-xs text-muted-foreground">{column.label}</p>
            <p className={cn("mt-1 text-2xl font-black sm:text-3xl", step.badge)}>{column.points}</p>
            <div
              className={cn(
                "mt-2 grid w-full place-items-start rounded-t-lg border border-b-0 bg-gradient-to-b pt-2 text-center",
                step.height,
                step.pedestal
              )}
            >
              <span className="mx-auto text-lg font-black text-foreground/80">#{column.place}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
