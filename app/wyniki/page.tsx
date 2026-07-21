import { Beer, CalendarCheck, Crown, Flame, ListChecks, Sparkles, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Flag } from "@/components/Flag";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { ResultsPodium } from "@/components/ResultsPodium";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { getResultsData } from "@/lib/backend/results";

// Zawsze świeże dane — spójnie z brakiem cache w service workerze.
export const revalidate = 0;

export default async function ResultsPage() {
  const results = await getResultsData();

  if (!results.isTournamentOver) {
    return (
      <AppShell>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Gwardia Piwo</p>
            <h1 className="mt-2 text-3xl font-black">Wyniki turnieju</h1>
          </div>
          <EmptyState
            title="Turniej wciąż trwa."
            detail="Podium, ciekawostki i podziękowania pojawią się tutaj po ostatnim gwizdku finału."
          />
        </div>
      </AppShell>
    );
  }

  const podiumPlayers = results.podium.map((user) => ({
    name: user.name,
    points: user.points.total,
    label: user.label
  }));

  const facts: { label: string; value: string; detail: string; icon: LucideIcon }[] = [
    {
      label: "Rozegrane mecze",
      value: String(results.facts.matchesPlayed),
      detail: "cały mundial od grupy po finał",
      icon: CalendarCheck
    },
    {
      label: "Zapisane typy",
      value: String(results.facts.totalPredictions),
      detail: "wszystkich graczy razem",
      icon: ListChecks
    },
    {
      label: "Idealne wyniki",
      value: String(results.facts.exactHits),
      detail: "trafienia co do gola (5 pkt)",
      icon: Target
    }
  ];
  if (results.facts.goldMargin !== null) {
    facts.push({
      label: results.facts.goldMargin === 0 ? "Złoto na styku" : "Złoto o włos",
      value: `${results.facts.goldMargin} pkt`,
      detail: "przewaga zwycięzcy nad wiceliderem",
      icon: Flame
    });
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Mundial dobiegł końca</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Wyniki Gwardia Piwo 🏆</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            To był kawał turnieju — dziesiątki meczów, tysiące goli i mnóstwo emocji. Dzięki, że graliście!
          </p>
        </header>

        <Card className="border-gold/25 bg-gradient-to-b from-gold/10 to-transparent">
          <CardContent className="p-6 sm:p-8">
            <ResultsPodium players={podiumPlayers} />
          </CardContent>
        </Card>

        {results.champion ? (
          <Card className="border-gold/25">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-4">
                <Crown className="h-8 w-8 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-semibold uppercase text-gold">Mistrz świata</p>
                  <div className="mt-1 flex items-center gap-2">
                    {results.champion.flag ? (
                      <Flag code={results.champion.flag} name={results.champion.name} className="h-6 w-8 shrink-0" />
                    ) : null}
                    <span className="text-2xl font-black">{results.champion.name}</span>
                  </div>
                </div>
              </div>
              {results.championPickers.length ? (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Wizjonerzy</span>, którzy go wytypowali:{" "}
                  <span className="font-semibold text-foam">{results.championPickers.join(", ")}</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Nikt nie wytypował mistrza — niespodzianka turnieju!</p>
              )}
            </CardContent>
          </Card>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-xl font-black">Liczby sezonu</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {facts.map((fact) => (
              <StatCard key={fact.label} {...fact} />
            ))}
          </div>
        </section>

        {results.superlatives.length ? (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              <h2 className="text-xl font-black">Ciekawostki i tytuły</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.superlatives.map((superlative) => (
                <Card key={superlative.label}>
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="text-3xl leading-none">{superlative.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground">{superlative.label}</p>
                      <p className="mt-1 truncate text-lg font-bold text-foam">{superlative.playerName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{superlative.hint}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-xl font-black">Tabela końcowa</h2>
          <LeaderboardTable users={results.standings} />
        </section>

        <Card className="border-gold/20 bg-gradient-to-b from-white/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Beer className="h-5 w-5 text-gold" />
              Podziękowania
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Wielkie dzięki dla całej ekipy Gwardii —{" "}
              <span className="font-semibold text-foreground">{results.standings.map((user) => user.name).join(", ")}</span>{" "}
              — za każdy zapisany typ, każdą kłótnię o wynik i za trzymanie tempa aż do finału.
            </p>
            <p>
              Gratulacje dla podium, szacunek dla walczących do końca, a dla ostatniego miejsca — no cóż, piwo samo się
              nie postawi. 🍺 Do zobaczenia przy kolejnym turnieju!
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
