// Generates PWA / home-screen icons from the Gwardia Piwo crest (same artwork as
// components/GwardiaPiwoCrest.tsx) so the installed app matches the in-app brand.
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GOLD = "#d6a83d";
const GOLD_DEEP = "#b78a2c";
const FOAM = "#f4e7bd";
const PITCH = "#19a463";

// Gradients/clip live at the SVG root: librsvg (used by sharp) does not resolve
// paint servers/clip-paths declared inside a transformed <g>. With
// userSpaceOnUse the geometry still resolves in the referencing element's
// (transformed) coordinate system, so the crest's 64x72 coordinates line up.
const crestDefs = `
  <linearGradient id="field" x1="32" y1="6" x2="32" y2="68" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#0d1828" /><stop offset="1" stop-color="#06120c" />
  </linearGradient>
  <linearGradient id="gold" x1="23" y1="32" x2="41" y2="48" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#e7bf5a" /><stop offset="1" stop-color="${GOLD_DEEP}" />
  </linearGradient>
  <clipPath id="shield"><path d="M9 9 H55 V34 C55 50 45 62 32 67 C19 62 9 50 9 34 Z" /></clipPath>
`;

// Crest shapes in their native 64x72 coordinate system.
const crestBody = `
  <path d="M9 9 H55 V34 C55 50 45 62 32 67 C19 62 9 50 9 34 Z" fill="url(#field)" />
  <g clip-path="url(#shield)">
    <path d="M9 45 H55 V67 H9 Z" fill="${PITCH}" opacity="0.22" />
    <path d="M9 45 H55" stroke="${PITCH}" stroke-opacity="0.5" stroke-width="0.8" />
  </g>
  <polygon points="32,11 33.2,14.5 36.9,14.5 33.9,16.8 35,20.3 32,18.1 29,20.3 30.1,16.8 27.1,14.5 30.8,14.5" fill="${GOLD}" />
  <path d="M22.5 31 C22.5 28.2 25 27.4 26.2 28.6 C27 25.8 31 25.8 32 28.6 C33.4 25.9 37.4 26.8 37.6 29.6 C40.6 28.8 42.6 31.6 40.8 33 L23.4 33 C21.8 33 21.4 31.8 22.5 31 Z" fill="${FOAM}" />
  <path d="M23.5 33 H40.5 V44 C40.5 46.2 39.2 47.4 37 47.4 H27 C24.8 47.4 23.5 46.2 23.5 44 Z" fill="url(#gold)" stroke="${GOLD_DEEP}" stroke-width="0.8" />
  <path d="M40.5 35.4 C45.4 35.4 45.4 43 40.5 43" stroke="${GOLD}" stroke-width="2.2" fill="none" stroke-linecap="round" />
  <path d="M28 34.4 V46.4 M32 34.4 V46.4 M36 34.4 V46.4" stroke="#0d1828" stroke-opacity="0.35" stroke-width="0.8" />
  <circle cx="32" cy="54.5" r="5" fill="${FOAM}" stroke="${GOLD_DEEP}" stroke-width="0.9" />
  <polygon points="32,51.8 34.1,53.4 33.3,55.9 30.7,55.9 29.9,53.4" fill="#0d1828" />
  <path d="M32 49.5 V51.8 M36.6 53 L34.1 53.4 M34.4 57.6 L33.3 55.9 M29.6 57.6 L30.7 55.9 M27.4 53 L29.9 53.4" stroke="#0d1828" stroke-opacity="0.55" stroke-width="0.7" />
  <path d="M9 9 H55 V34 C55 50 45 62 32 67 C19 62 9 50 9 34 Z" stroke="${GOLD}" stroke-width="2.4" fill="none" />
  <path d="M12.5 12.5 H51.5 V34 C51.5 48 42.5 58.5 32 63.2 C21.5 58.5 12.5 48 12.5 34 Z" stroke="${GOLD}" stroke-opacity="0.45" stroke-width="0.9" fill="none" />
`;

function iconSvg(size, logoFraction) {
  const scale = (logoFraction * size) / 72;
  const logoW = 64 * scale;
  const tx = (size - logoW) / 2;
  const ty = (size * (1 - logoFraction)) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0d1828" /><stop offset="1" stop-color="#06120c" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="46%" r="55%">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.16" /><stop offset="1" stop-color="${GOLD}" stop-opacity="0" />
    </radialGradient>
    ${crestDefs}
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" />
  <rect width="${size}" height="${size}" fill="url(#glow)" />
  <g transform="translate(${tx} ${ty}) scale(${scale})">${crestBody}</g>
</svg>`;
}

async function render(size, logoFraction, outPath) {
  await sharp(Buffer.from(iconSvg(size, logoFraction))).resize(size, size).png().toFile(outPath);
  console.log("wrote", outPath);
}

mkdirSync(resolve(root, "public/icons"), { recursive: true });

// Next auto-wires app/icon.png (favicon + icon links) and app/apple-icon.png (iOS).
await render(512, 0.74, resolve(root, "app/icon.png"));
await render(180, 0.72, resolve(root, "app/apple-icon.png"));
// Manifest icons referenced from app/manifest.ts.
await render(192, 0.74, resolve(root, "public/icons/icon-192.png"));
await render(512, 0.74, resolve(root, "public/icons/icon-512.png"));
// Maskable: extra padding so Android's circular mask never clips the crest.
await render(512, 0.55, resolve(root, "public/icons/maskable-512.png"));

console.log("done");
