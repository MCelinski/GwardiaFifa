import { EyeOff } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
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
          <p className="text-sm font-semibold uppercase text-gold">Privacy-first predictions</p>
          <h1 className="mt-2 text-3xl font-black">Friends predictions</h1>
          <p className="mt-2 text-muted-foreground">Visible only after the match starts or the group deadline is locked.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Locked match predictions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {lockedMatches.length ? (
              lockedMatches.map((match) => (
                <div key={match.id} className="rounded-lg border border-white/8 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={match.status} />
                    <Badge variant="green">visible</Badge>
                  </div>
                  <p className="mt-4 font-semibold">{match.teamA} vs {match.teamB}</p>
                  <p className="text-sm text-muted-foreground">{match.date}</p>
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
            <CardTitle>Group standings predictions</CardTitle>
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
                    <div className="mt-4"><FriendsPredictionsModal locked label="Show tables" groupId={group.group} /></div>
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
