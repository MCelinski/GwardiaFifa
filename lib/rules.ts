export const GROUP_STANDINGS_DEADLINE_LABEL = "11 czerwca 2026, 23:59 Europe/Warsaw";
export const GROUP_STANDINGS_DEADLINE_ISO = "2026-06-11T21:59:59.000Z";
export const MATCH_LOCK_MINUTES = 10;
// Highest number of goals a single team can be typed for. Two-digit cap keeps
// inputs sane (100+ is nonsense) and matches the server-side Zod validation.
export const MAX_MATCH_GOALS = 99;

export const rulesSummary = [
  {
    title: "Dostep do ligi",
    items: [
      "Liga jest prywatna i wymaga konta oraz kodu zaproszenia GWARDIA-PIWO-2026.",
      "Kazdy uczestnik typuje wylacznie ze swojego konta.",
      "Admin moze importowac terminarz, synchronizowac wyniki i przeliczac punkty."
    ]
  },
  {
    title: "Deadline typow",
    items: [
      `Koncowe tabele grup mozna ustawic do ${GROUP_STANDINGS_DEADLINE_LABEL}.`,
      `Typ podium (mistrz, drugie miejsce, trzecie miejsce) zamyka sie razem z tabelami grup: ${GROUP_STANDINGS_DEADLINE_LABEL}.`,
      `Wynik meczu mozna typowac i edytowac najpozniej ${MATCH_LOCK_MINUTES} minut przed pierwszym gwizdkiem.`,
      "Po zamknieciu okna typowania aplikacja i baza danych blokuja zapis lub edycje typu."
    ]
  },
  {
    title: "Prywatnosc typow",
    items: [
      "Przed lockiem widzisz tylko wlasne typy.",
      "Typy meczowe znajomych pokazuja sie dopiero po rozpoczeciu danego meczu.",
      "Typy koncowych tabel grup oraz podium pokazuja sie dopiero po deadline tabel grup."
    ]
  },
  {
    title: "Wyniki i ranking na zywo",
    items: [
      "Prawdziwe wyniki meczow sa pobierane automatycznie z football-data.org i synchronizowane przez caly turniej.",
      "Po wejsciu wyniku punkty za mecze przeliczaja sie automatycznie, a ranking aktualizuje sie na zywo.",
      "Ranking mozna filtrowac wg kategorii: ogolem, mecze grupowe, tabele grup, faza pucharowa, dzis.",
      "Wynik meczu typuje sie liczbowo (0-99) - litery i wartosci spoza zakresu sa odrzucane."
    ]
  },
  {
    title: "Punktacja meczow",
    items: [
      "Dokladny wynik: 5 pkt. To jest sztywny maks dla exact score.",
      "Poprawny rezultat (zwyciezca lub remis): 3 pkt.",
      "Bonus za dokladna roznice bramek: +1 pkt.",
      "Bonus za dokladna liczbe goli jednej druzyny: +1 pkt.",
      "Bonusy sumuja sie z rezultatem, ale laczny wynik meczu nie przekroczy 5 pkt."
    ]
  },
  {
    title: "Punktacja tabel grup",
    items: [
      "Dokladna pozycja druzyny: 3 pkt.",
      "Druzyna w top 2, ale na zlej dokladnej pozycji: 1 pkt.",
      "Poprawnie wskazana najlepsza druzyna z trzeciego miejsca: 1 pkt.",
      "Idealna kolejnosc calej grupy: 3 pkt bonusu.",
      "Punkty za tabele grup doliczaja sie do rankingu dopiero po rozegraniu wszystkich meczow fazy grupowej. Wczesniej w rankingu licza sie tylko mecze.",
      "W zakladce Grupy widzisz tabele na zywo z prawdziwych wynikow oraz symulacje: ile punktow dalby Twoj typ, gdyby faza grupowa skonczyla sie teraz."
    ]
  },
  {
    title: "Punktacja fazy pucharowej",
    items: [
      "Dokladny wynik po 90 minutach: 5 pkt.",
      "Poprawny zwyciezca: 3 pkt.",
      "Bonus za dokladna roznice bramek: +1 pkt (laczny wynik meczu maks 5 pkt).",
      "Poprawnie wskazany mistrz: 10 pkt.",
      "Poprawnie wskazane drugie miejsce: 6 pkt.",
      "Poprawnie wskazane trzecie miejsce: 4 pkt."
    ]
  }
];
