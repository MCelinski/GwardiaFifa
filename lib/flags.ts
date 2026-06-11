// Maps football-data TLA codes (stored as teams.flag_code) to ISO codes used by
// flagcdn. Image flags render consistently on every platform (unlike emoji flags,
// which fall back to letters on Windows).
const TLA_TO_ISO: Record<string, string> = {
  ALG: "dz", // Algeria
  ARG: "ar", // Argentina
  AUS: "au", // Australia
  AUT: "at", // Austria
  BEL: "be", // Belgium
  BIH: "ba", // Bosnia-Herzegovina
  BRA: "br", // Brazil
  CAN: "ca", // Canada
  CPV: "cv", // Cape Verde
  COL: "co", // Colombia
  COD: "cd", // Congo DR
  CRO: "hr", // Croatia
  CUW: "cw", // Curaçao
  CZE: "cz", // Czechia
  ECU: "ec", // Ecuador
  EGY: "eg", // Egypt
  ENG: "gb-eng", // England
  FRA: "fr", // France
  GER: "de", // Germany
  GHA: "gh", // Ghana
  HAI: "ht", // Haiti
  IRN: "ir", // Iran
  IRQ: "iq", // Iraq
  CIV: "ci", // Ivory Coast
  JPN: "jp", // Japan
  JOR: "jo", // Jordan
  MEX: "mx", // Mexico
  MAR: "ma", // Morocco
  NED: "nl", // Netherlands
  NZL: "nz", // New Zealand
  NOR: "no", // Norway
  PAN: "pa", // Panama
  PAR: "py", // Paraguay
  POR: "pt", // Portugal
  QAT: "qa", // Qatar
  KSA: "sa", // Saudi Arabia
  SCO: "gb-sct", // Scotland
  SEN: "sn", // Senegal
  RSA: "za", // South Africa
  KOR: "kr", // South Korea
  ESP: "es", // Spain
  SWE: "se", // Sweden
  SUI: "ch", // Switzerland
  TUN: "tn", // Tunisia
  TUR: "tr", // Turkey
  USA: "us", // United States
  URY: "uy", // Uruguay
  UZB: "uz" // Uzbekistan
};

export function flagIsoCode(code: string | null | undefined): string | null {
  if (!code) return null;
  return TLA_TO_ISO[code.toUpperCase()] ?? null;
}

export function flagUrl(code: string | null | undefined): string | null {
  const iso = flagIsoCode(code);
  return iso ? `https://flagcdn.com/${iso}.svg` : null;
}
