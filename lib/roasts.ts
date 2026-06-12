import { getWarsawDateKey } from "@/lib/time";

// "Kto stawia piwo" — the player sitting last in the leaderboard gets this title
// of shame instead of the plain "Turysta", plus a rotating roast. It's a private
// friends' league, so the jabs are meant to sting just enough to buy a round.
export const BEER_PAYER_LABEL = "Stawia kolejkę 🍺";

const ROASTS = [
  "Typuje gorzej niż VAR sędziuje.",
  "Następna kolejka oczywiście na Twój rachunek.",
  "Statystycznie lepiej wychodzi rzut monetą.",
  "Twoje typy ogląda się jak mecz reprezentacji — przez palce.",
  "Ekspert. Od stawiania piwa.",
  "Gdyby pudła dawały punkty, byłbyś liderem.",
  "Piłka jest okrągła, a Ty i tak nie trafiasz.",
  "Mistrz typowania w grze, w którą nikt nie gra.",
  "Nostradamus, tylko że na odwrót.",
  "Klasa sama w sobie. Ostatnia.",
  "Pewniaki masz jak prognoza pogody — zawsze pudło.",
  "Może spróbuj typować odwrotnie?"
];

// Deterministic per player + day: stable across page auto-refreshes (no flicker)
// but rotates daily so the roast keeps things fresh.
export function pickRoast(seed: string): string {
  const key = `${seed}:${getWarsawDateKey()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return ROASTS[hash % ROASTS.length];
}
