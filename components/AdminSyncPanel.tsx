"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Database, LockKeyhole, RefreshCw, ShieldAlert, Upload } from "lucide-react";
import type { SyncLogRow } from "@/lib/backend/admin-logs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

const actions = [
  { label: "Importuj oficjalny terminarz", icon: Upload, endpoint: "/api/admin/import-official-schedule" },
  { label: "Synchronizuj dzisiejsze wyniki", icon: RefreshCw, endpoint: "/api/admin/sync-results" },
  { label: "Przelicz punkty", icon: Database, endpoint: "/api/admin/recalculate" },
  { label: "Zablokuj/odblokuj okno typowania", icon: LockKeyhole },
  { label: "Zarządzaj kodem ligi", icon: ShieldAlert }
];

export function AdminSyncPanel({ logs }: { logs: SyncLogRow[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAction(endpoint?: string) {
    if (!endpoint) {
      setMessage("This control is not wired to a backend endpoint yet.");
      return;
    }

    startTransition(async () => {
      const response = await fetch(endpoint, { method: "POST" });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      setMessage(response.ok ? `Done: ${endpoint}` : payload.error ?? `Failed: ${endpoint}`);
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button key={action.label} variant="secondary" className="h-12 justify-start" disabled={isPending} onClick={() => runAction(action.endpoint)}>
              <Icon className="h-4 w-4 text-gold" />
              {action.label}
            </Button>
          );
        })}
        <Button variant="destructive" className="h-12 justify-start">
          <AlertTriangle className="h-4 w-4" />
          Ręcznie edytuj wynik meczu
        </Button>
      </div>

      {message ? (
        <div className="rounded-lg border border-white/10 bg-white/6 p-3 text-sm text-muted-foreground">{message}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Historia synchronizacji</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length ? (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Czas</TH>
                    <TH>Zadanie</TH>
                    <TH>Status</TH>
                    <TH>Szczegóły</TH>
                  </TR>
                </THead>
                <TBody>
                  {logs.map((log, index) => (
                    <TR key={`${log.time}-${log.job}-${index}`}>
                      <TD>{log.time}</TD>
                      <TD className="font-mono text-xs">{log.job}</TD>
                      <TD><Badge variant={log.status === "warning" ? "gold" : log.status === "error" ? "red" : "green"}>{log.status}</Badge></TD>
                      <TD className="text-muted-foreground">{log.detail}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          ) : (
            <EmptyState title="Brak logow synchronizacji." detail="Pojawia sie po pierwszym imporcie terminarza lub synchronizacji wynikow." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
