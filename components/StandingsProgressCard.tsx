import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TOTAL_GROUPS = 12;

export function StandingsProgressCard({ draftGroupsCount }: { draftGroupsCount: number }) {
  const saved = Math.max(0, TOTAL_GROUPS - draftGroupsCount);
  const complete = saved >= TOTAL_GROUPS;
  const pct = Math.round((saved / TOTAL_GROUPS) * 100);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {complete ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <Shield className="h-5 w-5 text-gold" />}
            <p className="font-semibold">Tabele grup</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {complete
              ? "Komplet! Wytypowałeś końcowe tabele wszystkich 12 grup."
              : `Wytypowano ${saved}/${TOTAL_GROUPS} grup. Ustaw kolejność miejsc przed deadline'em.`}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={saved} aria-valuemin={0} aria-valuemax={TOTAL_GROUPS}>
              <div
                className={`h-full rounded-full transition-all ${complete ? "bg-emerald-400" : "bg-gold"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 text-sm font-bold tabular-nums">{saved}/{TOTAL_GROUPS}</span>
          </div>
        </div>

        <Button asChild variant={complete ? "secondary" : "default"} className="w-full sm:w-auto">
          <Link href="/predictions/groups">
            {complete ? "Edytuj tabele" : "Ustaw tabele grup"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
