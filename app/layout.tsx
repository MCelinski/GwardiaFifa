import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gwardia Piwo World Cup 2026",
  description: "Prywatna liga typerska Mistrzostw Świata 2026 dla Gwardia Piwo."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className="dark">
      <body>{children}</body>
    </html>
  );
}
