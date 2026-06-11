-- Harden podium scoring so it can only ever be scored off the real FINAL and
-- THIRD_PLACE fixtures.
--
-- Problem: the previous function matched the final with `round like '%final%'`,
-- which also matches QUARTER_FINALS and SEMI_FINALS. Once a quarter- or semi-
-- final finished, the function would treat it as "the final" and award
-- champion/runner-up points off the wrong match until the real final was played.
--
-- Fix: match the exact round tokens (case/whitespace tolerant). World Cup 2026
-- knockout rounds are LAST_32, LAST_16, QUARTER_FINALS, SEMI_FINALS,
-- THIRD_PLACE, FINAL (football-data.org tokens).

create or replace function public.score_tournament_prediction(target_prediction_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  pred record;
  final_fixture record;
  third_place_fixture record;
  champion_id uuid;
  runner_up_id uuid;
  third_place_id uuid;
  total integer := 0;
begin
  select * into pred
  from public.tournament_predictions
  where id = target_prediction_id;

  if pred.id is null then
    return 0;
  end if;

  select *
  into final_fixture
  from public.fixtures
  where league_id = pred.league_id
    and stage = 'knockout'
    and upper(trim(coalesce(round, ''))) = 'FINAL'
    and status = 'finished'
  order by starts_at desc
  limit 1;

  select *
  into third_place_fixture
  from public.fixtures
  where league_id = pred.league_id
    and stage = 'knockout'
    and upper(trim(coalesce(round, ''))) = 'THIRD_PLACE'
    and status = 'finished'
  order by starts_at desc
  limit 1;

  if final_fixture.id is not null and final_fixture.team_a_id is not null and final_fixture.team_b_id is not null then
    champion_id := coalesce(
      final_fixture.winner_team_id,
      case when final_fixture.score_a > final_fixture.score_b then final_fixture.team_a_id else final_fixture.team_b_id end
    );

    runner_up_id := case
      when champion_id = final_fixture.team_a_id then final_fixture.team_b_id
      else final_fixture.team_a_id
    end;

    if pred.champion_team_id = champion_id then
      total := total + 10;
    end if;

    if pred.runner_up_team_id = runner_up_id then
      total := total + 6;
    end if;
  end if;

  if third_place_fixture.id is not null and third_place_fixture.team_a_id is not null and third_place_fixture.team_b_id is not null then
    third_place_id := coalesce(
      third_place_fixture.winner_team_id,
      case when third_place_fixture.score_a > third_place_fixture.score_b then third_place_fixture.team_a_id else third_place_fixture.team_b_id end
    );

    if pred.third_place_team_id = third_place_id then
      total := total + 4;
    end if;
  end if;

  update public.tournament_predictions
  set points = total,
      status = case when final_fixture.id is not null then 'scored' else status end
  where id = target_prediction_id;

  return total;
end;
$$;
