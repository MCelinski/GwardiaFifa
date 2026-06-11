"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beer, Shield } from "lucide-react";
import { league } from "@/lib/league";
import { cn } from "@/lib/utils";
import { GwardiaPiwoCrest } from "@/components/GwardiaPiwoCrest";
import { Badge } from "@/components/ui/badge";

const baseNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/predictions/group-matches", label: "Mecze" },
  { href: "/predictions/groups", label: "Grupy" },
  { href: "/predictions/knockout", label: "Puchar" },
  { href: "/leaderboard", label: "Tabela" },
  { href: "/friends", label: "Typy znajomych" },
  { href: "/rules", label: "Regulamin" }
];

const adminNavItem = { href: "/admin", label: "Admin" };

export function TopNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <GwardiaPiwoCrest compact />
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-foreground">{league.name}</p>
            <p className="text-xs text-muted-foreground">World Cup 2026</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/8 hover:text-foreground",
                pathname === item.href && "bg-white/10 text-foam"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Badge variant="gold" className="hidden sm:inline-flex">
            {league.inviteCode}
          </Badge>
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/8 text-xs font-bold">
            GP
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 px-4 py-2 lg:hidden">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1.5">
            <Beer className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span className="truncate font-mono">{league.inviteCode}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-300" />
            Private
          </span>
        </div>
      </div>
    </header>
  );
}
