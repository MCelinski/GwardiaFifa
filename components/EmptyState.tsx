import { Beer, CircleDot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title = "Gwardia czeka na twoje typy.", detail }: { title?: string; detail?: string }) {
  return (
    <Card className="pitch-panel">
      <CardContent className="grid place-items-center p-8 text-center">
        <div className="relative">
          <CircleDot className="h-11 w-11 text-emerald-300" />
          <Beer className="absolute -right-3 -top-2 h-5 w-5 text-gold" />
        </div>
        <p className="mt-4 font-semibold">{title}</p>
        {detail ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
