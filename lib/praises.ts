// Funny praise shown when a player nails an exact scoreline (5 pts).
const PRAISES = [
  "NOSTRADAMUS!",
  "Czapki z głów 🎩",
  "Co za oko!",
  "Wieszcz Gwardii!",
  "Dokładnie tak miało być.",
  "Snajper typowania 🎯",
  "Klasa światowa.",
  "Przewidziałeś przyszłość 🔮",
  "Idealny typ. Stawiasz mniej piwa.",
  "Selekcjoner roku!"
];

export function pickPraise(): string {
  return PRAISES[Math.floor(Math.random() * PRAISES.length)];
}
