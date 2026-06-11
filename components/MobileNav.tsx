"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarClock, FileText, Home, Shield, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/predictions/group-matches", label: "Mecze", icon: CalendarClock },
  { href: "/predictions/groups", label: "Grupy", icon: Shield },
  { href: "/predictions/knockout", label: "Puchar", icon: Trophy },
  { href: "/leaderboard", label: "Tabela", icon: BarChart3 },
  { href: "/rules", label: "Zasady", icon: FileText }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/92 px-2 py-2 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
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
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
