import { Eye, Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DeadlineBanner } from "@/components/DeadlineBanner";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { GroupPredictionCard } from "@/components/GroupPredictionCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { groups } from "@/lib/mock-data";

export default function GroupStandingsPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">12 groups · 48 teams</p>
            <h1 className="mt-2 text-3xl font-black">Group final standings predictions</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Drag teams from 1 to 4 and save the predicted final order for every group.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="green">Auto-save enabled</Badge>
            <Button>
              <Save className="h-4 w-4" />
              Save all groups
            </Button>
          </div>
        </div>

        <DeadlineBanner>Typy końcowych tabel grup zostaną ukryte przed innymi do momentu deadline&apos;u.</DeadlineBanner>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <GroupPredictionCard key={group.group} group={group} />
          ))}
        </div>

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-muted-foreground">
              Locked view unlocks all friends&apos; group standings predictions after deadline.
            </p>
            <FriendsPredictionsModal locked label="View locked group predictions" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5 text-muted-foreground">
            <Eye className="h-5 w-5 text-gold" />
            Before lock: Typy znajomych są ukryte do deadline&apos;u.
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
