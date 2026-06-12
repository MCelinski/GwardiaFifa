"use client";

import { useActionState } from "react";
import { LockKeyhole, Pencil, Save } from "lucide-react";
import { saveMatchPredictionState, type MatchSaveState } from "@/app/actions/predictions";
import type { TodayBettableMatch } from "@/lib/backend/fixtures";

const INITIAL_SAVE_STATE: MatchSaveState = { status: "idle" };
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flag } from "@/components/Flag";
import { ScoreInput } from "@/components/ScoreInput";
import { StatusBadge } from "@/components/StatusBadge";

export function TodayBettingMatchForm({ match }: { match: TodayBettableMatch }) {
  const [state, formAction, isPending] = useActionState(saveMatchPredictionState, INITIAL_SAVE_STATE);

  return (
    <form action={formAction} className="rounded-lg border border-white/8 bg-black/20 p-4">
      <input type="hidden" name="fixtureId" value={match.id} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {match.status === "live" ? (
            <StatusBadge status="live" />
          ) : (
            <Badge variant={match.canPredict ? "green" : "muted"}>{match.canPredict ? "otwarte" : "zamknięte"}</Badge>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Start: {match.displayStartsAt} · Lock: {match.displayLockAt}
          </p>
        </div>
        <span className="text-xs uppercase text-muted-foreground">
          {match.stage === "group" ? `Grupa ${match.groupCode}` : match.round}
        </span>
      </div>

      {/* Big scoreboard = real match result */}
      <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <Team flag={match.flagA} name={match.teamA} right />
        <div className="flex flex-col items-center">
          <span
            className={`flex items-center gap-1 text-[10px] uppercase tracking-wide ${match.status === "live" ? "text-red-300" : "text-muted-foreground"}`}
          >
            {match.status === "live" ? <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" /> : null}
            {match.status === "live" ? "Wynik na żywo" : "Wynik"}
          </span>
          <span
            className={`text-2xl font-black tabular-nums ${match.status === "live" ? "text-red-300" : match.result ? "text-foreground" : "text-muted-foreground"}`}
          >
            {match.result ? `${match.result[0]} : ${match.result[1]}` : "– : –"}
          </span>
        </div>
        <Team flag={match.flagB} name={match.teamB} />
      </div>

      {/* Your prediction (editable until lock) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Twój typ:</span>
          <div className="flex items-center gap-1.5">
            <ScoreInput
              ariaLabel={`Twój typ – ${match.teamA}`}
              defaultValue={match.prediction?.scoreA}
              disabled={!match.canPredict}
              name="scoreA"
            />
            <span className="text-muted-foreground">:</span>
            <ScoreInput
              ariaLabel={`Twój typ – ${match.teamB}`}
              defaultValue={match.prediction?.scoreB}
              disabled={!match.canPredict}
              name="scoreB"
            />
          </div>
        </div>
        <Button size="sm" variant={match.canPredict ? "default" : "secondary"} disabled={!match.canPredict || isPending}>
          {!match.canPredict ? (
            <LockKeyhole className="h-4 w-4" />
          ) : match.prediction ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {!match.canPredict ? "Zamknięte" : isPending ? "Zapisywanie..." : match.prediction ? "Edytuj typ" : "Zapisz typ"}
        </Button>
      </div>

      {state.status !== "idle" ? (
        <p className={`mt-3 text-center text-xs ${state.status === "error" ? "text-red-300" : "text-emerald-300"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
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
