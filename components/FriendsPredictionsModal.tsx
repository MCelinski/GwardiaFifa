"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type TeamRef = { name: string; flag_code: string | null };

type GroupItem = {
  predicted_position: number;
  points: number | null;
  teams: TeamRef | TeamRef[] | null;
};

type FriendMatchPrediction = {
  id: string;
  score_a?: number;
  score_b?: number;
  points: number | null;
  status: string;
  profiles: { display_name: string; avatar_initials: string } | { display_name: string; avatar_initials: string }[] | null;
  group_standing_prediction_items?: GroupItem[];
};

function readProfile(profiles: FriendMatchPrediction["profiles"]) {
  if (Array.isArray(profiles)) return profiles[0] ?? null;
  return profiles;
}

function readTeam(teams: GroupItem["teams"]) {
  if (Array.isArray(teams)) return teams[0] ?? null;
  return teams;
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
                const items = prediction.group_standing_prediction_items;
                const isGroup = Boolean(groupId) && Array.isArray(items);
                const orderedItems = isGroup
                  ? [...(items ?? [])].sort((a, b) => a.predicted_position - b.predicted_position)
                  : [];
                return (
                  <div key={prediction.id} className="rounded-md border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-xs font-bold">{profile?.avatar_initials ?? "?"}</div>
                        <p className="font-semibold">{profile?.display_name ?? "Gracz"}</p>
                      </div>
                      {prediction.points !== null ? <Badge variant="gold">{prediction.points} pkt</Badge> : <Badge variant="muted">{prediction.status}</Badge>}
                    </div>
                    {isGroup ? (
                      <ol className="mt-3 space-y-1">
                        {orderedItems.map((item) => {
                          const team = readTeam(item.teams);
                          return (
                            <li key={item.predicted_position} className="flex items-center gap-2 text-sm">
                              <span className="w-4 text-right font-mono text-muted-foreground">{item.predicted_position}.</span>
                              <span className="min-w-0 truncate">{team?.name ?? "—"}</span>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">Typ: {prediction.score_a} : {prediction.score_b}</p>
                    )}
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
