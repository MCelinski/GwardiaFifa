import type { KnockoutMatch } from "@/lib/mock-data";
import { MatchPredictionCard } from "@/components/MatchPredictionCard";

const roundOrder = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Third-place match",
  "Final"
];

export function BracketView({ matches }: { matches: KnockoutMatch[] }) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="grid min-w-[1120px] grid-cols-6 gap-4">
        {roundOrder.map((round) => (
          <section key={round} className="space-y-3">
            <h2 className="sticky top-0 rounded-md border border-white/10 bg-white/8 px-3 py-2 text-sm font-semibold">{round}</h2>
            <div className="space-y-3">
              {matches.filter((match) => match.round === round).map((match) => (
                <MatchPredictionCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
