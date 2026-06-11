import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { AdminSyncPanel } from "@/components/AdminSyncPanel";
import { AppShell } from "@/components/AppShell";
import { DeadlineBanner } from "@/components/DeadlineBanner";
import { getCurrentUserProfile } from "@/lib/backend/league";
import { getRecentSyncLogs } from "@/lib/backend/admin-logs";

export default async function AdminPage() {
  const profile = await getCurrentUserProfile();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  const logs = await getRecentSyncLogs();

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Admin only</p>
          <h1 className="mt-2 text-3xl font-black">League operations</h1>
          <p className="mt-2 text-muted-foreground">
            Import the official schedule, sync live results, and recalculate points. Destructive actions should be used with care.
          </p>
        </div>
        <DeadlineBanner>
          <ShieldAlert className="mr-2 inline h-4 w-4" />
          These controls write to Supabase with the service role. Double-check before running result syncs or recalculations.
        </DeadlineBanner>
        <AdminSyncPanel logs={logs} />
      </div>
    </AppShell>
  );
}
