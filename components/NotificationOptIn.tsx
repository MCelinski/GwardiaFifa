"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Lets a logged-in player turn on the daily "you still have matches to bet" push
// reminder. The actual scheduling/sending happens server-side (cron); this component
// only manages the browser push subscription and POSTs it to /api/notifications/subscribe.
//
// iOS note: web push only works once the PWA is added to the home screen (16.4+), so on
// iOS Safari the browser reports no PushManager and we show a hint to install first.

type State = "loading" | "unsupported" | "blocked" | "enabled" | "disabled";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function NotificationOptIn() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushSupported()) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("blocked");
      return;
    }

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setState(subscription ? "enabled" : "disabled"))
      .catch(() => setState("disabled"));
  }, []);

  async function enable() {
    setBusy(true);
    setError(null);
    try {
      if (!VAPID_PUBLIC_KEY) throw new Error("Powiadomienia nie są skonfigurowane.");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "disabled");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON())
      });
      if (!response.ok) throw new Error("Nie udało się zapisać subskrypcji.");

      setState("enabled");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Coś poszło nie tak.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });
        await subscription.unsubscribe();
      }
      setState("disabled");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Coś poszło nie tak.");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const response = await fetch("/api/notifications/test", { method: "POST" });
      const data = (await response.json().catch(() => ({}))) as { sent?: number; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Nie udało się wysłać testu.");
      setInfo(data.sent ? "Wysłano! Sprawdź powiadomienia na telefonie." : "Nie znaleziono aktywnej subskrypcji.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Coś poszło nie tak.");
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") return null;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
            {state === "enabled" ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </span>
          <div>
            <p className="font-semibold">Przypomnienia o typach</p>
            <p className="text-sm text-muted-foreground">{describe(state)}</p>
            {error ? <p className="mt-1 text-sm text-destructive">{error}</p> : null}
            {info ? <p className="mt-1 text-sm text-emerald-400">{info}</p> : null}
          </div>
        </div>

        {state === "enabled" ? (
          <div className="flex shrink-0 gap-2">
            <Button size="sm" onClick={sendTest} disabled={busy}>
              <Send className="h-4 w-4" />
              Wyślij testowe
            </Button>
            <Button variant="secondary" size="sm" onClick={disable} disabled={busy}>
              <BellOff className="h-4 w-4" />
              Wyłącz
            </Button>
          </div>
        ) : state === "disabled" ? (
          <Button size="sm" onClick={enable} disabled={busy} className="shrink-0">
            <Bell className="h-4 w-4" />
            Włącz powiadomienia
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function describe(state: State) {
  switch (state) {
    case "enabled":
      return "Dostaniesz wieczorne przypomnienie, gdy masz mecze do obstawienia.";
    case "blocked":
      return "Powiadomienia są zablokowane w przeglądarce — włącz je w ustawieniach strony.";
    case "unsupported":
      return "Twoja przeglądarka nie wspiera powiadomień. Na iPhonie dodaj aplikację do ekranu głównego.";
    default:
      return "Włącz, by dostawać jedno wieczorne przypomnienie o nieobstawionych meczach.";
  }
}

function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// VAPID public keys are URL-safe base64; the Push API wants a Uint8Array.
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
