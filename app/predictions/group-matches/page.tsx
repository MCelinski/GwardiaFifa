import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { GroupMatchPredictionCard } from "@/components/GroupMatchPredictionCard";
import { Card, CardContent } from "@/components/ui/card";
import { getGroupStageMatches } from "@/lib/backend/predictions-view";
import type { Match } from "@/lib/types";

export default async function GroupMatchesPage() {
  const matches = await getGroupStageMatches();

  const grouped = matches.reduce<Record<string, Match[]>>((acc, match) => {
    const date = match.date.split(", ")[0];
    acc[date] = acc[date] ?? [];
    acc[date].push(match);
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="space-y-5">
        <Header title="Typy meczów fazy grupowej" detail="Wszystkie mecze fazy grupowej pogrupowane datami. Każdy typ zamyka się 10 minut przed pierwszym gwizdkiem." />

        {matches.length ? (
          Object.entries(grouped).map(([date, dayMatches]) => (
            <section key={date} className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/6 px-4 py-3">
                <h2 className="font-bold">{date}</h2>
                <span className="text-sm text-muted-foreground">{dayMatches.length} {dayMatches.length === 1 ? "mecz" : "meczów"}</span>
              </div>
              <div className="grid gap-3 xl:grid-cols-2">
                {dayMatches.map((match) => (
                  <GroupMatchPredictionCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <EmptyState title="Brak meczow w terminarzu." detail="Admin musi zaimportowac oficjalny terminarz World Cup 2026." />
        )}

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-muted-foreground">Typy znajomych stają się widoczne po rozpoczęciu meczu. Edycja zamyka się 10 minut przed pierwszym gwizdkiem.</p>
            <FriendsPredictionsModal locked label="Pokaż typy znajomych" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Header({ title, detail }: { title: string; detail: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase text-gold">Gwardia Piwo</p>
      <h1 className="mt-2 text-3xl font-black">{title}</h1>
      <p className="mt-2 text-muted-foreground">{detail}</p>
    </div>
  );
}
