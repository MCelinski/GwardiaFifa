"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ListOrdered } from "lucide-react";
import type { GroupTable } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "@/components/Flag";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export function GroupTableCard({ group }: { group: GroupTable }) {
  const [showPrediction, setShowPrediction] = useState(false);
  const played = group.standings.reduce((sum, row) => sum + row.played, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Group {group.group}</CardTitle>
        <StatusBadge status={group.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-x-auto rounded-lg border border-white/8">
          <Table>
            <THead>
              <TR>
                <TH className="w-8 px-2 text-center">#</TH>
                <TH className="px-2">Drużyna</TH>
                <TH className="w-8 px-1 text-center" title="Mecze">M</TH>
                <TH className="w-8 px-1 text-center" title="Wygrane">Z</TH>
                <TH className="w-8 px-1 text-center" title="Remisy">R</TH>
                <TH className="w-8 px-1 text-center" title="Porażki">P</TH>
                <TH className="w-12 px-1 text-center" title="Bramki">Br.</TH>
                <TH className="w-10 px-1 text-center" title="Punkty">Pkt</TH>
              </TR>
            </THead>
            <TBody>
              {group.standings.map((row) => (
                <TR key={row.teamId}>
                  <TD className="px-2 py-2 text-center">
                    <span
                      className={cn(
                        "inline-grid h-5 w-5 place-items-center rounded text-xs font-bold",
                        row.position <= 2
                          ? "bg-emerald-400/20 text-emerald-300"
                          : row.isBestThird
                            ? "bg-amber-400/20 text-amber-300"
                            : "text-muted-foreground"
                      )}
                    >
                      {row.position}
                    </span>
                  </TD>
                  <TD className="px-2 py-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <Flag code={row.flag} name={row.name} className="h-4 w-6" />
                      <span className="min-w-0 truncate text-sm font-medium">{row.name}</span>
                    </span>
                  </TD>
                  <TD className="px-1 py-2 text-center tabular-nums text-muted-foreground">{row.played}</TD>
                  <TD className="px-1 py-2 text-center tabular-nums">{row.won}</TD>
                  <TD className="px-1 py-2 text-center tabular-nums">{row.drawn}</TD>
                  <TD className="px-1 py-2 text-center tabular-nums">{row.lost}</TD>
                  <TD className="px-1 py-2 text-center tabular-nums text-muted-foreground">
                    {row.goalsFor}:{row.goalsAgainst}
                  </TD>
                  <TD className="px-1 py-2 text-center font-bold tabular-nums text-foam">{row.points}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>

        {played === 0 ? (
          <p className="text-xs text-muted-foreground">Brak rozegranych meczów — tabela ruszy po pierwszym gwizdku.</p>
        ) : null}

        <Button variant="secondary" className="w-full" onClick={() => setShowPrediction((value) => !value)}>
          <ListOrdered className="h-4 w-4" />
          Twój typ
          {showPrediction ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showPrediction ? (
          group.prediction ? (
            <div className="space-y-3 rounded-lg border border-white/8 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Twoje ułożenie</p>
                <Badge variant="gold">Symulacja: {group.simulatedPoints} pkt</Badge>
              </div>
              <ol className="space-y-1.5">
                {group.prediction.map((team, index) => (
                  <li key={team.teamId} className="flex items-center gap-2 text-sm">
                    <span className="w-4 text-right font-mono text-muted-foreground">{index + 1}.</span>
                    <Flag code={team.flag} name={team.name} className="h-4 w-6" />
                    <span className="min-w-0 truncate">{team.name}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-muted-foreground">
                Tyle punktów dostałbyś za to ułożenie, gdyby faza grupowa skończyła się teraz. Oficjalne punkty doliczą się
                dopiero po zakończeniu całej fazy grupowej.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-white/8 bg-white/5 p-4 text-center text-sm text-muted-foreground">
              Nie ustawiłeś typu tej grupy.
            </div>
          )
        ) : null}
      </CardContent>
    </Card>
  );
}
