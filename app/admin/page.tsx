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
          <p className="text-sm font-semibold uppercase text-gold">Tylko admin</p>
          <h1 className="mt-2 text-3xl font-black">Operacje ligi</h1>
          <p className="mt-2 text-muted-foreground">
            Import oficjalnego terminarza, synchronizacja wyników na żywo i przeliczanie punktów. Operacji nieodwracalnych używaj ostrożnie.
          </p>
        </div>
        <DeadlineBanner>
          <ShieldAlert className="mr-2 inline h-4 w-4" />
          Te przyciski zapisują do Supabase z kluczem service role. Sprawdź dwa razy przed synchronizacją wyników lub przeliczeniem punktów.
        </DeadlineBanner>
        <AdminSyncPanel logs={logs} />
      </div>
    </AppShell>
  );
}
