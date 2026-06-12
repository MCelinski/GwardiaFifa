import { AutoRefresh } from "@/components/AutoRefresh";
import { MobileNav } from "@/components/MobileNav";
import { TopNav } from "@/components/TopNav";
import { getCurrentUserProfile } from "@/lib/backend/league";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentUserProfile();
  const isAdmin = Boolean(profile?.is_admin);

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <AutoRefresh />
      <TopNav isAdmin={isAdmin} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <MobileNav />
    </div>
  );
}
