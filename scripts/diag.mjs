import { readFileSync } from "node:fs";

// Load .env.local
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SECRET_KEY;

async function rest(path) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

const out = {};

// Teams lookup
const teams = await rest("teams?select=id,name,flag_code");
const teamName = (id) => (id ? (teams.find((t) => t.id === id)?.name ?? id) : null);

// Users / profiles
const profiles = await rest("profiles?select=id,display_name,email").catch(() => rest("profiles?select=*"));
const userName = (id) => {
  const p = profiles.find((x) => x.id === id);
  return p ? (p.display_name || p.email || id) : id;
};

console.log("=== PROFILES ===");
for (const p of profiles) console.log(`  ${p.id.slice(0,8)} ${p.display_name ?? ""} ${p.email ?? ""}`);

// ---- PODIUM ----
console.log("\n=== TOURNAMENT_PREDICTIONS (podium) ===");
const tp = await rest("tournament_predictions?select=*");
for (const r of tp) {
  console.log(`  user=${userName(r.user_id)}`);
  console.log(`     champion       = ${teamName(r.champion_team_id)}`);
  console.log(`     finalist_a     = ${teamName(r.finalist_a_team_id)}`);
  console.log(`     finalist_b     = ${teamName(r.finalist_b_team_id)}`);
  console.log(`     runner_up      = ${teamName(r.runner_up_team_id)}`);
  console.log(`     third_place    = ${teamName(r.third_place_team_id)}`);
  console.log(`     points=${r.points} status=${r.status}`);
  const podiumNulls = !r.runner_up_team_id || !r.third_place_team_id;
  const legacyFilled = r.finalist_a_team_id || r.finalist_b_team_id;
  if (podiumNulls && legacyFilled) console.log("     ⚠️  PODIUM COLUMNS EMPTY but legacy finalist columns filled");
}

// ---- GROUP STANDINGS ----
console.log("\n=== GROUP_STANDING_PREDICTIONS ===");
const groups = await rest("world_cup_groups?select=id,code,standings_deadline&order=code");
const gsp = await rest("group_standing_predictions?select=id,user_id,group_id,status");
const items = await rest("group_standing_prediction_items?select=prediction_id,team_id,predicted_position");
const byUser = {};
for (const g of gsp) {
  (byUser[g.user_id] ??= []).push(g);
}
for (const [uid, preds] of Object.entries(byUser)) {
  console.log(`  user=${userName(uid)} -> ${preds.length} group predictions`);
  for (const pred of preds) {
    const gi = items.filter((i) => i.prediction_id === pred.id).sort((a,b)=>a.predicted_position-b.predicted_position);
    const code = groups.find((x) => x.id === pred.group_id)?.code ?? "?";
    const positions = gi.map((i) => i.predicted_position);
    const distinctPos = new Set(positions).size === positions.length;
    const distinctTeams = new Set(gi.map((i)=>i.team_id)).size === gi.length;
    const ok = gi.length === 4 && distinctPos && distinctTeams && positions.join() === "1,2,3,4";
    console.log(`     Group ${code}: ${gi.length} items pos=[${positions.join(",")}] ${ok ? "OK" : "⚠️ INVALID"}`);
  }
}
console.log(`  Groups total in DB: ${groups.length}`);

// ---- FIXTURES / RESULTS (today) ----
console.log("\n=== FIXTURES & RESULTS ===");
const fixtures = await rest("fixtures?select=id,starts_at,stage,group_code,round,team_a_id,team_b_id,status,score_a,score_b,winner_team_id&order=starts_at");
const today = new Date().toISOString().slice(0,10);
const todays = fixtures.filter((f) => (f.starts_at ?? "").slice(0,10) === today);
console.log(`  Total fixtures: ${fixtures.length}; today (${today}): ${todays.length}`);
for (const f of todays) {
  console.log(`  ${f.starts_at?.slice(11,16)} ${teamName(f.team_a_id)} vs ${teamName(f.team_b_id)} | status=${f.status} score=${f.score_a}:${f.score_b}`);
}
const withScores = fixtures.filter((f)=> f.score_a != null && f.score_b != null);
console.log(`  Fixtures WITH scores entered: ${withScores.length}`);
for (const f of withScores) console.log(`     ${f.starts_at?.slice(0,16)} ${teamName(f.team_a_id)} ${f.score_a}:${f.score_b} ${teamName(f.team_b_id)} (status=${f.status})`);

// ---- MATCH PREDICTIONS ----
console.log("\n=== MATCH_PREDICTIONS ===");
const mp = await rest("match_predictions?select=user_id,fixture_id,score_a,score_b,points,status");
const mpByUser = {};
for (const m of mp) (mpByUser[m.user_id] ??= []).push(m);
for (const [uid, list] of Object.entries(mpByUser)) {
  const scored = list.filter((m)=>m.points != null && m.points > 0).length;
  console.log(`  user=${userName(uid)} -> ${list.length} match predictions, ${scored} with points>0`);
}
console.log(`  Total match predictions: ${mp.length}`);
