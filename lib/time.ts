export const APP_TIME_ZONE = "Europe/Warsaw";

export function getWarsawDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function isSameWarsawDay(date: Date, today = new Date()) {
  return getWarsawDateKey(date) === getWarsawDateKey(today);
}

export function formatWarsawDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    timeZone: APP_TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short"
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function toDateInputValue(date = new Date()) {
  return getWarsawDateKey(date);
}
