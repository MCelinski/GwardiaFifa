import type { MetadataRoute } from "next";

// Web App Manifest — makes the app installable ("Add to Home Screen"). Next
// serves this at /manifest.webmanifest and auto-links it in <head>.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gwardia Piwo — Typer Mundialu 2026",
    short_name: "Gwardia Piwo",
    description: "Prywatna liga typerska Mistrzostw Świata 2026: typuj mecze, ustawiaj tabele grup i walcz o wieczną chwałę.",
    id: "/",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "pl",
    dir: "ltr",
    background_color: "#0d1828",
    theme_color: "#0d1828",
    categories: ["sports", "games", "entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
