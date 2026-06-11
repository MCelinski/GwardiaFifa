export function scoreGroupMatchPrediction(prediction: [number, number], result: [number, number]) {
  const [predA, predB] = prediction;
  const [actualA, actualB] = result;
  const predictedDiff = predA - predB;
  const actualDiff = actualA - actualB;

  let points = 0;

  if (predA === actualA && predB === actualB) {
    points = Math.max(points, 5);
  } else if (Math.sign(predictedDiff) === Math.sign(actualDiff)) {
    points = Math.max(points, 3);
  } else if (predictedDiff === actualDiff) {
    points = Math.max(points, 2);
  }

  if (predA === actualA) points += 1;
  if (predB === actualB) points += 1;

  return points;
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
