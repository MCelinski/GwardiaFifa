"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type FriendMatchPrediction = {
  id: string;
  score_a: number;
  score_b: number;
  points: number | null;
  status: string;
  profiles: { display_name: string; avatar_initials: string } | { display_name: string; avatar_initials: string }[] | null;
};

function readProfile(profiles: FriendMatchPrediction["profiles"]) {
  if (Array.isArray(profiles)) return profiles[0] ?? null;
  return profiles;
}

export function FriendsPredictionsModal({
  locked = true,
  label = "Typy znajomych",
  fixtureId,
  groupId
}: {
  locked?: boolean;
  label?: string;
  fixtureId?: string;
  groupId?: string;
}) {
  const [predictions, setPredictions] = useState<FriendMatchPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadPredictions(open: boolean) {
    if (!open || loaded || !locked) return;
    const endpoint = fixtureId
      ? `/api/friends/match/${fixtureId}`
      : groupId
        ? `/api/friends/group/${groupId}`
        : null;
    if (!endpoint) return;

    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const payload = (await response.json().catch(() => ({}))) as { predictions?: FriendMatchPrediction[] };
      setPredictions(payload.predictions ?? []);
    } catch {
      setPredictions([]);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  return (
    <Dialog onOpenChange={loadPredictions}>
      <DialogTrigger asChild>
        <Button variant="secondary">{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-xl font-bold">Typy znajomych</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-muted-foreground">
          Typy są widoczne dopiero po zamknięciu okna typowania (start meczu lub deadline tabel).
        </DialogDescription>
        {locked ? (
          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Ladowanie typow...</p>
            ) : predictions.length ? (
              predictions.map((prediction) => {
                const profile = readProfile(prediction.profiles);
                return (
                  <div key={prediction.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-xs font-bold">{profile?.avatar_initials ?? "?"}</div>
                      <div>
                        <p className="font-semibold">{profile?.display_name ?? "Gracz"}</p>
                        <p className="text-sm text-muted-foreground">Typ: {prediction.score_a} : {prediction.score_b}</p>
                      </div>
                    </div>
                    {prediction.points !== null ? <Badge variant="gold">{prediction.points} pkt</Badge> : <Badge variant="muted">{prediction.status}</Badge>}
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-sm text-muted-foreground">
                Brak typow znajomych do pokazania.
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-6 text-center">
            <EyeOff className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-semibold">Typy znajomych są ukryte do deadline&apos;u.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
