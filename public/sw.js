// Minimal service worker. Its only job is to make the app installable on
// Chrome/Android (which expects a registered SW with a fetch handler). It does
// NOT cache anything — every request goes straight to the network — so there is
// no risk of users seeing stale results, predictions or the leaderboard.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Intentionally empty: let the browser handle the request normally.
});
