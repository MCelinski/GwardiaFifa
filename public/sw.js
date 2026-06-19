// Minimal service worker. Its only job is to make the app installable on
// Chrome/Android (which expects a registered SW with a fetch handler). It does
// NOT cache anything — every request goes straight to the network — so there is
// no risk of users seeing stale results, predictions or the leaderboard.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Intentionally empty: let the browser handle the request normally.
});

// Daily betting reminder. The cron (/api/cron/reminders) sends a JSON payload
// { title, body, url }; show it as a notification and, on click, focus an open tab or
// open the predictions page.
const DEFAULT_REMINDER_URL = "/predictions/group-matches";

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (err) {
    payload = { body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || "Gwardia Piwo";
  const options = {
    body: payload.body || "Masz mecze do obstawienia!",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url: payload.url || DEFAULT_REMINDER_URL }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || DEFAULT_REMINDER_URL;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
