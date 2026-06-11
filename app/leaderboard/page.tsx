import { Medal, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { users } from "@/lib/mock-data";

const filters = ["overall", "group matches", "group standings", "knockout stage", "today"];

export default function LeaderboardPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Live ranking table</p>
          <h1 className="mt-2 text-3xl font-black">Gwardia Piwo leaderboard</h1>
          <p className="mt-2 text-muted-foreground">Live points for all friends with expandable point history.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {users.slice(0, 3).map((user, index) => (
            <Card key={user.id} className={index === 0 ? "border-gold/40 bg-gold/10" : ""}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <Badge variant={index === 0 ? "gold" : "green"}>#{index + 1}</Badge>
                  {index === 0 ? <Trophy className="h-6 w-6 text-gold" /> : <Medal className="h-6 w-6 text-emerald-300" />}
                </div>
                <p className="mt-4 text-xl font-bold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.label}</p>
                <p className="mt-4 text-3xl font-black text-foam">{user.points.total}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge key={filter} variant={filter === "overall" ? "gold" : "muted"}>{filter}</Badge>
          ))}
        </div>

        <LeaderboardTable users={users} />
      </div>
    </AppShell>
  );
}
