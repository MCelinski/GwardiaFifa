update public.world_cup_groups
set standings_deadline = make_timestamptz(2026, 6, 11, 23, 59, 59, 'Europe/Warsaw'),
    status = case when status = 'locked' then 'editable' else status end;

drop policy if exists "users insert own unlocked match predictions" on public.match_predictions;
drop policy if exists "users update own unlocked match predictions" on public.match_predictions;

create policy "users insert own unlocked match predictions"
on public.match_predictions for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and f.starts_at - interval '10 minutes' > now()
      and public.is_league_member(f.league_id)
  )
);

create policy "users update own unlocked match predictions"
on public.match_predictions for update
to authenticated
using (
  user_id = auth.uid()
  and exists (select 1 from public.fixtures f where f.id = fixture_id and f.starts_at - interval '10 minutes' > now())
)
with check (
  user_id = auth.uid()
  and exists (select 1 from public.fixtures f where f.id = fixture_id and f.starts_at - interval '10 minutes' > now())
);
