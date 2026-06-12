import { Medal, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLeaderboard } from "@/lib/backend/leaderboard";
import { getPrimaryLeague } from "@/lib/backend/league";

export default async function LeaderboardPage() {
  const league = await getPrimaryLeague();
  const users = await getLeaderboard(league?.id);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Ranking na żywo</p>
          <h1 className="mt-2 text-3xl font-black">Tabela Gwardia Piwo</h1>
          <p className="mt-2 text-muted-foreground">Punkty wszystkich graczy na żywo z rozwijaną historią.</p>
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

        <LeaderboardTable users={users} />
      </div>
    </AppShell>
  );
}
