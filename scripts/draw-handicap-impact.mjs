// One-off report: how many points each player loses from dropping the handicap
// bonus on draws (migration 0008 -> 0009). Read-only, no writes.
//
//   node scripts/draw-handicap-impact.mjs
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

// Old model (migration 0008): handicap on every exact difference, incl. draws.
function scoreOld(pa, pb, aa, ab) {
  if (pa === aa && pb === ab) return 5;
  let pts = 0;
  const pd = pa - pb, ad = aa - ab;
  if (Math.sign(pd) === Math.sign(ad)) pts += 3;
  if (pd === ad) pts += 1;
  return Math.min(pts, 5);
}

// New model (migration 0009): no handicap for draws.
function scoreNew(pa, pb, aa, ab) {
  if (pa === aa && pb === ab) return 5;
  let pts = 0;
  const pd = pa - pb, ad = aa - ab;
  if (Math.sign(pd) === Math.sign(ad)) pts += 3;
  if (pd === ad && ad !== 0) pts += 1;
  return Math.min(pts, 5);
}

const profiles = await q('profiles?select=id,display_name');
const name = Object.fromEntries(profiles.map((p) => [p.id, p.display_name]));

const fixtures = await q(
  'fixtures?select=id,score_a,score_b&status=eq.finished&score_a=not.is.null&score_b=not.is.null'
);

const lost = {}; // user_id -> points lost
const affected = {}; // user_id -> number of draw typings hit

for (const f of fixtures) {
  const preds = await q(
    `match_predictions?select=user_id,score_a,score_b&fixture_id=eq.${f.id}`
  );
  for (const p of preds) {
    const delta =
      scoreOld(p.score_a, p.score_b, f.score_a, f.score_b) -
      scoreNew(p.score_a, p.score_b, f.score_a, f.score_b);
    if (delta > 0) {
      lost[p.user_id] = (lost[p.user_id] ?? 0) + delta;
      affected[p.user_id] = (affected[p.user_id] ?? 0) + 1;
    }
  }
}

const rows = Object.entries(lost)
  .map(([id, pts]) => ({ name: name[id] ?? id, pts, hits: affected[id] }))
  .sort((a, b) => b.pts - a.pts);

console.log('\n=== STRATA PRZEZ REMIS-HANDICAP (0008 -> 0009) ===');
console.log('gracz                | -pkt | trafione remisy');
console.log('---------------------|------|----------------');
for (const r of rows) {
  console.log(`${r.name.padEnd(20)} | -${String(r.pts).padEnd(3)} | ${r.hits}`);
}
const total = rows.reduce((s, r) => s + r.pts, 0);
console.log(`\nRazem odebranych punktow: ${total} (graczy dotknietych: ${rows.length})`);
