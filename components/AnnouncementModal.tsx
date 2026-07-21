"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

// One-time, app-wide announcement shown once per user after login. Bump
// NOTICE_ID whenever there is a new announcement to broadcast — anyone who has
// not acknowledged this exact id sees it once. Seen ids are stored per user in
// localStorage (mirrors HitCelebration), so it shows once per browser and the
// 60s auto-refresh does not re-trigger it.
const NOTICE_ID = "2026-07-21-koniec-turnieju";

// Podium snapshot z zakończonego mundialu (finał 2026-07-19). Statyczne, bo
// ogłoszenie to jednorazowa migawka — pełne, zawsze świeże wyniki żyją na /wyniki.
const PODIUM = [
  { place: "🥇", name: "Niki", points: 345 },
  { place: "🥈", name: "Dymek", points: 342 },
  { place: "🥉", name: "Marcin", points: 328 },
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
        <PartyPopper className="mx-auto h-9 w-9 text-gold" />
        <DialogTitle className="mt-3 text-2xl font-black">Mundial dobiegł końca 🏆</DialogTitle>
        <DialogDescription className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          To już koniec — dzięki, że graliście z Gwardią przez cały turniej! Wszystkie punkty policzone, a oto podium.
        </DialogDescription>

        <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-white/5 p-4 text-left text-sm">
          {PODIUM.map((row) => (
            <p key={row.name} className="flex items-center justify-between gap-3">
              <span className="font-semibold">
                {row.place} {row.name}
              </span>
              <span className="shrink-0 font-bold text-gold">{row.points} pkt</span>
            </p>
          ))}
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <Button asChild onClick={dismiss}>
            <Link href="/wyniki">Zobacz wyniki 🎉</Link>
          </Button>
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-muted-foreground transition hover:text-foreground"
          >
            Może później
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
