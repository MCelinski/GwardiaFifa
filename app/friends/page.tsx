import { EyeOff } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Flag } from "@/components/Flag";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGroupStageMatches, getGroupStandings } from "@/lib/backend/predictions-view";

export default async function FriendsPage() {
  const [matches, groups] = await Promise.all([getGroupStageMatches(), getGroupStandings()]);
  const lockedMatches = matches.filter((match) => match.friendsVisible).slice(0, 6);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Najpierw prywatność</p>
          <h1 className="mt-2 text-3xl font-black">Typy znajomych</h1>
          <p className="mt-2 text-muted-foreground">Widoczne dopiero po rozpoczęciu meczu lub po upływie deadline&apos;u tabel grup.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Odsłonięte typy meczów</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {lockedMatches.length ? (
              lockedMatches.map((match) => (
                <div key={match.id} className="rounded-lg border border-white/8 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={match.status} />
                    <Badge variant="green">widoczne</Badge>
                  </div>

                  {/* Realny wynik meczu (typy znajomych są w oknie poniżej) */}
                  <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                    <span className="flex min-w-0 items-center justify-end gap-2 text-right">
                      <span className="min-w-0 truncate text-sm font-semibold">{match.teamA}</span>
                      <Flag code={match.flagA} name={match.teamA} className="h-6 w-9 shrink-0" />
                    </span>
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-[10px] uppercase tracking-wide ${match.status === "live" ? "text-red-300" : "text-muted-foreground"}`}
                      >
                        {match.status === "live" ? "Wynik na żywo" : "Wynik"}
                      </span>
                      <span
                        className={`text-xl font-black tabular-nums ${match.status === "live" ? "text-red-300" : match.result ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {match.result ? `${match.result[0]} : ${match.result[1]}` : "– : –"}
                      </span>
                    </div>
                    <span className="flex min-w-0 items-center gap-2">
                      <Flag code={match.flagB} name={match.teamB} className="h-6 w-9 shrink-0" />
                      <span className="min-w-0 truncate text-sm font-semibold">{match.teamB}</span>
                    </span>
                  </div>

                  <p className="mt-2 text-center text-xs text-muted-foreground">{match.date}</p>
                  <div className="mt-4"><FriendsPredictionsModal locked fixtureId={match.id} /></div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2">
                <EmptyState title="Brak widocznych typow." detail="Typy meczowe znajomych odslaniaja sie po rozpoczeciu danego meczu." />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typy tabel grup</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {groups.length ? (
              groups.slice(0, 6).map((group) => (
                <div key={group.group} className="rounded-lg border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Group {group.group}</p>
                    <StatusBadge status={group.status} />
                  </div>
                  {["locked", "scored"].includes(group.status) ? (
                    <div className="mt-4"><FriendsPredictionsModal locked label="Pokaż tabele" groupId={group.group} /></div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <EyeOff className="h-4 w-4" />
                      Typy znajomych są ukryte do deadline&apos;u.
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="md:col-span-3">
                <EmptyState title="Brak grup." detail="Pojawia sie po imporcie oficjalnego terminarza." />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
