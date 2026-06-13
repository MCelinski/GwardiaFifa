-- Simplify match scoring: drop the "correct goals of one team" bonus.
--
-- The previous margin-bonus model (migration 0005) awarded +1 whenever a player
-- nailed either team's exact goal count. In practice this let too many different
-- scorelines tie at 4 (e.g. on a 4:1 result both 3:1 and 2:1 scored 4: correct
-- outcome +3, Paraguay's 1 goal +1), so the gap between a near-perfect 4 and a
-- truly exact 5 felt unfair given how much harder the exact score is to hit.
--
-- New model keeps only exact score, result and the goal-difference (handicap)
-- bonus:
--
--   exact score ........................ 5 (hard max, returned immediately)
--   correct outcome (winner/draw) ...... +3
--   correct exact goal difference ...... +1
--
-- Non-exact predictions now top out at 4 (correct outcome + exact margin), and a
-- merely-correct winner is worth 3 regardless of the predicted scoreline.
--
-- Run AFTER applying, recalculate_league_points (migration 0007) re-scores every
-- finished prediction through this function, so the leaderboard backfills.

create or replace function public.score_match_prediction(pred public.match_predictions, fix public.fixtures)
returns integer
language plpgsql
immutable
as $$
declare
  points integer := 0;
  predicted_diff integer;
  actual_diff integer;
begin
  if fix.score_a is null or fix.score_b is null then
    return 0;
  end if;

  -- Exact score is the hard maximum.
  if pred.score_a = fix.score_a and pred.score_b = fix.score_b then
    return 5;
  end if;

  predicted_diff := pred.score_a - pred.score_b;
  actual_diff := fix.score_a - fix.score_b;

  -- Correct outcome (same winner, or both a draw).
  if sign(predicted_diff) = sign(actual_diff) then
    points := points + 3;
  end if;

  -- Correct exact goal difference (handicap) bonus.
  if predicted_diff = actual_diff then
    points := points + 1;
  end if;

  return least(points, 5);
end;
$$;
