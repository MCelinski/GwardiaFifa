// Light, background humor for the dashboard header — a private friends' league,
// so the tone is the same beer-and-football banter as the rest of the app. Pure
// flavor text: it never touches scoring.
const DASHBOARD_QUOTES = [
  "Typowanie to nie hazard. Hazard ma lepsze szanse.",
  "Ekspert to ktoś, kto myli się z pełnym przekonaniem.",
  "Najlepsze typy wpadają po drugim piwie.",
  "Forma jest chwilowa, wtopy są wieczne.",
  "Kto nie typuje, ten nie pudłuje. Ale i piwa nie stawia.",
  "Statystyka jest jak bikini: pokazuje dużo, ukrywa najważniejsze.",
  "Każdy jest selekcjonerem. Zwłaszcza po meczu.",
  "Dziś typuję sercem. Rozumem jakoś nie wychodziło.",
  "Pewniak to taki typ, który akurat nie wchodzi.",
  "Mecz trwa 90 minut, a moje wymówki znacznie dłużej.",
  "Pamiętaj: VAR i tak Ci nie pomoże.",
  "Gdyby przewidywanie było łatwe, nazywałoby się oglądanie.",
  "Stawiam na faworyta. Faworyt stawia na mnie kolejkę.",
  "Piłka jest okrągła, a tabela kłamie tylko czasem.",
  "Lepszy typ w garści niż mistrz na papierze."
];

export function pickRandomQuote(): string {
  return DASHBOARD_QUOTES[Math.floor(Math.random() * DASHBOARD_QUOTES.length)];
}
