// One-off backfill: re-score every finished match prediction with the current
// "result + handicap" model (mirror of migration 0008) and PATCH the live rows.
//
// This is a stopgap so the leaderboard reflects the new model immediately. The
// permanent source of truth is the Postgres function score_match_prediction —
// migration 0008 MUST be applied in Supabase, otherwise the next automatic
// recalculate_league_points (run on every football-data sync) reverts points to
// the old model.
//
//   node scripts/recalc-match-points.mjs          # dry run (prints diffs)
//   node scripts/recalc-match-points.mjs --apply  # actually PATCH the rows
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
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const APPLY = process.argv.includes('--apply');

async function q(path, init) {
  const res = await fetch(`${URL_BASE}/${path}`, { headers: H, ...init });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
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

const fixtures = await q(
  'fixtures?select=id,score_a,score_b&status=eq.finished&score_a=not.is.null&score_b=not.is.null'
);

let changed = 0;
let unchanged = 0;
for (const f of fixtures) {
  const preds = await q(
    `match_predictions?select=id,score_a,score_b,points,status&fixture_id=eq.${f.id}`
  );
  for (const p of preds) {
    const next = score(p.score_a, p.score_b, f.score_a, f.score_b);
    if (next === p.points && p.status === 'scored') {
      unchanged++;
      continue;
    }
    changed++;
    console.log(
      `fixture ${f.id} pred ${p.id}  ${p.score_a}:${p.score_b}  ${p.points} -> ${next}`
    );
    if (APPLY) {
      await q(`match_predictions?id=eq.${p.id}`, {
        method: 'PATCH',
        headers: { ...H, Prefer: 'return=minimal' },
        body: JSON.stringify({ points: next, status: 'scored' })
      });
    }
  }
}

console.log(
  `\n${APPLY ? 'APPLIED' : 'DRY RUN'} — changed: ${changed}, unchanged: ${unchanged}`
);
if (!APPLY && changed) console.log('Re-run with --apply to write these changes.');
