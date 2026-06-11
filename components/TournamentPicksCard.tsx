import { Crown, Save, Trophy } from "lucide-react";
import { saveTournamentPredictionFormAction } from "@/app/actions/predictions";
import type { TournamentPredictionState } from "@/lib/backend/tournament";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TournamentPicksCard({ state }: { state: TournamentPredictionState }) {
  const firstTeam = state.teams[0]?.id ?? "";

  return (
    <Card className="border-gold/25">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Podium picks</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick only the final podium: champion, runner-up, and third place. Deadline: {state.deadlineLabel}.
          </p>
        </div>
        <Badge variant={state.locked ? "muted" : "gold"}>
          <Trophy className="h-3.5 w-3.5" />
          {state.locked ? "locked" : "open"}
        </Badge>
      </CardHeader>
      <CardContent>
        <form action={saveTournamentPredictionFormAction} className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <input type="hidden" name="leagueId" value={state.leagueId} />
          <PickSelect
            label="Champion"
            name="championTeamId"
            teams={state.teams}
            defaultValue={state.prediction?.championTeamId ?? firstTeam}
            disabled={state.locked}
          />
          <PickSelect
            label="Runner-up"
            name="runnerUpTeamId"
            teams={state.teams}
            defaultValue={state.prediction?.runnerUpTeamId ?? state.teams[1]?.id ?? firstTeam}
            disabled={state.locked}
          />
          <PickSelect
            label="Third place"
            name="thirdPlaceTeamId"
            teams={state.teams}
            defaultValue={state.prediction?.thirdPlaceTeamId ?? state.teams[2]?.id ?? firstTeam}
            disabled={state.locked}
          />
          <div className="flex items-end">
            <Button className="w-full" disabled={state.locked || !state.teams.length}>
              <Save className="h-4 w-4" />
              Save picks
            </Button>
          </div>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-gold" />
            Champion: 10 pts
          </span>
          <span>Runner-up: 6 pts</span>
          <span>Third place: 4 pts</span>
          {state.prediction ? <span>Saved status: {state.prediction.status}, points: {state.prediction.points}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function PickSelect({
  label,
  name,
  teams,
  defaultValue,
  disabled
}: {
  label: string;
  name: string;
  teams: TournamentPredictionState["teams"];
  defaultValue: string;
  disabled: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <select
        className="h-10 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        defaultValue={defaultValue}
        disabled={disabled}
        name={name}
        required
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.flag} {team.name}
          </option>
        ))}
      </select>
    </label>
  );
}
