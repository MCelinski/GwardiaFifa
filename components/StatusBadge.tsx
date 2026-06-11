import { Badge } from "@/components/ui/badge";
import type { PredictionStatus } from "@/lib/types";

const variants: Record<PredictionStatus, "gold" | "green" | "muted" | "red"> = {
  draft: "muted",
  saved: "green",
  locked: "gold",
  hidden: "muted",
  live: "red",
  scored: "green"
};

const labels: Record<PredictionStatus, string> = {
  draft: "brak typu",
  saved: "zapisany",
  locked: "zamknięty",
  hidden: "ukryty",
  live: "na żywo",
  scored: "rozliczony"
};

export function StatusBadge({ status }: { status: PredictionStatus }) {
  return (
    <Badge variant={variants[status]}>
      {status === "live" ? (
        <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-red-400" />
      ) : null}
      {labels[status]}
    </Badge>
  );
}
