import Link from "next/link";
import { CalendarClock, ListChecks } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Flag } from "@/components/Flag";
import { LeagueCodeCard } from "@/components/LeagueCodeCard";
import { MatchHistoryModal } from "@/components/MatchHistoryModal";
import { StandingsProgressCard } from "@/components/StandingsProgressCard";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DashboardQuote } from "@/components/DashboardQuote";
import { HitCelebration } from "@/components/HitCelebration";
import { TodayBettingPanel } from "@/components/TodayBettingPanel";
import { NotificationOptIn } from "@/components/NotificationOptIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/backend/dashboard";
import { getExactHits } from "@/lib/backend/predictions-view";
import { getTodaysBettableMatches } from "@/lib/backend/fixtures";

export default async function DashboardPage() {
  const [todaysMatches, dashboard, exactHits] = await Promise.all([
    getTodaysBettableMatches(),
    getDashboardData(),
    getExactHits()
  ]);

  return (
    <AppShell>
      {exactHits.userId ? <HitCelebration userId={exactHits.userId} hits={exactHits.hits} /> : null}
      <div className="grid gap-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Gwardia Piwo</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Panel ligi</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Typuj wyniki, ustawiaj grupy i pilnuj deadline'ow. Typy znajomych sa ukryte do locka.
            </p>
            <DashboardQuote />
          </div>
          <LeagueCodeCard />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {dashboard.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <NotificationOptIn />

        <TodayBettingPanel matches={todaysMatches} />

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Twoje nastepne typy</CardTitle>
                <p className="text-sm text-muted-foreground">Brakujace typy, ktore nadal mozesz zapisac.</p>
              </div>
              <ListChecks className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.missingPredictions.length ? (
                dashboard.missingPredictions.map((match) => (
                  <div key={match.id} className="flex items-center justify-between gap-3 rounded-md border border-white/8 bg-white/5 p-3">
                    <div>
                      <p className="font-semibold">{match.teamA} vs {match.teamB}</p>
                      <p className="text-sm text-muted-foreground">Deadline: {match.deadline}</p>
                    </div>
                    <StatusBadge status={match.status} />
                  </div>
                ))
              ) : (
                <EmptyState title="Brak zaleglych typow." detail="Nie masz teraz otwartych meczow bez zapisanego typu." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mini tabela – top 5</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.leaderboard.length ? (
                dashboard.leaderboard.slice(0, 5).map((user, index) => (
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
                ))
              ) : (
                <EmptyState title="Leaderboard jest pusty." detail="Pojawi sie po dolaczeniu pierwszych graczy do ligi." />
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Najblizsze mecze</CardTitle>
              <p className="text-sm text-muted-foreground">Najbliższe mecze z terminarza turnieju.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <MatchHistoryModal />
              <Button asChild variant="secondary">
                <Link href="/predictions/group-matches">
                  <CalendarClock className="h-4 w-4" />
                  Otworz mecze
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.nextMatches.length ? (
              dashboard.nextMatches.map((match) => (
                <div key={match.id} className="rounded-lg border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={match.status} />
                    <span className="text-xs text-muted-foreground">{match.date}</span>
                  </div>
                  <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                    <Team flag={match.flagA} name={match.teamA} />
                    <span className="text-muted-foreground">vs</span>
                    <Team flag={match.flagB} name={match.teamB} right />
                  </div>
                  <p className="mt-3 border-t border-white/8 pt-3 text-center text-sm">
                    {match.prediction ? (
                      <span className="font-semibold text-gold">Twój typ: {match.prediction[0]}:{match.prediction[1]}</span>
                    ) : (
                      <span className="text-muted-foreground">Brak typu</span>
                    )}
                  </p>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 xl:col-span-3">
                <EmptyState title="Brak meczow w terminarzu." detail="Wejdz w Admin i kliknij Import official schedule." />
              </div>
            )}
          </CardContent>
        </Card>

        <StandingsProgressCard draftGroupsCount={dashboard.draftGroupsCount} />
      </div>
    </AppShell>
  );
}

function Team({ flag, name, right }: { flag: string; name: string; right?: boolean }) {
  return (
    <span className={`flex min-w-0 items-center gap-2 ${right ? "justify-end text-right" : ""}`}>
      {!right ? <Flag code={flag} name={name} className="h-6 w-8 shrink-0" /> : null}
      <span className="min-w-0 truncate text-sm font-semibold">{name}</span>
      {right ? <Flag code={flag} name={name} className="h-6 w-8 shrink-0" /> : null}
    </span>
  );
}
