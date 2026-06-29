import Link from "next/link";
import { ChevronRight, Crosshair, Goal, Percent, Target, TrendingUp } from "lucide-react";
import type { PlayerProfile } from "@/lib/backend/friends";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function rankAccent(rank: number): string {
  if (rank === 1) return "border-gold/40 bg-gold/15 text-foam";
  if (rank === 2) return "border-white/25 bg-white/12 text-foreground";
  if (rank === 3) return "border-amber-600/40 bg-amber-700/15 text-amber-200";
  return "border-white/10 bg-white/5 text-muted-foreground";
}

export function PlayerProfileCard({ profile }: { profile: PlayerProfile }) {
  const { stats } = profile;

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 p-5">
        {/* Header: avatar + name + rank/points */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-sm font-black">
              {profile.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-bold">{profile.name}</p>
              <p className="truncate text-xs text-muted-foreground">{profile.label}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={cn("rounded-full border px-2.5 py-1 text-xs font-bold", rankAccent(profile.rank))}>
              #{profile.rank}
            </span>
            <span className="mt-1 text-lg font-black tabular-nums text-gold">{profile.points.total}</span>
            <span className="text-[10px] uppercase text-muted-foreground">pkt łącznie</span>
          </div>
        </div>

        {/* Fun superlative badges */}
        {profile.badges.length ? (
          <div className="flex flex-wrap gap-1.5">
            {profile.badges.map((badge) => (
              <Badge key={badge.label} variant="gold" title={badge.hint}>
                <span aria-hidden>{badge.emoji}</span>
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Beer-payer roast */}
        {profile.isBeerPayer && profile.roast ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            🍺 {profile.roast}
          </p>
        ) : null}

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <StatTile icon={Percent} label="Trafność" value={`${stats.accuracyPct}%`} />
          <StatTile icon={Target} label="Idealne" value={String(stats.exact)} sub={`${stats.exactPct}%`} />
          <StatTile icon={TrendingUp} label="Śr. pkt" value={stats.avgPoints.toFixed(1)} />
          <StatTile icon={Crosshair} label="Typów" value={String(stats.predictions)} />
          <StatTile icon={Goal} label="Śr. goli" value={stats.avgGoals.toFixed(1)} />
          <StatTile icon={Percent} label="Remisy" value={`${stats.drawPredPct}%`} />
        </div>

        {/* Points breakdown */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <Badge variant="muted">Mecze {profile.points.groupMatches}</Badge>
          <Badge variant="muted">Tabele {profile.points.groupStandings}</Badge>
          <Badge variant="muted">Puchar {profile.points.knockout}</Badge>
          {profile.points.bonus ? <Badge variant="muted">Bonus {profile.points.bonus}</Badge> : null}
        </div>

        {/* Fun footer facts */}
        <div className="space-y-1.5 border-t border-white/8 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between gap-2">
            <span>Ulubiony wynik</span>
            <span className="font-semibold text-foreground">{stats.favoriteScore ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Najlepszy strzał</span>
            <span className="min-w-0 truncate text-right font-semibold text-foreground">
              {stats.bestHit ? `${stats.bestHit.label} · ${stats.bestHit.points} pkt` : "—"}
            </span>
          </div>
        </div>

        <Link
          href={`/prediction/${profile.id}`}
          className="flex items-center justify-center gap-1 rounded-md border border-white/10 bg-white/5 py-2 text-sm font-medium text-foam transition hover:bg-white/10"
        >
          Zobacz szczegóły typów
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/20 p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-gold" />
      <p className="mt-1 text-lg font-black leading-none tabular-nums">{value}</p>
      {sub ? <p className="text-[10px] text-muted-foreground">{sub}</p> : null}
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
