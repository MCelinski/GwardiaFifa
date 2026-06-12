"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarClock, FileText, Home, Loader2, Shield, Trophy, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavProgressBar } from "@/components/NavProgressBar";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/predictions/group-matches", label: "Mecze", icon: CalendarClock },
  { href: "/predictions/groups", label: "Grupy", icon: Shield },
  { href: "/predictions/knockout", label: "Puchar", icon: Trophy },
  { href: "/leaderboard", label: "Tabela", icon: BarChart3 },
  { href: "/friends", label: "Znajomi", icon: Users },
  { href: "/rules", label: "Zasady", icon: FileText }
];

// Swaps the tab icon for a spinner while that tab's navigation is pending, so a
// tap gives instant feedback even before the new (dynamic) page renders.
function NavIcon({ Icon }: { Icon: LucideIcon }) {
  const { pending } = useLinkStatus();
  return pending ? <Loader2 className="mb-1 h-4 w-4 animate-spin" /> : <Icon className="mb-1 h-4 w-4" />;
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/92 px-2 py-2 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-7 gap-0.5">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-12 flex-col items-center justify-center rounded-md text-[11px] font-medium text-muted-foreground",
                active && "bg-gold/15 text-foam"
              )}
            >
              <NavProgressBar />
              <NavIcon Icon={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
