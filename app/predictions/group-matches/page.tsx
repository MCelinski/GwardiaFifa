import { Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { GroupMatchPredictionCard } from "@/components/GroupMatchPredictionCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { groupMatches, type PredictionStatus } from "@/lib/mock-data";

const filters: Array<"all" | PredictionStatus> = ["all", "draft", "saved", "locked", "live", "scored"];

export default function GroupMatchesPage() {
  const grouped = groupMatches.reduce<Record<string, typeof groupMatches>>((acc, match) => {
    const date = match.date.split(" ")[0];
    acc[date] = acc[date] ?? [];
    acc[date].push(match);
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="space-y-5">
        <Header title="Group-stage match predictions" detail="All group-stage fixtures grouped by date and group. Each match locks when it starts." />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge key={filter} variant={filter === "all" ? "gold" : "muted"}>{filter === "draft" ? "missing" : filter}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-emerald-300">Auto-save active · last saved 22 sec ago</span>
            <Button>
              <Save className="h-4 w-4" />
              Save all predictions
            </Button>
          </div>
        </div>

        {Object.entries(grouped).map(([date, matches]) => (
          <section key={date} className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/6 px-4 py-3">
              <h2 className="font-bold">{date}</h2>
              <span className="text-sm text-muted-foreground">{matches.length} matches</span>
            </div>
            <div className="grid gap-3 xl:grid-cols-2">
              {matches.map((match) => (
                <GroupMatchPredictionCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))}

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-muted-foreground">After lock, friends predictions are available for that match.</p>
            <FriendsPredictionsModal locked label="Open locked match predictions" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Header({ title, detail }: { title: string; detail: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase text-gold">Gwardia Piwo</p>
      <h1 className="mt-2 text-3xl font-black">{title}</h1>
      <p className="mt-2 text-muted-foreground">{detail}</p>
    </div>
  );
}
