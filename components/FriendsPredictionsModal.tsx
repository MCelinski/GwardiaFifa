"use client";

import { EyeOff } from "lucide-react";
import { friendsPredictions } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function FriendsPredictionsModal({ locked = true, label = "View friends predictions" }: { locked?: boolean; label?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-xl font-bold">Typy znajomych</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-muted-foreground">
          Predictions are shown only when the match or group window is locked.
        </DialogDescription>
        {locked ? (
          <div className="mt-5 space-y-3">
            {friendsPredictions.map((prediction) => (
              <div key={prediction.user.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-xs font-bold">{prediction.user.avatar}</div>
                  <div>
                    <p className="font-semibold">{prediction.user.name}</p>
                    <p className="text-sm text-muted-foreground">{prediction.score[0]} : {prediction.score[1]}</p>
                  </div>
                </div>
                <Badge variant={prediction.result === "exact" ? "gold" : prediction.result === "outcome" ? "green" : "red"}>
                  {prediction.result} · {prediction.points} pts
                </Badge>
              </div>
            ))}
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
