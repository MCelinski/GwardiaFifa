export const GROUP_STANDINGS_DEADLINE_LABEL = "11 czerwca 2026, 23:59 Europe/Warsaw";
export const GROUP_STANDINGS_DEADLINE_ISO = "2026-06-11T21:59:59.000Z";
export const MATCH_LOCK_MINUTES = 10;

export const rulesSummary = [
  {
    title: "Dostęp do ligi",
    items: [
      "Liga jest prywatna i wymaga konta oraz kodu zaproszenia GWARDIA-PIWO-2026.",
      "Każdy uczestnik typuje wyłącznie ze swojego konta.",
      "Admin może importować terminarz, synchronizować wyniki i przeliczać punkty."
    ]
  },
  {
    title: "Deadline typów",
    items: [
      `Końcowe tabele grup można ustawić do ${GROUP_STANDINGS_DEADLINE_LABEL}.`,
      `Wynik meczu można typować i edytować najpóźniej ${MATCH_LOCK_MINUTES} minut przed pierwszym gwizdkiem.`,
      "Po zamknięciu okna typowania aplikacja i baza danych blokują zapis lub edycję typu."
    ]
  },
  {
    title: "Prywatność typów",
    items: [
      "Przed lockiem widzisz tylko własne typy.",
      "Typy meczowe znajomych pokazują się dopiero po rozpoczęciu danego meczu.",
      "Typy końcowych tabel grup pokazują się dopiero po deadline tabel grup."
    ]
  },
  {
    title: "Punktacja meczów grupowych",
    items: [
      "Dokładny wynik: 5 pkt.",
      "Poprawny rezultat: 3 pkt.",
      "Poprawna różnica bramek: 2 pkt.",
      "Poprawna liczba goli jednej drużyny: 1 pkt."
    ]
  },
  {
    title: "Punktacja tabel grup",
    items: [
      "Dokładna pozycja drużyny: 3 pkt.",
      "Drużyna w top 2, ale na złej dokładnej pozycji: 1 pkt.",
      "Poprawnie wskazana najlepsza drużyna z trzeciego miejsca: 1 pkt.",
      "Idealna kolejność całej grupy: 3 pkt bonusu."
    ]
  },
  {
    title: "Punktacja fazy pucharowej",
    items: [
      "Dokładny wynik po 90 minutach: 5 pkt.",
      "Poprawny zwycięzca: 3 pkt.",
      "Poprawna różnica bramek: 2 pkt.",
      "Poprawnie wskazany mistrz: 10 pkt.",
      "Poprawnie wskazany finalista: 6 pkt."
    ]
  }
];
