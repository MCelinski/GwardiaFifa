-- Fix group-stage / knockout match scoring so every advertised reward is reachable.
--
-- Previous version used mutually exclusive tiers, which made the "correct goal
-- difference" reward dead code (a correct margin always implies a correct
-- outcome, which was checked first). This version makes the components additive
-- and capped at 5:
--
--   exact score ........................ 5 (hard max, returned immediately)
--   correct outcome (winner/draw) ...... +3
--   correct exact goal difference ...... +1
--   correct goals of one team .......... +1
--
-- Non-exact predictions therefore top out at 4 (you cannot have both the exact
-- margin and one exact team score without the result being exact).

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

  -- Correct exact goal difference (margin) bonus.
  if predicted_diff = actual_diff then
    points := points + 1;
  end if;

  -- Correct number of goals for at least one team.
  if pred.score_a = fix.score_a or pred.score_b = fix.score_b then
    points := points + 1;
  end if;

  return least(points, 5);
end;
$$;
