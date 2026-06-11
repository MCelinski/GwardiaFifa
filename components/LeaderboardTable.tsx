"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, Trophy } from "lucide-react";
import type { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function LeaderboardTable({ users }: { users: User[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Rank</TH>
              <TH>User</TH>
              <TH>Total</TH>
              <TH className="hidden md:table-cell">Group matches</TH>
              <TH className="hidden md:table-cell">Group standings</TH>
              <TH className="hidden md:table-cell">Knockout</TH>
              <TH className="hidden md:table-cell">Bonus</TH>
              <TH className="hidden md:table-cell">Last gained</TH>
              <TH />
            </TR>
          </THead>
          <TBody>
            {users.map((user, index) => (
              <Fragment key={user.id}>
                <TR key={user.id}>
                  <TD className="font-bold text-gold">#{index + 1}</TD>
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/8 text-xs font-bold">{user.avatar}</div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <Badge variant={index === 0 ? "gold" : index < 3 ? "green" : "muted"}>{user.label}</Badge>
                      </div>
                    </div>
                  </TD>
                  <TD className="font-bold">{user.points.total}</TD>
                  <TD className="hidden md:table-cell">{user.points.groupMatches}</TD>
                  <TD className="hidden md:table-cell">{user.points.groupStandings}</TD>
                  <TD className="hidden md:table-cell">{user.points.knockout}</TD>
                  <TD className="hidden md:table-cell">{user.points.bonus}</TD>
                  <TD className={`hidden md:table-cell ${user.points.last ? "text-emerald-300" : "text-muted-foreground"}`}>+{user.points.last}</TD>
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
  );
}
