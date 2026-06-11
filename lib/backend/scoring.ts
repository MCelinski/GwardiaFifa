// Scoring mirrors the Postgres function public.score_match_prediction
// (see supabase/migrations/0005_match_scoring_margin_bonus.sql). The database
// is the source of truth for the leaderboard; this TS version exists for any
// client-side preview and must stay in sync.
//
//   exact score ........................ 5 (hard max)
//   correct outcome (winner/draw) ...... +3
//   correct exact goal difference ...... +1
//   correct goals of one team .......... +1
//   (additive, capped at 5)
export function scoreGroupMatchPrediction(prediction: [number, number], result: [number, number]) {
  const [predA, predB] = prediction;
  const [actualA, actualB] = result;

  if (predA === actualA && predB === actualB) {
    return 5;
  }

  let points = 0;
  const predictedDiff = predA - predB;
  const actualDiff = actualA - actualB;

  if (Math.sign(predictedDiff) === Math.sign(actualDiff)) {
    points += 3;
  }

  if (predictedDiff === actualDiff) {
    points += 1;
  }

  if (predA === actualA || predB === actualB) {
    points += 1;
  }

  return Math.min(points, 5);
}

export function scoreKnockoutPrediction(prediction: [number, number], result: [number, number], winnerCorrect: boolean) {
  const base = scoreGroupMatchPrediction(prediction, result);
  return Math.max(base, winnerCorrect ? 3 : 0);
}

export function scoreGroupOrder(predicted: string[], actual: string[], bestThirdIds: string[] = []) {
  let points = 0;

  predicted.forEach((teamId, index) => {
    if (actual[index] === teamId) points += 3;
    else if (index < 2 && actual.slice(0, 2).includes(teamId)) points += 1;
    if (index === 2 && bestThirdIds.includes(teamId)) points += 1;
  });

  if (predicted.every((teamId, index) => actual[index] === teamId)) {
    points += 3;
  }

  return points;
}
