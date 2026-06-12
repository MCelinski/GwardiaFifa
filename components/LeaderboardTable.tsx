"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Trophy } from "lucide-react";
import type { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MetricKey = "total" | "groupMatches" | "groupStandings" | "knockout" | "last";

const filters: { key: MetricKey; label: string }[] = [
  { key: "total", label: "ogółem" },
  { key: "groupMatches", label: "mecze grupowe" },
  { key: "groupStandings", label: "tabele grup" },
  { key: "knockout", label: "faza pucharowa" },
  { key: "last", label: "dziś" }
];

export function LeaderboardTable({ users }: { users: User[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<MetricKey>("total");

  const sortedUsers = useMemo(
    () =>
      [...users].sort(
        (a, b) => b.points[activeFilter] - a.points[activeFilter] || b.points.total - a.points.total
      ),
    [users, activeFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button key={filter.key} type="button" onClick={() => setActiveFilter(filter.key)}>
            <Badge variant={filter.key === activeFilter ? "gold" : "muted"}>{filter.label}</Badge>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Poz.</TH>
              <TH>Gracz</TH>
              <TH className={cn(activeFilter === "total" && "text-foam")}>Razem</TH>
              <TH className={cn("hidden md:table-cell", activeFilter === "groupMatches" && "text-foam")}>Mecze</TH>
              <TH className={cn("hidden md:table-cell", activeFilter === "groupStandings" && "text-foam")}>Tabele</TH>
              <TH className={cn("hidden md:table-cell", activeFilter === "knockout" && "text-foam")}>Puchar</TH>
              <TH className="hidden md:table-cell">Bonus</TH>
              <TH className={cn("hidden md:table-cell", activeFilter === "last" && "text-foam")}>Ostatnio</TH>
              <TH />
            </TR>
          </THead>
          <TBody>
            {sortedUsers.map((user, index) => (
              <Fragment key={user.id}>
                <TR key={user.id}>
                  <TD className="font-bold text-gold">#{index + 1}</TD>
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/8 text-xs font-bold">{user.avatar}</div>
                      <div className="min-w-0">
                        <p className="font-semibold">{user.name}</p>
                        <Badge
                          variant={user.roast ? "muted" : index === 0 ? "gold" : index < 3 ? "green" : "muted"}
                          className={user.roast ? "border-amber-400/40 bg-amber-400/15 text-amber-300" : undefined}
                        >
                          {user.label}
                        </Badge>
                        {user.roast ? (
                          <p className="mt-1 max-w-[14rem] text-[11px] italic leading-tight text-amber-300/80">„{user.roast}”</p>
                        ) : null}
                      </div>
                    </div>
                  </TD>
                  <TD className={cn("font-bold", activeFilter === "total" && "text-foam")}>{user.points.total}</TD>
                  <TD className={cn("hidden md:table-cell", activeFilter === "groupMatches" && "font-bold text-foam")}>{user.points.groupMatches}</TD>
                  <TD className={cn("hidden md:table-cell", activeFilter === "groupStandings" && "font-bold text-foam")}>{user.points.groupStandings}</TD>
                  <TD className={cn("hidden md:table-cell", activeFilter === "knockout" && "font-bold text-foam")}>{user.points.knockout}</TD>
                  <TD className="hidden md:table-cell">{user.points.bonus}</TD>
                  <TD className={cn("hidden md:table-cell", activeFilter === "last" && "font-bold", user.points.last ? "text-emerald-300" : "text-muted-foreground")}>+{user.points.last}</TD>
                  <TD>
                    <Button
                      aria-label="Expand user history"
                      size="icon"
                      variant="ghost"
                      onClick={() => setExpanded(expanded === user.id ? null : user.id)}
                    >
                      {expanded === user.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </TD>
                </TR>
                {expanded === user.id ? (
                  <TR key={`${user.id}-expanded`} className="bg-white/[0.03]">
                    <TD colSpan={9}>
                      <div className="grid gap-3 p-2 text-sm text-muted-foreground md:grid-cols-3">
                        <span><Trophy className="mr-2 inline h-4 w-4 text-gold" /> Mecze grupowe: {user.points.groupMatches} pkt</span>
                        <span>Tabele grup: {user.points.groupStandings} pkt · Puchar: {user.points.knockout} pkt</span>
                        <span>Ostatnio zdobyte: +{user.points.last} pkt</span>
                      </div>
                    </TD>
                  </TR>
                ) : null}
              </Fragment>
            ))}
          </TBody>
        </Table>
      </div>
      </div>
    </div>
  );
}
