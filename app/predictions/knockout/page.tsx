import { Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { MatchScoreCard } from "@/components/MatchScoreCard";
import { TournamentPicksCard } from "@/components/TournamentPicksCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTournamentPredictionState } from "@/lib/backend/tournament";
import { getKnockoutMatches } from "@/lib/backend/predictions-view";

export default async function KnockoutPage() {
  const [tournamentPickState, knockoutMatches] = await Promise.all([
    getTournamentPredictionState(),
    getKnockoutMatches()
  ]);

  const lockedStatuses = ["locked", "live", "scored"];

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Faza pucharowa</p>
          <h1 className="mt-2 text-3xl font-black">Podium i mecze pucharowe</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Przed turniejem typujesz tylko podium. Mecze pucharowe pojawiają się do typowania dopiero wtedy,
            gdy znane są obie drużyny.
          </p>
        </div>

        <TournamentPicksCard state={tournamentPickState} />

        <Card>
          <CardHeader>
            <CardTitle>Mecze pucharowe do obstawienia</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tylko mecze ze znanymi drużynami. Każdy typ zamyka się 10 minut przed pierwszym gwizdkiem.
            </p>
          </CardHeader>
          <CardContent>
            {knockoutMatches.length ? (
              <div className="grid gap-3 xl:grid-cols-2">
                {knockoutMatches.map((match) => (
                  <MatchScoreCard
                    key={match.id}
                    fixtureId={match.id}
                    teamA={match.teamA}
                    teamB={match.teamB}
                    contextLabel={match.round}
                    dateLabel={match.date}
                    locked={lockedStatuses.includes(match.status)}
                    prediction={match.prediction}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Brak meczów pucharowych do obstawienia."
                detail="Drużyny w fazie pucharowej są znane dopiero po rozstrzygnięciu grup. Mecze pojawią się tutaj automatycznie."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 text-gold" />
              Typy znajomych odsłaniają się po rozpoczęciu danego meczu.
            </p>
            <FriendsPredictionsModal locked={false} label="Typy znajomych" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
