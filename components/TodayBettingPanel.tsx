import { Clock } from "lucide-react";
import type { TodayBettableMatch } from "@/lib/backend/fixtures";
import { MATCH_LOCK_MINUTES } from "@/lib/rules";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { TodayBettingMatchForm } from "@/components/TodayBettingMatchForm";

export function TodayBettingPanel({ matches }: { matches: TodayBettableMatch[] }) {
  return (
    <Card className="border-gold/25">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Dzisiejsze mecze do obstawienia</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Typy zamykają się {MATCH_LOCK_MINUTES} minut przed pierwszym gwizdkiem.
          </p>
        </div>
        <Badge variant="gold">
          <Clock className="h-3.5 w-3.5" />
          Dziś
        </Badge>
      </CardHeader>
      <CardContent>
        {matches.length ? (
          <div className="grid gap-3 xl:grid-cols-2">
            {matches.map((match) => (
              <TodayBettingMatchForm key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Brak dzisiejszych meczów do obstawienia."
            detail="Gdy terminarz z Supabase lub football-data.org będzie zawierał mecze na dziś, pojawią się tutaj automatycznie."
          />
        )}
      </CardContent>
    </Card>
  );
}
