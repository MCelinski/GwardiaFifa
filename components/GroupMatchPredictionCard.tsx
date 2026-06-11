import { Eye, EyeOff, Save } from "lucide-react";
import type { Match } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";

export function GroupMatchPredictionCard({ match }: { match: Match }) {
  const disabled = ["locked", "live", "scored"].includes(match.status);
  const winner =
    match.prediction && match.prediction[0] !== match.prediction[1]
      ? match.prediction[0] > match.prediction[1]
        ? match.teamA
        : match.teamB
      : "Draw";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={match.status} />
              <span className="text-xs text-muted-foreground">Group {match.group}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{match.date} · deadline {match.deadline}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {match.friendsVisible ? <Eye className="h-4 w-4 text-emerald-300" /> : <EyeOff className="h-4 w-4" />}
            {match.friendsVisible ? "Friends visible" : "Prediction hidden until deadline"}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <TeamBlock flag={match.flagA} name={match.teamA} align="right" />
          <div className="flex items-center gap-2">
            <Input
              aria-label={`${match.teamA} score`}
              className="h-11 w-12 text-center text-lg font-bold"
              defaultValue={match.prediction?.[0] ?? ""}
              disabled={disabled}
              inputMode="numeric"
            />
            <span className="text-muted-foreground">:</span>
            <Input
              aria-label={`${match.teamB} score`}
              className="h-11 w-12 text-center text-lg font-bold"
              defaultValue={match.prediction?.[1] ?? ""}
              disabled={disabled}
              inputMode="numeric"
            />
          </div>
          <TeamBlock flag={match.flagB} name={match.teamB} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
          <p className="text-sm text-muted-foreground">Predicted winner: <span className="font-semibold text-foam">{winner}</span></p>
          <Button size="sm" variant={disabled ? "secondary" : "default"} disabled={disabled}>
            <Save className="h-4 w-4" />
            {disabled ? "Locked" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamBlock({ flag, name, align = "left" }: { flag: string; name: string; align?: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "justify-end text-right" : ""}`}>
      {align === "right" ? <span className="text-sm font-semibold">{name}</span> : null}
      <span className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/8 text-xs font-bold">{flag}</span>
      {align === "left" ? <span className="text-sm font-semibold">{name}</span> : null}
    </div>
  );
}
