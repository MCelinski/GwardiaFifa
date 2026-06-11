import { AppShell } from "@/components/AppShell";
import { PointsBreakdown } from "@/components/PointsBreakdown";

export default async function PredictionDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Prediction detail</p>
          <h1 className="mt-2 text-3xl font-black">User prediction breakdown</h1>
          <p className="mt-2 text-muted-foreground">Accuracy, scoring categories, and point events timeline.</p>
        </div>
        <PointsBreakdown userId={userId} />
      </div>
    </AppShell>
  );
}
