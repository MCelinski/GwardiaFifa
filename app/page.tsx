"use client";

import { motion } from "framer-motion";
import { Beer, Lock, Trophy } from "lucide-react";
import { AuthJoinCard } from "@/components/AuthJoinCard";
import { league } from "@/lib/league";
import { GwardiaPiwoCrest } from "@/components/GwardiaPiwoCrest";
import { Badge } from "@/components/ui/badge";

export default function JoinLeaguePage() {
  return (
    <main className="min-h-screen w-full overflow-x-clip">
      <section className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative min-w-0"
        >
          <Badge variant="gold" className="max-w-full">
            <Trophy className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 truncate">Prywatna liga Mistrzostw Świata 2026</span>
          </Badge>
          <div className="mt-8 flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <GwardiaPiwoCrest className="h-16 w-16 shrink-0 sm:h-24 sm:w-24" />
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-gold">{league.name}</p>
              <h1 className="max-w-3xl break-words text-3xl font-black tracking-normal text-foreground sm:text-6xl">
                {league.appName}
              </h1>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">{league.subtitle}</p>
          <div className="mt-8 grid min-w-0 gap-3 sm:grid-cols-3">
            {[
              ["Tabela na żywo", Trophy],
              ["Typy ukryte do locka", Lock],
              ["Piwo i futbol – prestiż", Beer]
            ].map(([label, Icon]) => (
              <div key={label as string} className="min-w-0 rounded-lg border border-white/10 bg-white/6 p-4">
                <Icon className="h-5 w-5 shrink-0 text-gold" />
                <p className="mt-3 break-words text-sm font-semibold">{label as string}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="min-w-0"
        >
          <AuthJoinCard />
        </motion.div>
      </section>
    </main>
  );
}
