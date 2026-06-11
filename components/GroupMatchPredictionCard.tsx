import type { Match } from "@/lib/types";
import { MatchScoreCard } from "@/components/MatchScoreCard";

export function GroupMatchPredictionCard({ match }: { match: Match }) {
  const locked = ["locked", "live", "scored"].includes(match.status);

  return (
    <MatchScoreCard
      fixtureId={match.id}
      teamA={match.teamA}
      teamB={match.teamB}
      flagA={match.flagA}
      flagB={match.flagB}
      contextLabel={match.group ? `Group ${match.group}` : "Group stage"}
      dateLabel={match.date}
      deadlineLabel={match.deadline}
      locked={locked}
      isLive={match.status === "live"}
      prediction={match.prediction}
      result={match.result}
    />
  );
}
