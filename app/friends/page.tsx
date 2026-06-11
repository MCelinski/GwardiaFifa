import { EyeOff } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { groupMatches, groups } from "@/lib/mock-data";

export default function FriendsPage() {
  const lockedMatches = groupMatches.filter((match) => match.friendsVisible).slice(0, 6);

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
            {lockedMatches.map((match) => (
              <div key={match.id} className="rounded-lg border border-white/8 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={match.status} />
                  <Badge variant="green">visible</Badge>
                </div>
                <p className="mt-4 font-semibold">{match.teamA} vs {match.teamB}</p>
                <p className="text-sm text-muted-foreground">{match.date}</p>
                <div className="mt-4"><FriendsPredictionsModal locked /></div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Group standings predictions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {groups.slice(0, 6).map((group) => (
              <div key={group.group} className="rounded-lg border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Group {group.group}</p>
                  <StatusBadge status={group.status} />
                </div>
                {["locked", "scored"].includes(group.status) ? (
                  <div className="mt-4"><FriendsPredictionsModal locked label="Show tables" /></div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <EyeOff className="h-4 w-4" />
                    Typy znajomych są ukryte do deadline&apos;u.
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
