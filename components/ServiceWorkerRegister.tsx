"use client";

import { useEffect } from "react";

// Registers the minimal service worker so the app is installable ("Add to Home
// Screen") on Chrome/Android. iOS installs via Share → Add to Home Screen using
// the manifest + apple-touch icon and does not require this.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failures are non-fatal — the app still works in the browser.
    });
  }, []);

  return null;
}
