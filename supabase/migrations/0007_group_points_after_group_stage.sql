-- Group-standings predictions must only count AFTER the entire group stage is
-- finished. Previously recalculate_league_points scored a group as soon as its
-- typing deadline passed, so predictions earned points against partial/empty
-- standings (teams that had not played yet sit at 0 pts and are ordered
-- alphabetically) — which let players score by luck and dominated the
-- leaderboard before any real group result existed.
--
-- New rule: score every group's standings prediction only once ALL group-stage
-- fixtures in the league are finished and have results. Until then, keep group
-- points at 0 / status 'saved' so they never show on the leaderboard.

create or replace function public.recalculate_league_points(target_league_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_matches integer := 0;
  affected_groups integer := 0;
  affected_tournament integer := 0;
  group_stage_complete boolean := false;
  gp record;
  tp record;
begin
  update public.match_predictions mp
  set points = public.score_match_prediction(mp, f),
      status = 'scored'
  from public.fixtures f
  where f.id = mp.fixture_id
    and f.league_id = target_league_id
    and f.status = 'finished';

  get diagnostics affected_matches = row_count;

  perform public.refresh_group_actual_standings(target_league_id);

  -- The whole group stage is complete only when at least one group fixture
  -- exists and none are left unplayed / without a result.
  select
    exists (
      select 1 from public.fixtures
      where league_id = target_league_id and stage = 'group'
    )
    and not exists (
      select 1 from public.fixtures
      where league_id = target_league_id
        and stage = 'group'
        and (status <> 'finished' or score_a is null or score_b is null)
    )
  into group_stage_complete;

  if group_stage_complete then
    for gp in
      select gsp.id
      from public.group_standing_predictions gsp
      join public.world_cup_groups g on g.id = gsp.group_id
      where g.standings_deadline <= now()
    loop
      perform public.score_group_prediction_items(gp.id);
      affected_groups := affected_groups + 1;
    end loop;
  else
    -- Group stage still in progress: make sure no premature points are shown.
    update public.group_standing_predictions
    set points = 0, status = 'saved'
    where points <> 0 or status = 'scored';
  end if;

  for tp in
    select id from public.tournament_predictions where league_id = target_league_id
  loop
    perform public.score_tournament_prediction(tp.id);
    affected_tournament := affected_tournament + 1;
  end loop;

  insert into public.sync_logs (job, status, detail, meta)
  values (
    'points.recalculate',
    'success',
    affected_matches || ' match predictions, ' || affected_groups || ' group predictions, ' || affected_tournament || ' tournament predictions recalculated',
    jsonb_build_object(
      'league_id', target_league_id,
      'matches', affected_matches,
      'groups', affected_groups,
      'tournament', affected_tournament,
      'group_stage_complete', group_stage_complete
    )
  );

  return affected_matches + affected_groups + affected_tournament;
end;
$$;
