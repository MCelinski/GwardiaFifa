"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Beer, Lock, Mail, ShieldCheck, Trophy } from "lucide-react";
import { league } from "@/lib/mock-data";
import { GwardiaPiwoCrest } from "@/components/GwardiaPiwoCrest";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { signInAction, signUpAction } from "@/app/actions/auth";

export default function JoinLeaguePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Badge variant="gold">
            <Trophy className="h-3.5 w-3.5" />
            Private World Cup 2026 league
          </Badge>
          <div className="mt-8 flex items-center gap-5">
            <GwardiaPiwoCrest className="h-24 w-24" />
            <div>
              <p className="text-sm font-semibold uppercase text-gold">{league.name}</p>
              <h1 className="max-w-3xl text-4xl font-black tracking-normal text-foreground sm:text-6xl">
                {league.appName}
              </h1>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">{league.subtitle}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Live leaderboard", Trophy],
              ["Hidden picks before lock", Lock],
              ["Beer-and-football prestige", Beer]
            ].map(([label, Icon]) => (
              <div key={label as string} className="rounded-lg border border-white/10 bg-white/6 p-4">
                <Icon className="h-5 w-5 text-gold" />
                <p className="mt-3 text-sm font-semibold">{label as string}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="mx-auto max-w-md">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Dołącz do ligi</h2>
                <p className="mt-1 text-sm text-muted-foreground">Login or register with the private invite code.</p>
              </div>
              <form className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Email</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" name="email" placeholder="you@gwardia.pl" type="email" />
                  </div>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Password</span>
                  <Input name="password" placeholder="••••••••" type="password" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Display name</span>
                  <Input name="displayName" placeholder="Marek z Gwardii" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">League invite code</span>
                  <Input name="inviteCode" className="border-gold/40 bg-gold/10 font-mono text-primary" defaultValue={league.inviteCode} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Button formAction={signInAction} variant="secondary">
                    Login
                  </Button>
                  <Button formAction={signUpAction}>
                    <ShieldCheck className="h-4 w-4" />
                    Register
                  </Button>
                </div>
                <Button asChild className="w-full" variant="ghost">
                  <Link href="/dashboard">Preview dashboard without Supabase</Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}
