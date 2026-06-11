import Link from "next/link";
import { CalendarClock, EyeOff, ListChecks } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { LeagueCodeCard } from "@/components/LeagueCodeCard";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, groupMatches, groups, users } from "@/lib/mock-data";

export default function DashboardPage() {
  const nextMatches = groupMatches.slice(8, 14);
  const missing = groupMatches.filter((match) => match.status === "draft").slice(0, 4);

  return (
    <AppShell>
      <div className="grid gap-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Gwardia Piwo</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Premium prediction command center</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Predict scores, group order, and knockout winners. Friends stay hidden until the relevant lock.
            </p>
          </div>
          <LeagueCodeCard />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Twoje następne typy</CardTitle>
                <p className="text-sm text-muted-foreground">Missing and locked prediction windows.</p>
              </div>
              <ListChecks className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent className="space-y-3">
              {missing.length ? missing.map((match) => (
                <div key={match.id} className="flex items-center justify-between gap-3 rounded-md border border-white/8 bg-white/5 p-3">
                  <div>
                    <p className="font-semibold">{match.teamA} vs {match.teamB}</p>
                    <p className="text-sm text-muted-foreground">{match.deadline}</p>
                  </div>
                  <StatusBadge status={match.status} />
                </div>
              )) : <EmptyState />}
              <div className="rounded-md border border-gold/20 bg-gold/10 p-3 text-sm text-foam">
                <EyeOff className="mr-2 inline h-4 w-4 text-gold" />
                Group standings for Groups A-B are locked. Friends predictions are now visible.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mini leaderboard top 5</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.slice(0, 5).map((user, index) => (
                <Link key={user.id} href={`/prediction/${user.id}`} className="flex items-center justify-between rounded-md border border-white/8 bg-white/5 p-3 transition hover:bg-white/8">
                  <span className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded bg-gold/15 font-bold text-gold">#{index + 1}</span>
                    <span>
                      <span className="block font-semibold">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.label}</span>
                    </span>
                  </span>
                  <span className="font-bold">{user.points.total}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Najbliższe mecze</CardTitle>
              <p className="text-sm text-muted-foreground">Flags, dates, status, and prediction visibility.</p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/predictions/group-matches">
                <CalendarClock className="h-4 w-4" />
                Open fixtures
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {nextMatches.map((match) => (
              <div key={match.id} className="rounded-lg border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={match.status} />
                  <span className="text-xs text-muted-foreground">{match.date}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Team flag={match.flagA} name={match.teamA} />
                  <span className="text-muted-foreground">vs</span>
                  <Team flag={match.flagB} name={match.teamB} right />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <EmptyState detail={`Groups waiting for standings picks: ${groups.filter((group) => group.status === "draft").length}`} />
      </div>
    </AppShell>
  );
}

function Team({ flag, name, right }: { flag: string; name: string; right?: boolean }) {
  return (
    <span className={`flex min-w-0 items-center gap-2 ${right ? "justify-end text-right" : ""}`}>
      {!right ? <span className="grid h-8 w-8 place-items-center rounded bg-white/8 text-xs font-bold">{flag}</span> : null}
      <span className="truncate text-sm font-semibold">{name}</span>
      {right ? <span className="grid h-8 w-8 place-items-center rounded bg-white/8 text-xs font-bold">{flag}</span> : null}
    </span>
  );
}
