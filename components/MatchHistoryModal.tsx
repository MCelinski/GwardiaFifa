"use client";

import { useState } from "react";
import { History } from "lucide-react";
import type { HistoryMatch } from "@/lib/backend/history";
import { EmptyState } from "@/components/EmptyState";
import { Flag } from "@/components/Flag";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function MatchHistoryModal({ label = "Historia meczów" }: { label?: string }) {
  const [matches, setMatches] = useState<HistoryMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadHistory(open: boolean) {
    if (!open || loaded) return;
    setLoading(true);
    try {
      const response = await fetch("/api/history");
      const payload = (await response.json().catch(() => ({}))) as { matches?: HistoryMatch[] };
      setMatches(payload.matches ?? []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  return (
    <Dialog onOpenChange={loadHistory}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <History className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-xl font-bold">Historia meczów i typów</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-muted-foreground">
          Wynik każdego rozpoczętego meczu oraz typy wszystkich graczy z punktami. Widoczne od pierwszego gwizdka.
        </DialogDescription>

        <div className="mt-5 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Ładowanie historii…</p>
          ) : matches.length ? (
            matches.map((match) => <MatchCard key={match.id} match={match} />)
          ) : (
            <EmptyState
              title="Brak rozpoczętych meczów."
              detail="Historia pojawi się tutaj, gdy pierwszy mecz wystartuje."
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MatchCard({ match }: { match: HistoryMatch }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase text-muted-foreground">{match.roundLabel}</span>
        <StatusBadge status={match.status} />
      </div>

      <div className="mt-3 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
        <span className="flex min-w-0 items-center justify-end gap-2 text-right">
          <span className="min-w-0 truncate text-sm font-semibold">{match.teamA}</span>
          <Flag code={match.flagA} name={match.teamA} className="h-6 w-9 shrink-0" />
        </span>
        <span className="shrink-0 rounded-md bg-black/30 px-3 py-1 text-base font-black tabular-nums">
          {match.result ? `${match.result[0]}:${match.result[1]}` : "–:–"}
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <Flag code={match.flagB} name={match.teamB} className="h-6 w-9 shrink-0" />
          <span className="min-w-0 truncate text-sm font-semibold">{match.teamB}</span>
        </span>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">{match.date}</p>

      <div className="mt-4 space-y-2 border-t border-white/8 pt-3">
        {match.picks.length ? (
          match.picks.map((pick) => (
            <div key={pick.userId} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-[11px] font-bold">
                  {pick.initials}
                </span>
                <span className="min-w-0 truncate text-sm font-medium">{pick.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="tabular-nums text-sm text-muted-foreground">
                  {pick.score[0]}:{pick.score[1]}
                </span>
                <PointsBadge pick={pick} />
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Nikt nie typował tego meczu.</p>
        )}
      </div>
    </div>
  );
}

function PointsBadge({ pick }: { pick: HistoryMatch["picks"][number] }) {
  if (pick.points === null) return <Badge variant="muted">—</Badge>;
  if (pick.isExact) return <Badge variant="green">✓ {pick.points} pkt</Badge>;
  if (pick.points > 0) return <Badge variant="gold">{pick.points} pkt</Badge>;
  return <Badge variant="muted">0 pkt</Badge>;
}
