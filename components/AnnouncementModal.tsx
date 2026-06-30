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
const NOTICE_ID = "2026-06-30-knockout-penalty-score";

// Holandia–Maroko 1:1 (karne 2:3 dla Maroka) wpadło do apki jako 3:4, bo API
// dokleja gole z karnych do wyniku regulaminowego. Po korekcie wynik to 1:1,
// a punkty przeliczone. Snapshot z 2026-06-30.
const PENALTY_GAINS = [
  { name: "Franek", bet: "1:1", pts: 5 },
  { name: "Marcin", bet: "1:1", pts: 5 },
  { name: "jonek", bet: "1:1", pts: 5 },
  { name: "Niki", bet: "2:2", pts: 3 },
];
const PENALTY_LOSSES = [
  { name: "Doomaoo", bet: "1:2", pts: 4 },
  { name: "Rumcajs z Gwardii", bet: "1:3", pts: 3 },
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
        <DialogTitle className="mt-3 text-2xl font-black">Korekta wyniku: karne ⚽</DialogTitle>
        <DialogDescription className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          W fazie pucharowej mecze rozstrzygnięte po karnych zaciągały się ze źle policzonym wynikiem — apka
          doklejała gole z rzutów karnych do wyniku z boiska. Naprawione: liczy się wynik regulaminowy, a karne
          decydują tylko o awansie. Ranking przeliczyliśmy wstecz.
        </DialogDescription>

        <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-white/5 p-4 text-left text-sm">
          <p className="flex items-center justify-between gap-3">
            <span className="font-semibold">Holandia 🇳🇱 vs Maroko 🇲🇦</span>
            <span className="shrink-0 font-bold">
              <span className="text-red-400 line-through">3:4</span> → <span className="text-gold">1:1</span>
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Po 90 min było 1:1, karne 2:3 dla Maroka. Apka pokazywała 3:4, więc punkty leciały od złego wyniku.
          </p>
          <p className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
            <span className="font-semibold">Niemcy 🇩🇪 vs Paragwaj 🇵🇾</span>
            <span className="shrink-0 font-bold">
              <span className="text-red-400 line-through">4:5</span> → <span className="text-gold">1:1</span>
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Też poprawione (1:1, karne 3:4) — ale tu wynik nikomu nie zmienił punktów.
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 text-left text-sm">
          <p className="mb-2 font-bold">Zyskują po korekcie 🎉 (Holandia–Maroko)</p>
          <ul className="space-y-1">
            {PENALTY_GAINS.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-3">
                <span>
                  {r.name} <span className="text-xs text-muted-foreground">({r.bet})</span>
                </span>
                <span className="shrink-0 font-bold text-emerald-400">+{r.pts} pkt</span>
              </li>
            ))}
          </ul>
          <p className="mb-2 mt-3 border-t border-white/10 pt-3 font-bold">Tracą błędne punkty 🪦</p>
          <ul className="space-y-1">
            {PENALTY_LOSSES.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-3">
                <span>
                  {r.name} <span className="text-xs text-muted-foreground">({r.bet})</span>
                </span>
                <span className="shrink-0 font-bold text-red-400">−{r.pts} pkt</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs text-muted-foreground">
            Trafiony dokładny wynik 1:1 = 5 pkt, trafiony remis = 3 pkt. Reszta typów bez zmian.
          </p>
        </div>

        <div className="mt-5">
          <Button onClick={dismiss}>Gram dalej 🍺</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
