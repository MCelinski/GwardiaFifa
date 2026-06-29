import { CheckCircle2, Clock, Lock, XCircle } from "lucide-react";
import { getLeaderboard } from "@/lib/backend/leaderboard";
import { getPrimaryLeague } from "@/lib/backend/league";
import { getPlayerPointsTimeline } from "@/lib/backend/player";
import { createClient } from "@/lib/supabase/server";
import { formatWarsawDateTime } from "@/lib/time";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";

export async function PointsBreakdown({ userId }: { userId: string }) {
  const supabase = await createClient();
  const league = await getPrimaryLeague();

  const [{ data: profile }, leaderboard, timeline] = await Promise.all([
    supabase.from("profiles").select("display_name, avatar_initials").eq("id", userId).maybeSingle(),
    getLeaderboard(league?.id),
    getPlayerPointsTimeline(userId)
  ]);

  const standing = leaderboard.find((user) => user.id === userId);

  if (!profile && !standing) {
    return <EmptyState title="Brak danych gracza." detail="Ten uzytkownik nie ma jeszcze profilu w lidze." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>{profile?.display_name ?? standing?.name ?? "Gracz"}</CardTitle>
          <p className="text-sm text-muted-foreground">{standing?.label ?? "Brak punktow"}</p>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            ["Punkty laczne", standing?.points.total ?? 0],
            ["Mecze grupowe", standing?.points.groupMatches ?? 0],
            ["Tabele grup", standing?.points.groupStandings ?? 0],
            ["Faza pucharowa", standing?.points.knockout ?? 0]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-md border border-white/8 bg-white/5 p-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="font-bold text-foam">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historia zdobytych punktów</CardTitle>
          <p className="text-sm text-muted-foreground">Każdy oceniony typ — mecze, tabele grup i podium — od najnowszego.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {timeline.length ? (
            timeline.map((event) => (
              <div key={event.id} className="flex items-start gap-3 rounded-md border border-white/8 bg-black/20 p-3">
                <EventIcon points={event.points} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{event.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatWarsawDateTime(event.at)} · {event.category}</p>
                </div>
                <span className={`shrink-0 font-bold ${event.points > 0 ? "text-gold" : "text-muted-foreground"}`}>
                  {event.points > 0 ? `+${event.points}` : "0"}
                </span>
              </div>
            ))
          ) : (
            <EmptyState title="Brak zdobytych punktów." detail="Punkty pojawią się po rozegraniu i ocenieniu pierwszych typów." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EventIcon({ points }: { points: number }) {
  if (points <= 0) return <XCircle className="mt-1 h-5 w-5 text-red-300" />;
  if (points >= 5) return <Lock className="mt-1 h-5 w-5 text-gold" />;
  if (points >= 3) return <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-300" />;
  return <Clock className="mt-1 h-5 w-5 text-muted-foreground" />;
}
