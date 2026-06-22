-- Stop giving the handicap bonus for draws.
--
-- The previous model (migration 0008) awarded +1 for hitting the exact goal
-- difference. But every draw has a goal difference of 0, so anyone who simply
-- typed "it'll be a draw" got that +1 for free — a correct draw was always worth
-- 4, while a correctly typed winner was worth only 3. Same depth of insight
-- (just the outcome), unfair reward.
--
-- New model: the handicap bonus only counts when the match was NOT a draw, i.e.
-- the player actually predicted a non-trivial margin.
--
--   exact score ............................. 5 (hard max, returned immediately)
--   correct outcome (winner or draw) ........ +3
--   correct exact goal difference, non-draw . +1
--
-- So a correct draw = 3, an exact draw = 5, and nothing in between. Wins are
-- unchanged: 3 for the right winner, 4 with the exact margin, 5 for the exact
-- score.
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

  -- Correct exact goal difference (handicap) bonus — only for non-draws, so a
  -- predicted draw never earns the bonus just by having difference 0.
  if predicted_diff = actual_diff and actual_diff <> 0 then
    points := points + 1;
  end if;

  return least(points, 5);
end;
$$;
