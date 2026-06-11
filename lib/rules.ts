export const GROUP_STANDINGS_DEADLINE_LABEL = "11 czerwca 2026, 23:59 Europe/Warsaw";
export const GROUP_STANDINGS_DEADLINE_ISO = "2026-06-11T21:59:59.000Z";
export const MATCH_LOCK_MINUTES = 10;

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
      `Typ mistrza i finalistow zamyka sie razem z tabelami grup: ${GROUP_STANDINGS_DEADLINE_LABEL}.`,
      `Wynik meczu mozna typowac i edytowac najpozniej ${MATCH_LOCK_MINUTES} minut przed pierwszym gwizdkiem.`,
      "Po zamknieciu okna typowania aplikacja i baza danych blokuja zapis lub edycje typu."
    ]
  },
  {
    title: "Prywatnosc typow",
    items: [
      "Przed lockiem widzisz tylko wlasne typy.",
      "Typy meczowe znajomych pokazuja sie dopiero po rozpoczeciu danego meczu.",
      "Typy koncowych tabel grup oraz mistrza/finalistow pokazuja sie dopiero po deadline tabel grup."
    ]
  },
  {
    title: "Punktacja meczow",
    items: [
      "Dokladny wynik: 5 pkt. To jest sztywny maks dla exact score.",
      "Poprawny rezultat: 3 pkt.",
      "Poprawna roznica bramek: 2 pkt.",
      "Poprawna liczba goli jednej druzyny: 1 pkt."
    ]
  },
  {
    title: "Punktacja tabel grup",
    items: [
      "Dokladna pozycja druzyny: 3 pkt.",
      "Druzyna w top 2, ale na zlej dokladnej pozycji: 1 pkt.",
      "Poprawnie wskazana najlepsza druzyna z trzeciego miejsca: 1 pkt.",
      "Idealna kolejnosc calej grupy: 3 pkt bonusu."
    ]
  },
  {
    title: "Punktacja fazy pucharowej",
    items: [
      "Dokladny wynik po 90 minutach: 5 pkt.",
      "Poprawny zwyciezca: 3 pkt.",
      "Poprawna roznica bramek: 2 pkt.",
      "Poprawnie wskazany mistrz: 10 pkt.",
      "Poprawnie wskazany finalista: 6 pkt za kazdego finaliste."
    ]
  }
];
