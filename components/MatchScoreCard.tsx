import { LockKeyhole, Save } from "lucide-react";
import { saveMatchPredictionInlineFormAction } from "@/app/actions/predictions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type MatchScoreCardProps = {
  fixtureId: string;
  teamA: string;
  teamB: string;
  flagA?: string;
  flagB?: string;
  contextLabel: string;
  dateLabel: string;
  deadlineLabel?: string;
  locked: boolean;
  prediction?: [number, number];
};

export function MatchScoreCard({
  fixtureId,
  teamA,
  teamB,
  flagA,
  flagB,
  contextLabel,
  dateLabel,
  deadlineLabel,
  locked,
  prediction
}: MatchScoreCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <form action={saveMatchPredictionInlineFormAction}>
          <input type="hidden" name="fixtureId" value={fixtureId} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge variant={locked ? "muted" : "green"}>{locked ? "locked" : "open"}</Badge>
              <p className="mt-2 text-xs text-muted-foreground">
                {dateLabel}
                {deadlineLabel ? ` · deadline ${deadlineLabel}` : ""}
              </p>
            </div>
            <span className="text-xs uppercase text-muted-foreground">{contextLabel}</span>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
            <TeamBlock flag={flagA} name={teamA} align="right" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Input
                aria-label={`${teamA} score`}
                className="h-11 w-11 shrink-0 px-0 text-center text-lg font-bold sm:w-12"
                defaultValue={prediction?.[0] ?? ""}
                disabled={locked}
                inputMode="numeric"
                name="scoreA"
                required
              />
              <span className="text-muted-foreground">:</span>
              <Input
                aria-label={`${teamB} score`}
                className="h-11 w-11 shrink-0 px-0 text-center text-lg font-bold sm:w-12"
                defaultValue={prediction?.[1] ?? ""}
                disabled={locked}
                inputMode="numeric"
                name="scoreB"
                required
              />
            </div>
            <TeamBlock flag={flagB} name={teamB} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
            <span className="text-sm text-muted-foreground">
              {prediction ? `Zapisany typ: ${prediction[0]}:${prediction[1]}` : "Brak typu"}
            </span>
            <Button size="sm" variant={locked ? "secondary" : "default"} disabled={locked}>
              {locked ? <LockKeyhole className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {locked ? "Zamknięte" : "Zapisz typ"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function TeamBlock({ flag, name, align = "left" }: { flag?: string; name: string; align?: "left" | "right" }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 sm:gap-3 ${align === "right" ? "justify-end text-right" : ""}`}>
      {align === "right" ? <span className="min-w-0 truncate text-sm font-semibold">{name}</span> : null}
      {flag ? <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 bg-white/8 text-[10px] font-bold">{flag}</span> : null}
      {align === "left" ? <span className="min-w-0 truncate text-sm font-semibold">{name}</span> : null}
    </div>
  );
}
