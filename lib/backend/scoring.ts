// Scoring mirrors the Postgres function public.score_match_prediction
// (see supabase/migrations/0009_match_scoring_draw_no_handicap.sql). The
// database is the source of truth for the leaderboard; this TS version exists
// for any client-side preview and must stay in sync.
//
//   exact score ............................. 5 (hard max)
//   correct outcome (winner/draw) ........... +3
//   correct exact goal difference, non-draw . +1
//   (additive, capped at 5 -> a correct draw = 3, an exact draw = 5)
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

  // Handicap bonus only for non-draws, so a predicted draw never earns +1 just
  // by having difference 0.
  if (predictedDiff === actualDiff && actualDiff !== 0) {
    points += 1;
  }

  return Math.min(points, 5);
}

export function scoreKnockoutPrediction(prediction: [number, number], result: [number, number], winnerCorrect: boolean) {
  const base = scoreGroupMatchPrediction(prediction, result);
  return Math.max(base, winnerCorrect ? 3 : 0);
}

// Mirrors the Postgres function public.score_group_prediction_items
// (see supabase/migrations/0003_production_scoring_and_tournament_picks.sql).
// `actual` is the real final order of team ids (index 0 = position 1). Each
// predicted slot scores on a mutually-exclusive ladder, plus a perfect-order
// bonus — kept identical to the DB so the live simulation matches the official
// points awarded after the group stage.
//
//   exact position ............................ 3
//   else predicted top-2 and actually top-2 ... 1
//   else predicted 3rd and is a best third .... 1
//   all four positions exact .................. +3 bonus
export function scoreGroupOrder(predicted: string[], actual: string[], bestThirdIds: string[] = []) {
  let points = 0;

  predicted.forEach((teamId, index) => {
    if (actual[index] === teamId) {
      points += 3;
    } else if (index < 2 && actual.slice(0, 2).includes(teamId)) {
      points += 1;
    } else if (index === 2 && bestThirdIds.includes(teamId)) {
      points += 1;
    }
  });

  if (predicted.length === actual.length && predicted.every((teamId, index) => actual[index] === teamId)) {
    points += 3;
  }

  return points;
}
