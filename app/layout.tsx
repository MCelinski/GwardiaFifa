import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gwardia Piwo World Cup 2026",
  description: "Prywatna liga typerska Mistrzostw Świata 2026 dla Gwardia Piwo.",
  applicationName: "Gwardia Piwo",
  appleWebApp: {
    capable: true,
    title: "Gwardia Piwo",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#0d1828"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className="dark">
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
