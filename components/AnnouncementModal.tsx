"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

// One-time, app-wide announcement shown once per user after login. Bump
// NOTICE_ID whenever there is a new announcement to broadcast — anyone who has
// not acknowledged this exact id sees it once. Seen ids are stored per user in
// localStorage (mirrors HitCelebration), so it shows once per browser and the
// 60s auto-refresh does not re-trigger it.
const NOTICE_ID = "2026-06-22-draw-no-handicap";

// Points removed from each player when the draw handicap bonus was dropped
// (0008 -> 0009). Snapshot from scripts/draw-handicap-impact.mjs, 2026-06-22.
const DRAW_LOSSES = [
  { name: "Dymek", pts: 2 },
  { name: "Michu Jonas Tornado", pts: 2 },
  { name: "Franek", pts: 1 },
  { name: "Marcin", pts: 1 },
  { name: "Doomaoo", pts: 1 },
  { name: "Niki", pts: 1 },
];

function readSeen(key: string): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AnnouncementModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const storageKey = `gp-notice-seen:${userId}`;

  useEffect(() => {
    if (!readSeen(storageKey).includes(NOTICE_ID)) setOpen(true);
  }, [storageKey]);

  function dismiss() {
    setOpen(false);
    const seen = readSeen(storageKey);
    if (!seen.includes(NOTICE_ID)) {
      localStorage.setItem(storageKey, JSON.stringify([...seen, NOTICE_ID]));
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Any close (button, overlay, Esc) counts as acknowledging the notice.
        if (!next) dismiss();
      }}
    >
      <DialogContent className="max-w-lg text-center">
        <Megaphone className="mx-auto h-9 w-9 text-gold" />
        <DialogTitle className="mt-3 text-2xl font-black">Zmiana punktacji: remis 🤝</DialogTitle>
        <DialogDescription className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Remis ma różnicę bramek 0, więc handicap leciał za niego za darmo. Koniec promocji — od teraz
          trafiony remis to czysty rezultat. Ranking przeliczyliśmy wstecz.
        </DialogDescription>

        <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-white/5 p-4 text-left text-sm">
          <p className="flex items-center justify-between gap-3">
            <span>Dokładny wynik (też remisu)</span>
            <span className="shrink-0 font-bold text-gold">5 pkt</span>
          </p>
          <p className="flex items-center justify-between gap-3">
            <span>Poprawny rezultat (zwycięzca lub remis)</span>
            <span className="shrink-0 font-bold">3 pkt</span>
          </p>
          <p className="flex items-center justify-between gap-3">
            <span>Handicap (różnica bramek) — tylko gdy NIE remis</span>
            <span className="shrink-0 font-bold">+1 pkt</span>
          </p>
          <p className="border-t border-white/10 pt-2 text-xs text-muted-foreground">
            Trafiony remis bez dokładnego wyniku = 3 pkt (kiedyś 4). Reszta meczów bez zmian.
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 text-left text-sm">
          <p className="mb-2 font-bold">Lista poszkodowanych 🪦</p>
          <ul className="space-y-1">
            {DRAW_LOSSES.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-3">
                <span>{r.name}</span>
                <span className="shrink-0 font-bold text-red-400">−{r.pts} pkt</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs text-muted-foreground">
            Tracę najwięcej, więc reforma w pełni bezstronna. 🫡🍺
          </p>
        </div>

        <div className="mt-5">
          <Button onClick={dismiss}>Boli, ale gram dalej 🍺</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
