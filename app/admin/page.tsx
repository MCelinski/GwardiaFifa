import { ShieldAlert } from "lucide-react";
import { AdminSyncPanel } from "@/components/AdminSyncPanel";
import { AppShell } from "@/components/AppShell";
import { DeadlineBanner } from "@/components/DeadlineBanner";

export default function AdminPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Admin only</p>
          <h1 className="mt-2 text-3xl font-black">League operations</h1>
          <p className="mt-2 text-muted-foreground">
            Placeholder controls for imports, syncs, result edits, locks, invite code management, and point recalculation.
          </p>
        </div>
        <DeadlineBanner>
          <ShieldAlert className="mr-2 inline h-4 w-4" />
          Destructive actions should require confirmation before connecting real data.
        </DeadlineBanner>
        <AdminSyncPanel />
      </div>
    </AppShell>
  );
}
