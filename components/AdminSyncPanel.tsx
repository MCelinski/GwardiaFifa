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
  { label: "Import official schedule", icon: Upload, endpoint: "/api/admin/import-official-schedule" },
  { label: "Sync today's results", icon: RefreshCw, endpoint: "/api/admin/sync-results" },
  { label: "Recalculate points", icon: Database, endpoint: "/api/admin/recalculate" },
  { label: "Lock/unlock prediction window", icon: LockKeyhole },
  { label: "Manage league invite code", icon: ShieldAlert }
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
          Manually edit match result
        </Button>
      </div>

      {message ? (
        <div className="rounded-lg border border-white/10 bg-white/6 p-3 text-sm text-muted-foreground">{message}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Sync history logs</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length ? (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Time</TH>
                    <TH>Job</TH>
                    <TH>Status</TH>
                    <TH>Detail</TH>
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
