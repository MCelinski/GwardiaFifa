"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { saveGroupStandingPredictionAction } from "@/app/actions/predictions";
import type { GroupStandingPrediction, Team } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { DraggableTeamRow } from "@/components/DraggableTeamRow";

export function GroupPredictionCard({ group }: { group: GroupStandingPrediction }) {
  const [teams, setTeams] = useState<Team[]>(group.teams);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const locked = ["locked", "scored"].includes(group.status);

  function reorder(from: number, to: number) {
    if (locked || to < 0 || to >= teams.length || from === to) return;
    const next = [...teams];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setTeams(next);
  }

  function moveTeam(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex || locked) return;
    reorder(dragIndex, dropIndex);
    setDragIndex(null);
  }

  function save() {
    if (locked) return;
    setMessage(null);
    startTransition(async () => {
      try {
        await saveGroupStandingPredictionAction({
          groupId: group.groupId,
          orderedTeamIds: teams.map((team) => team.id)
        });
        setMessage("Zapisano kolejność.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Nie udało się zapisać.");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>Group {group.group}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Deadline {group.deadline}</p>
        </div>
        <StatusBadge status={group.status} />
      </CardHeader>
      <CardContent className="space-y-2">
        {teams.map((team, index) => (
          <DraggableTeamRow
            key={team.id}
            team={team}
            position={index + 1}
            draggable={!locked}
            locked={locked}
            canMoveUp={index > 0}
            canMoveDown={index < teams.length - 1}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => moveTeam(index)}
            onMoveUp={() => reorder(index, index - 1)}
            onMoveDown={() => reorder(index, index + 1)}
          />
        ))}
        <Button className="mt-3 w-full" variant={locked ? "secondary" : "default"} disabled={locked || isPending} onClick={save}>
          <Save className="h-4 w-4" />
          {locked ? "Zamknięte" : isPending ? "Zapisywanie..." : "Zapisz grupę"}
        </Button>
        {message ? <p className="text-center text-xs text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
