import { Clock, LockKeyhole, Save } from "lucide-react";
import { saveMatchPredictionFormAction } from "@/app/actions/predictions";
import type { TodayBettableMatch } from "@/lib/backend/fixtures";
import { MATCH_LOCK_MINUTES } from "@/lib/rules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { Flag } from "@/components/Flag";
import { Input } from "@/components/ui/input";

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
          Today
        </Badge>
      </CardHeader>
      <CardContent>
        {matches.length ? (
          <div className="grid gap-3 xl:grid-cols-2">
            {matches.map((match) => (
              <form key={match.id} action={saveMatchPredictionFormAction} className="rounded-lg border border-white/8 bg-black/20 p-4">
                <input type="hidden" name="fixtureId" value={match.id} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Badge variant={match.canPredict ? "green" : "muted"}>
                      {match.canPredict ? "open" : "locked"}
                    </Badge>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Start: {match.displayStartsAt} · Lock: {match.displayLockAt}
                    </p>
                  </div>
                  <span className="text-xs uppercase text-muted-foreground">
                    {match.stage === "group" ? `Group ${match.groupCode}` : match.round}
                  </span>
                </div>

                <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                  <Team flag={match.flagA} name={match.teamA} right />
                  <div className="flex items-center gap-2">
                    <Input
                      aria-label={`${match.teamA} score`}
                      className="h-11 w-12 text-center text-lg font-bold"
                      defaultValue={match.prediction?.scoreA ?? ""}
                      disabled={!match.canPredict}
                      inputMode="numeric"
                      name="scoreA"
                      required
                    />
                    <span className="text-muted-foreground">:</span>
                    <Input
                      aria-label={`${match.teamB} score`}
                      className="h-11 w-12 text-center text-lg font-bold"
                      defaultValue={match.prediction?.scoreB ?? ""}
                      disabled={!match.canPredict}
                      inputMode="numeric"
                      name="scoreB"
                      required
                    />
                  </div>
                  <Team flag={match.flagB} name={match.teamB} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
                  <span className="text-sm text-muted-foreground">
                    {match.prediction ? `Zapisano: ${match.prediction.scoreA}:${match.prediction.scoreB}` : "Brak typu"}
                  </span>
                  <Button size="sm" variant={match.canPredict ? "default" : "secondary"} disabled={!match.canPredict}>
                    {match.canPredict ? <Save className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
                    {match.canPredict ? "Zapisz typ" : "Zamknięte"}
                  </Button>
                </div>
              </form>
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

function Team({ flag, name, right }: { flag: string; name: string; right?: boolean }) {
  return (
    <span className={`flex min-w-0 items-center gap-2 ${right ? "justify-end text-right" : ""}`}>
      {!right ? <Flag code={flag} name={name} className="h-6 w-8 shrink-0" /> : null}
      <span className="min-w-0 truncate text-sm font-semibold">{name}</span>
      {right ? <Flag code={flag} name={name} className="h-6 w-8 shrink-0" /> : null}
    </span>
  );
}
