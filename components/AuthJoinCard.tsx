"use client";

import { useState } from "react";
import { LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { signInAction, signUpAction } from "@/app/actions/auth";
import { league } from "@/lib/league";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Mode = "login" | "register";

export function AuthJoinCard() {
  const [mode, setMode] = useState<Mode>("register");
  const isRegister = mode === "register";

  return (
    <Card className="mx-auto w-full max-w-md min-w-0">
      <CardContent className="min-w-0 p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{isRegister ? "Dolacz do ligi" : "Zaloguj sie"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRegister
              ? "Stworz konto i wejdz do prywatnej ligi Gwardia Piwo."
              : "Masz juz konto? Zaloguj sie i przejdz do swoich typow."}
          </p>
        </div>

        <div className="mb-5 grid min-w-0 grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={cn(
              "flex h-10 min-w-0 items-center justify-center gap-2 rounded-md px-2 text-sm font-semibold text-muted-foreground transition",
              mode === "login" && "bg-white/10 text-foam"
            )}
          >
            <LogIn className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">Logowanie</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={cn(
              "flex h-10 min-w-0 items-center justify-center gap-2 rounded-md px-2 text-sm font-semibold text-muted-foreground transition",
              mode === "register" && "bg-gold/15 text-foam"
            )}
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">Rejestracja</span>
          </button>
        </div>

        <form className="min-w-0 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Email</span>
            <Input name="email" placeholder="you@gwardia.pl" type="email" required />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Haslo</span>
            <Input name="password" placeholder="min. 6 znakow" type="password" required minLength={6} />
          </label>

          {isRegister ? (
            <>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Nazwa w tabeli</span>
                <Input name="displayName" placeholder="Marek z Gwardii" />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Kod ligi</span>
                <Input
                  name="inviteCode"
                  className="border-gold/40 bg-gold/10 font-mono text-primary"
                  defaultValue={league.inviteCode}
                  required
                />
              </label>
              <Button formAction={signUpAction} className="w-full min-w-0">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">Utworz konto i dolacz</span>
              </Button>
            </>
          ) : (
            <>
              <input type="hidden" name="inviteCode" value={league.inviteCode} />
              <Button formAction={signInAction} className="w-full min-w-0">
                <LogIn className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">Zaloguj sie</span>
              </Button>
            </>
          )}
        </form>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
          Kod ligi: <span className="break-all font-mono text-gold">{league.inviteCode}</span>
        </div>
      </CardContent>
    </Card>
  );
}
