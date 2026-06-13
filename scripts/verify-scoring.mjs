// One-off verification: did the app score yesterday's match fairly?
// Reads live Supabase data and recomputes points with the margin-bonus model.
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1';
const KEY = env.SUPABASE_SECRET_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function q(path) {
  const res = await fetch(`${URL_BASE}/${path}`, { headers: H });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path}: ${await res.text()}`);
  return res.json();
}

// Result + handicap model (mirror of migration 0008)
function score(pa, pb, aa, ab) {
  if (pa === aa && pb === ab) return 5;
  let pts = 0;
  const pd = pa - pb, ad = aa - ab;
  if (Math.sign(pd) === Math.sign(ad)) pts += 3;
  if (pd === ad) pts += 1;
  return Math.min(pts, 5);
}

const teams = await q('teams?select=id,name');
const teamName = Object.fromEntries(teams.map((t) => [t.id, t.name]));

// Find finished fixtures with a result
const fixtures = await q(
  'fixtures?select=id,team_a_id,team_b_id,score_a,score_b,status,starts_at,stage&score_a=not.is.null&score_b=not.is.null&order=starts_at'
);

console.log('=== FINISHED FIXTURES (with result) ===');
for (const f of fixtures) {
  console.log(
    `${f.starts_at}  ${teamName[f.team_a_id] ?? '?'} ${f.score_a}:${f.score_b} ${teamName[f.team_b_id] ?? '?'}  [${f.status}] id=${f.id}`
  );
}

for (const f of fixtures) {
  const preds = await q(
    `match_predictions?select=id,user_id,score_a,score_b,points,status&fixture_id=eq.${f.id}`
  );
  const profiles = await q('profiles?select=id,display_name');
  const name = Object.fromEntries(profiles.map((p) => [p.id, p.display_name]));

  console.log(
    `\n=== PREDICTIONS for ${teamName[f.team_a_id]} ${f.score_a}:${f.score_b} ${teamName[f.team_b_id]} ===`
  );
  console.log('user | pred | stored | expected | status | OK?');
  let mismatches = 0;
  for (const p of preds) {
    const expected = score(p.score_a, p.score_b, f.score_a, f.score_b);
    const ok = expected === p.points && p.status === 'scored';
    if (!ok) mismatches++;
    console.log(
      `${(name[p.user_id] ?? p.user_id).padEnd(20)} | ${p.score_a}:${p.score_b} | ${p.points} | ${expected} | ${p.status} | ${ok ? 'OK' : '❌ MISMATCH'}`
    );
  }
  console.log(`predictions: ${preds.length}, mismatches: ${mismatches}`);
}

console.log('\n=== LEADERBOARD ===');
const lb = await q('leaderboard?select=display_name,total_points,group_match_points,group_standings_points,knockout_points,bonus_points&order=total_points.desc');
for (const r of lb) {
  console.log(
    `${(r.display_name ?? '').padEnd(20)} total=${r.total_points} (match=${r.group_match_points}, groups=${r.group_standings_points}, knockout=${r.knockout_points}, bonus=${r.bonus_points})`
  );
}
