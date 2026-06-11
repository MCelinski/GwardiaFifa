"use client";

import { motion } from "framer-motion";
import { Beer, Lock, Trophy } from "lucide-react";
import { AuthJoinCard } from "@/components/AuthJoinCard";
import { league } from "@/lib/league";
import { GwardiaPiwoCrest } from "@/components/GwardiaPiwoCrest";
import { Badge } from "@/components/ui/badge";

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
          <AuthJoinCard />
        </motion.div>
      </section>
    </main>
  );
}
