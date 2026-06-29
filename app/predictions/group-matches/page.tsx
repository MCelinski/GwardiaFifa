import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { MatchHistoryModal } from "@/components/MatchHistoryModal";
import { MatchScoreCard } from "@/components/MatchScoreCard";
import { Card, CardContent } from "@/components/ui/card";
import { getBettableMatches } from "@/lib/backend/predictions-view";
import type { BettableMatch } from "@/lib/types";

const LOCKED_STATUSES = ["locked", "live", "scored"];

export default async function MatchesPage() {
  const matches = await getBettableMatches({ upcomingOnly: true });

  // Group by calendar day (matches arrive chronologically, so day headings stay
  // in order). Both the group and knockout stage flow through this one list.
  const grouped = matches.reduce<Record<string, BettableMatch[]>>((acc, match) => {
    const day = match.date.split(", ")[0];
    acc[day] = acc[day] ?? [];
    acc[day].push(match);
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Header
            title="Typy meczów"
            detail="Dzisiejsze i nadchodzące mecze do obstawienia — faza grupowa i pucharowa — pogrupowane datami. Każdy typ zamyka się 10 minut przed pierwszym gwizdkiem."
          />
          <MatchHistoryModal />
        </div>

        {matches.length ? (
          Object.entries(grouped).map(([day, dayMatches]) => (
            <section key={day} className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/6 px-4 py-3">
                <h2 className="font-bold">{day}</h2>
                <span className="text-sm text-muted-foreground">
                  {dayMatches.length} {dayMatches.length === 1 ? "mecz" : "meczów"}
                </span>
              </div>
              <div className="grid gap-3 xl:grid-cols-2">
                {dayMatches.map((match) => (
                  <MatchScoreCard
                    key={match.id}
                    fixtureId={match.id}
                    teamA={match.teamA}
                    teamB={match.teamB}
                    flagA={match.flagA}
                    flagB={match.flagB}
                    contextLabel={match.contextLabel}
                    dateLabel={match.date}
                    deadlineLabel={match.deadline}
                    locked={LOCKED_STATUSES.includes(match.status)}
                    isLive={match.status === "live"}
                    prediction={match.prediction}
                    result={match.result}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <EmptyState
            title="Brak nadchodzących meczów."
            detail="Rozegrane mecze znajdziesz w „Historii meczów” u góry. Nowe mecze pojawią się tutaj automatycznie — także mecze pucharowe, gdy znane są obie drużyny."
          />
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
