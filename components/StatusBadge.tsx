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

export function StatusBadge({ status }: { status: PredictionStatus }) {
  return <Badge variant={variants[status]}>{status}</Badge>;
}
