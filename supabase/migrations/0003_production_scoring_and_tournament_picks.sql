create table if not exists public.group_actual_standings (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.world_cup_groups(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  position integer not null,
  played integer not null default 0,
  points integer not null default 0,
  goals_for integer not null default 0,
  goals_against integer not null default 0,
  goal_difference integer not null default 0,
  is_best_third_qualifier boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (group_id, team_id),
  unique (group_id, position),
  check (position between 1 and 4)
);

create table if not exists public.tournament_predictions (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  champion_team_id uuid references public.teams(id),
  finalist_a_team_id uuid references public.teams(id),
  finalist_b_team_id uuid references public.teams(id),
  status public.prediction_status not null default 'saved',
  points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (league_id, user_id),
  check (finalist_a_team_id is null or finalist_b_team_id is null or finalist_a_team_id <> finalist_b_team_id),
  check (
    champion_team_id is null
    or finalist_a_team_id is null
    or finalist_b_team_id is null
    or champion_team_id = finalist_a_team_id
    or champion_team_id = finalist_b_team_id
  )
);

create trigger tournament_predictions_touch_updated_at
before update on public.tournament_predictions
for each row execute function public.touch_updated_at();

create trigger group_actual_standings_touch_updated_at
before update on public.group_actual_standings
for each row execute function public.touch_updated_at();

alter table public.group_actual_standings enable row level security;
alter table public.tournament_predictions enable row level security;

drop policy if exists "group actual standings visible to members" on public.group_actual_standings;
create policy "group actual standings visible to members"
on public.group_actual_standings for select
to authenticated
using (true);

drop policy if exists "own tournament picks visible before deadline, friends after deadline" on public.tournament_predictions;
create policy "own tournament picks visible before deadline, friends after deadline"
on public.tournament_predictions for select
to authenticated
using (
  user_id = auth.uid()
  or (
    public.is_league_member(league_id)
    and exists (
      select 1
      from public.world_cup_groups g
      where g.standings_deadline <= now()
    )
  )
);

drop policy if exists "users insert own unlocked tournament picks" on public.tournament_predictions;
create policy "users insert own unlocked tournament picks"
on public.tournament_predictions for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_league_member(league_id)
  and exists (
    select 1 from public.world_cup_groups g
    where g.standings_deadline > now()
  )
);

drop policy if exists "users update own unlocked tournament picks" on public.tournament_predictions;
create policy "users update own unlocked tournament picks"
on public.tournament_predictions for update
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.world_cup_groups g
    where g.standings_deadline > now()
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.world_cup_groups g
    where g.standings_deadline > now()
  )
);

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

  if pred.score_a = fix.score_a and pred.score_b = fix.score_b then
    return 5;
  end if;

  predicted_diff := pred.score_a - pred.score_b;
  actual_diff := fix.score_a - fix.score_b;

  if sign(predicted_diff) = sign(actual_diff) then
    points := greatest(points, 3);
  elsif predicted_diff = actual_diff then
    points := greatest(points, 2);
  end if;

  if pred.score_a = fix.score_a then
    points := points + 1;
  end if;

  if pred.score_b = fix.score_b then
    points := points + 1;
  end if;

  return least(points, 5);
end;
$$;

