import { Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BracketView } from "@/components/BracketView";
import { FriendsPredictionsModal } from "@/components/FriendsPredictionsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { knockoutMatches } from "@/lib/mock-data";

export default function KnockoutPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Bracket predictions</p>
            <h1 className="mt-2 text-3xl font-black">Knockout predictions</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Predict scores and winners from Round of 32 through the final. Unknown teams stay as bracket placeholders.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="muted">Teams update after group scoring</Badge>
            <Button>
              <Save className="h-4 w-4" />
              Save bracket
            </Button>
          </div>
        </div>

        <BracketView matches={knockoutMatches} />

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-muted-foreground">
              Each knockout prediction locks when the match starts. Friends predictions unlock after lock.
            </p>
            <FriendsPredictionsModal locked={false} label="Preview hidden friends state" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
