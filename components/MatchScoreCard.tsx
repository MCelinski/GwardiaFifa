import { LockKeyhole, Pencil, Save } from "lucide-react";
import { saveMatchPredictionInlineFormAction } from "@/app/actions/predictions";
import { Flag } from "@/components/Flag";
import { StatusBadge } from "@/components/StatusBadge";
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
  isLive?: boolean;
  prediction?: [number, number];
  result?: [number, number];
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
  isLive = false,
  prediction,
  result
}: MatchScoreCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <form action={saveMatchPredictionInlineFormAction}>
          <input type="hidden" name="fixtureId" value={fixtureId} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              {isLive ? (
                <StatusBadge status="live" />
              ) : (
                <Badge variant={locked ? "muted" : "green"}>{locked ? "zamknięte" : "otwarte"}</Badge>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {dateLabel}
                {deadlineLabel ? ` · deadline ${deadlineLabel}` : ""}
              </p>
            </div>
            <span className="text-xs uppercase text-muted-foreground">{contextLabel}</span>
          </div>

          {/* Big scoreboard = real match result */}
          <div className="mt-5 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
            <TeamBlock flag={flagA} name={teamA} align="right" />
            <div className="flex flex-col items-center">
              <span
                className={`flex items-center gap-1 text-[10px] uppercase tracking-wide ${isLive ? "text-red-300" : "text-muted-foreground"}`}
              >
                {isLive ? <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" /> : null}
                {isLive ? "Wynik na żywo" : "Wynik"}
              </span>
              <span
                className={`text-2xl font-black tabular-nums ${isLive ? "text-red-300" : result ? "text-foreground" : "text-muted-foreground"}`}
              >
                {result ? `${result[0]} : ${result[1]}` : "– : –"}
              </span>
            </div>
            <TeamBlock flag={flagB} name={teamB} />
          </div>

          {/* Your prediction (editable until lock) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Twój typ:</span>
              <div className="flex items-center gap-1.5">
                <Input
                  aria-label={`Twój typ – ${teamA}`}
                  className="h-10 w-11 px-0 text-center text-base font-bold"
                  defaultValue={prediction?.[0] ?? ""}
                  disabled={locked}
                  inputMode="numeric"
                  name="scoreA"
                  required
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  aria-label={`Twój typ – ${teamB}`}
                  className="h-10 w-11 px-0 text-center text-base font-bold"
                  defaultValue={prediction?.[1] ?? ""}
                  disabled={locked}
                  inputMode="numeric"
                  name="scoreB"
                  required
                />
              </div>
            </div>
            <Button size="sm" variant={locked ? "secondary" : "default"} disabled={locked}>
              {locked ? (
                <LockKeyhole className="h-4 w-4" />
              ) : prediction ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {locked ? "Zamknięte" : prediction ? "Edytuj typ" : "Zapisz typ"}
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
      {flag ? <Flag code={flag} name={name} className="h-6 w-9 shrink-0" /> : null}
      {align === "left" ? <span className="min-w-0 truncate text-sm font-semibold">{name}</span> : null}
    </div>
  );
}
