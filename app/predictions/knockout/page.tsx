import { Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BracketView } from "@/components/BracketView";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { TournamentPicksCard } from "@/components/TournamentPicksCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTournamentPredictionState } from "@/lib/backend/tournament";
import { knockoutMatches } from "@/lib/mock-data";

export default async function KnockoutPage() {
  const tournamentPickState = await getTournamentPredictionState();

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Bracket predictions</p>
            <h1 className="mt-2 text-3xl font-black">Knockout predictions</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Predict knockout match scores only when fixtures are known. Before the tournament, pick only the final podium.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="muted">Match picks unlock when teams are known</Badge>
            <Button>
              <Save className="h-4 w-4" />
              Save bracket
            </Button>
          </div>
        </div>

        <TournamentPicksCard state={tournamentPickState} />

        <BracketView matches={knockoutMatches} />

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-muted-foreground">
              Each knockout prediction locks 10 minutes before kickoff. Friends predictions unlock after kickoff.
            </p>
            <FriendsPredictionsModal locked={false} label="Preview hidden friends state" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
