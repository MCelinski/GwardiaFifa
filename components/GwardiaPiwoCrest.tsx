import { cn } from "@/lib/utils";

const GOLD = "#d6a83d";
const GOLD_DEEP = "#b78a2c";
const FOAM = "#f4e7bd";
const PITCH = "#19a463";

// Heraldic crest for Gwardia Piwo: a gold-bordered shield (the "Gwardia"/guard),
// a foam-topped beer mug (the "Piwo"/beer) on a pitch-green field, a football at
// the base, and a prestige star in the chief. Pure SVG so it stays crisp from
// 40px (navbar) up to hero sizes.
export function GwardiaPiwoCrest({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("relative", compact ? "h-10 w-10" : "h-20 w-20", className)}>
      <svg
        viewBox="0 0 64 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Gwardia Piwo"
        className="h-full w-full drop-shadow-[0_4px_14px_rgba(214,168,61,0.25)]"
      >
        <defs>
          <linearGradient id="gpc-field" x1="32" y1="6" x2="32" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0d1828" />
            <stop offset="1" stopColor="#06120c" />
          </linearGradient>
          <linearGradient id="gpc-gold" x1="23" y1="32" x2="41" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e7bf5a" />
            <stop offset="1" stopColor={GOLD_DEEP} />
          </linearGradient>
          <clipPath id="gpc-shield">
            <path d="M9 9 H55 V34 C55 50 45 62 32 67 C19 62 9 50 9 34 Z" />
          </clipPath>
        </defs>

        {/* Field */}
        <path d="M9 9 H55 V34 C55 50 45 62 32 67 C19 62 9 50 9 34 Z" fill="url(#gpc-field)" />

        {/* Pitch-green base inside the shield */}
        <g clipPath="url(#gpc-shield)">
          <path d="M9 45 H55 V67 H9 Z" fill={PITCH} opacity="0.22" />
          <path d="M9 45 H55" stroke={PITCH} strokeOpacity="0.5" strokeWidth="0.8" />
        </g>

        {/* Prestige star in the chief */}
        <polygon
          points="32,11 33.2,14.5 36.9,14.5 33.9,16.8 35,20.3 32,18.1 29,20.3 30.1,16.8 27.1,14.5 30.8,14.5"
          fill={GOLD}
        />

        {/* Beer mug */}
        <path
          d="M22.5 31 C22.5 28.2 25 27.4 26.2 28.6 C27 25.8 31 25.8 32 28.6 C33.4 25.9 37.4 26.8 37.6 29.6 C40.6 28.8 42.6 31.6 40.8 33 L23.4 33 C21.8 33 21.4 31.8 22.5 31 Z"
          fill={FOAM}
        />
        <path
          d="M23.5 33 H40.5 V44 C40.5 46.2 39.2 47.4 37 47.4 H27 C24.8 47.4 23.5 46.2 23.5 44 Z"
          fill="url(#gpc-gold)"
          stroke={GOLD_DEEP}
          strokeWidth="0.8"
        />
        <path d="M40.5 35.4 C45.4 35.4 45.4 43 40.5 43" stroke={GOLD} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M28 34.4 V46.4 M32 34.4 V46.4 M36 34.4 V46.4" stroke="#0d1828" strokeOpacity="0.35" strokeWidth="0.8" />

        {/* Football on the pitch */}
        <circle cx="32" cy="54.5" r="5" fill={FOAM} stroke={GOLD_DEEP} strokeWidth="0.9" />
        <polygon points="32,51.8 34.1,53.4 33.3,55.9 30.7,55.9 29.9,53.4" fill="#0d1828" />
        <path d="M32 49.5 V51.8 M36.6 53 L34.1 53.4 M34.4 57.6 L33.3 55.9 M29.6 57.6 L30.7 55.9 M27.4 53 L29.9 53.4" stroke="#0d1828" strokeOpacity="0.55" strokeWidth="0.7" />

        {/* Borders */}
        <path d="M9 9 H55 V34 C55 50 45 62 32 67 C19 62 9 50 9 34 Z" stroke={GOLD} strokeWidth="2.4" />
        <path d="M12.5 12.5 H51.5 V34 C51.5 48 42.5 58.5 32 63.2 C21.5 58.5 12.5 48 12.5 34 Z" stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.9" />
      </svg>
    </div>
  );
}
