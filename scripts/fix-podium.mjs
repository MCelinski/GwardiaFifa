import { readFileSync } from "node:fs";

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
const DRY = process.argv.includes("--apply") ? false : true;

async function rest(path, init = {}) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

const teams = await rest("teams?select=id,name");
const tn = (id) => (id ? (teams.find((t) => t.id === id)?.name ?? id) : null);

const rows = await rest("tournament_predictions?select=*");
console.log(`${DRY ? "[DRY RUN]" : "[APPLY]"} repairing ${rows.length} podium rows\n`);

for (const r of rows) {
  const runnerUp = r.runner_up_team_id ?? r.finalist_a_team_id;
  const thirdPlace = r.third_place_team_id ?? r.finalist_b_team_id;

  if (r.runner_up_team_id === runnerUp && r.third_place_team_id === thirdPlace) {
    console.log(`  ${r.id.slice(0, 8)}  already correct, skipping`);
    continue;
  }

  console.log(`  ${r.id.slice(0, 8)}  champion=${tn(r.champion_team_id)}`);
  console.log(`      runner_up:   ${tn(r.runner_up_team_id)} -> ${tn(runnerUp)}`);
  console.log(`      third_place: ${tn(r.third_place_team_id)} -> ${tn(thirdPlace)}`);

  if (!DRY) {
    await rest(`tournament_predictions?id=eq.${r.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        runner_up_team_id: runnerUp,
        third_place_team_id: thirdPlace
      })
    });
    console.log("      ✔ updated");
  }
}

console.log(DRY ? "\nDry run only. Re-run with --apply to write." : "\nDone.");