create or replace function public.refresh_group_actual_standings(target_league_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer := 0;
begin
  delete from public.group_actual_standings gas
  using public.world_cup_groups g
  where gas.group_id = g.id;

  with group_teams as (
    select g.id as group_id, t.id as team_id, t.name
    from public.world_cup_groups g
    join public.teams t on t.group_code = g.code
  ),
  team_stats as (
    select
      gt.group_id,
      gt.team_id,
      gt.name,
      coalesce(sum(case when f.id is not null then 1 else 0 end), 0)::integer as played,
      coalesce(sum(
        case
          when f.id is null then 0
          when f.team_a_id = gt.team_id and f.score_a > f.score_b then 3
          when f.team_b_id = gt.team_id and f.score_b > f.score_a then 3
          when f.score_a = f.score_b then 1
          else 0
        end
      ), 0)::integer as points,
      coalesce(sum(case when f.team_a_id = gt.team_id then f.score_a when f.team_b_id = gt.team_id then f.score_b else 0 end), 0)::integer as goals_for,
      coalesce(sum(case when f.team_a_id = gt.team_id then f.score_b when f.team_b_id = gt.team_id then f.score_a else 0 end), 0)::integer as goals_against
    from group_teams gt
    left join public.fixtures f on f.group_code = (select code from public.world_cup_groups where id = gt.group_id)
      and f.league_id = target_league_id
      and f.stage = 'group'
      and f.status = 'finished'
      and (f.team_a_id = gt.team_id or f.team_b_id = gt.team_id)
      and f.score_a is not null
      and f.score_b is not null
    group by gt.group_id, gt.team_id, gt.name
  ),
  ranked as (
    select
      group_id,
      team_id,
      played,
      points,
      goals_for,
      goals_against,
      goals_for - goals_against as goal_difference,
      row_number() over (
        partition by group_id
        order by points desc, goals_for - goals_against desc, goals_for desc, name asc
      )::integer as position
    from team_stats
  ),
  best_thirds as (
    select team_id
    from ranked
    where position = 3
    order by points desc, goal_difference desc, goals_for desc, team_id asc
    limit 8
  )
  insert into public.group_actual_standings (
    group_id,
    team_id,
    position,
    played,
    points,
    goals_for,
    goals_against,
    goal_difference,
    is_best_third_qualifier
  )
  select
    r.group_id,
    r.team_id,
    r.position,
    r.played,
    r.points,
    r.goals_for,
    r.goals_against,
    r.goal_difference,
    exists (select 1 from best_thirds bt where bt.team_id = r.team_id)
  from ranked r;

  get diagnostics affected = row_count;
  return affected;
end;
$$;

create or replace function public.score_group_prediction_items(target_prediction_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer := 0;
  exact_count integer := 0;
begin
  update public.group_standing_prediction_items item
  set points =
    case
      when actual.position = item.predicted_position then 3
      when item.predicted_position <= 2 and actual.position <= 2 then 1
      when item.predicted_position = 3 and actual.is_best_third_qualifier then 1
      else 0
    end
  from public.group_standing_predictions gp
  join public.group_actual_standings actual on actual.group_id = gp.group_id
  where item.prediction_id = target_prediction_id
    and gp.id = item.prediction_id
    and actual.team_id = item.team_id;

  select coalesce(sum(points), 0), count(*) filter (where points = 3)
  into total, exact_count
  from public.group_standing_prediction_items
  where prediction_id = target_prediction_id;

  if exact_count = 4 then
    total := total + 3;
  end if;

  update public.group_standing_predictions
  set points = total,
      status = 'scored'
  where id = target_prediction_id;

  return total;
end;
$$;

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
  finalist_ids uuid[];
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
    and lower(coalesce(round, '')) like '%final%'
    and lower(coalesce(round, '')) not like '%third%'
    and status = 'finished'
  order by starts_at desc
  limit 1;

  if final_fixture.id is null or final_fixture.team_a_id is null or final_fixture.team_b_id is null then
    return 0;
  end if;

  champion_id := coalesce(
    final_fixture.winner_team_id,
    case when final_fixture.score_a > final_fixture.score_b then final_fixture.team_a_id else final_fixture.team_b_id end
  );
  finalist_ids := array[final_fixture.team_a_id, final_fixture.team_b_id];

  if pred.champion_team_id = champion_id then
    total := total + 10;
  end if;

  if pred.finalist_a_team_id = any(finalist_ids) then
    total := total + 6;
  end if;

  if pred.finalist_b_team_id = any(finalist_ids) then
    total := total + 6;
  end if;

  update public.tournament_predictions
  set points = total,
      status = 'scored'
  where id = target_prediction_id;

  return total;
end;
$$;

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

  for gp in
    select gsp.id
    from public.group_standing_predictions gsp
    join public.world_cup_groups g on g.id = gsp.group_id
    where g.standings_deadline <= now()
  loop
    perform public.score_group_prediction_items(gp.id);
    affected_groups := affected_groups + 1;
  end loop;

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
      'tournament', affected_tournament
    )
  );

  return affected_matches + affected_groups + affected_tournament;
end;
$$;

create or replace view public.leaderboard as
select
  lm.league_id,
  p.id as user_id,
  p.display_name,
  p.avatar_initials,
  coalesce(mp_totals.group_match_points, 0)
    + coalesce(gp_totals.group_standings_points, 0)
    + coalesce(mp_totals.knockout_points, 0)
    + coalesce(tp_totals.tournament_points, 0)
    + coalesce(pe_totals.bonus_points, 0) as total_points,
  coalesce(mp_totals.group_match_points, 0) as group_match_points,
  coalesce(gp_totals.group_standings_points, 0) as group_standings_points,
  coalesce(mp_totals.knockout_points, 0) + coalesce(tp_totals.tournament_points, 0) as knockout_points,
  coalesce(pe_totals.bonus_points, 0) as bonus_points,
  coalesce((
    select pe2.points
    from public.points_events pe2
    where pe2.user_id = p.id and pe2.league_id = lm.league_id
    order by pe2.created_at desc
    limit 1
  ), 0)::integer as last_points_gained
from public.league_members lm
join public.profiles p on p.id = lm.user_id
left join lateral (
  select
    coalesce(sum(mp.points) filter (where f.stage = 'group'), 0)::integer as group_match_points,
    coalesce(sum(mp.points) filter (where f.stage = 'knockout'), 0)::integer as knockout_points
  from public.match_predictions mp
  join public.fixtures f on f.id = mp.fixture_id
  where mp.user_id = p.id and f.league_id = lm.league_id
) mp_totals on true
left join lateral (
  select coalesce(sum(gsp.points), 0)::integer as group_standings_points
  from public.group_standing_predictions gsp
  where gsp.user_id = p.id
) gp_totals on true
left join lateral (
  select coalesce(sum(tp.points), 0)::integer as tournament_points
  from public.tournament_predictions tp
  where tp.user_id = p.id and tp.league_id = lm.league_id
) tp_totals on true
left join lateral (
  select coalesce(sum(pe.points) filter (where pe.source_type = 'bonus'), 0)::integer as bonus_points
  from public.points_events pe
  where pe.user_id = p.id and pe.league_id = lm.league_id
) pe_totals on true;
