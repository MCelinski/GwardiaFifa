"use client";

import { GripVertical } from "lucide-react";
import type { Team } from "@/lib/types";

export function DraggableTeamRow({
  team,
  position,
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop
}: {
  team: Team;
  position: number;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: () => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="grid grid-cols-[32px_36px_1fr_auto_28px] items-center gap-3 rounded-md border border-white/8 bg-black/22 p-2 text-sm"
    >
      <span className="grid h-7 w-7 place-items-center rounded bg-white/8 font-bold text-gold">{position}</span>
      <span className="grid h-8 w-8 place-items-center rounded border border-white/10 bg-white/8 text-[11px] font-bold">{team.flag}</span>
      <span className="min-w-0 truncate font-semibold">{team.name}</span>
      <span className="text-xs text-muted-foreground">FIFA #{team.fifaRank}</span>
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
