import { MobileNav } from "@/components/MobileNav";
import { TopNav } from "@/components/TopNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <MobileNav />
    </div>
  );
}
