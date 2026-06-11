"use client";

import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { Team } from "@/lib/types";

export function DraggableTeamRow({
  team,
  position,
  draggable = true,
  locked = false,
  canMoveUp = true,
  canMoveDown = true,
  onDragStart,
  onDragOver,
  onDrop,
  onMoveUp,
  onMoveDown
}: {
  team: Team;
  position: number;
  draggable?: boolean;
  locked?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onDragStart?: () => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="grid grid-cols-[28px_32px_1fr_auto] items-center gap-2 rounded-md border border-white/8 bg-black/22 p-2 text-sm sm:gap-3"
    >
      <span className="grid h-7 w-7 place-items-center rounded bg-white/8 font-bold text-gold">{position}</span>
      <span className="grid h-8 w-8 place-items-center rounded border border-white/10 bg-white/8 text-[11px] font-bold">{team.flag}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className="min-w-0 truncate font-semibold">{team.name}</span>
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">FIFA #{team.fifaRank}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Przesuń ${team.name} wyżej`}
          disabled={locked || !canMoveUp}
          onClick={onMoveUp}
          className="grid h-8 w-8 place-items-center rounded border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={`Przesuń ${team.name} niżej`}
          disabled={locked || !canMoveDown}
          onClick={onMoveDown}
          className="grid h-8 w-8 place-items-center rounded border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        <GripVertical className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </div>
    </div>
  );
}
