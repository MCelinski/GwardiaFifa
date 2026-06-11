import { Lock, Trophy } from "lucide-react";
import type { KnockoutMatch } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";

export function MatchPredictionCard({ match }: { match: KnockoutMatch }) {
  const locked = ["locked", "live", "scored"].includes(match.status);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">{match.round}</p>
            <p className="mt-1 text-sm text-muted-foreground">{match.date}</p>
          </div>
          <StatusBadge status={match.status} />
        </div>

        <div className="mt-4 space-y-3">
          <KnockoutTeam name={match.teamA} score={match.prediction?.[0]} locked={locked} />
          <KnockoutTeam name={match.teamB} score={match.prediction?.[1]} locked={locked} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
          {match.winner ? (
            <Badge variant="gold">
              <Trophy className="h-3.5 w-3.5" />
              {match.winner}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">Winner not selected</span>
          )}
          {locked ? <Lock className="h-4 w-4 text-gold" /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function KnockoutTeam({ name, score, locked }: { name: string; score?: number; locked: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_56px] items-center gap-3 rounded-md border border-white/8 bg-black/20 p-2">
      <span className="min-w-0 truncate text-sm font-semibold">{name}</span>
      <Input className="h-9 text-center font-bold" defaultValue={score ?? ""} disabled={locked} />
    </div>
  );
}
