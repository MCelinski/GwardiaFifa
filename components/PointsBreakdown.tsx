import { CheckCircle2, Clock, Lock, XCircle } from "lucide-react";
import { pointEvents, users } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PointsBreakdown({ userId = "u1" }: { userId?: string }) {
  const user = users.find((item) => item.id === userId) ?? users[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.handle} · {user.label}</p>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            ["Group match accuracy", "64%"],
            ["Group standings accuracy", "58%"],
            ["Knockout accuracy", "61%"]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-md border border-white/8 bg-white/5 p-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="font-bold text-foam">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Points events timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pointEvents.map((event) => (
            <div key={event.label} className="flex items-start gap-3 rounded-md border border-white/8 bg-black/20 p-3">
              <EventIcon type={event.type} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{event.label}</p>
                <Badge className="mt-2" variant={event.type === "wrong" ? "red" : event.type === "hidden" ? "muted" : "gold"}>{event.type}</Badge>
              </div>
              <span className="font-bold text-gold">+{event.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function EventIcon({ type }: { type: string }) {
  if (type === "wrong") return <XCircle className="mt-1 h-5 w-5 text-red-300" />;
  if (type === "hidden") return <Clock className="mt-1 h-5 w-5 text-muted-foreground" />;
  if (type === "locked") return <Lock className="mt-1 h-5 w-5 text-gold" />;
  return <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-300" />;
}
