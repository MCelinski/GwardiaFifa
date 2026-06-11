import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        pitch: "#19a463",
        gold: "#d6a83d",
        foam: "#f4e7bd",
        ink: "#05070d"
      },
      boxShadow: {
        glow: "0 0 40px rgba(214, 168, 61, 0.16)",
        pitch: "0 20px 60px rgba(25, 164, 99, 0.12)"
      },
      backgroundImage: {
        "pitch-lines":
          "linear-gradient(rgba(25,164,99,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(25,164,99,.12) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
