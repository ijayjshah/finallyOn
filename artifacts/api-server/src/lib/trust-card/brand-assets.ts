/** Darker blue palette — closer to reference card */
export const BLUE = {
  primary: "#1848c7",
  accent: "#1a52d4",
  category: "#1c55d8",
  icon: "#184bc4",
  avatarBorder: "#1848c7",
  avatarGlow: "#123aa8",
  verify: "#1848c7",
  tagline: "#1a52d4",
  quote: "#1a52d4",
  footerStart: "#1848c7",
  footerEnd: "#2056c9",
  link: "#1a52d4",
  linkBorder: "rgba(24,72,199,0.65)",
  rim: "rgba(40,90,210,0.85)",
  glow: "#0f3a9e",
} as const;

/** White FinallyOn hub icon — matches official logo mark */
export const FINALLYON_ICON_SVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="41" y="41" width="18" height="18" rx="4" fill="white"/>
  <line x1="41" y1="41" x2="22" y2="22" stroke="white" stroke-width="9" stroke-linecap="round"/>
  <circle cx="22" cy="22" r="10" fill="white"/>
  <line x1="59" y1="41" x2="78" y2="22" stroke="white" stroke-width="9" stroke-linecap="round"/>
  <circle cx="78" cy="22" r="10" fill="white"/>
  <line x1="41" y1="59" x2="22" y2="78" stroke="white" stroke-width="9" stroke-linecap="round"/>
  <circle cx="22" cy="78" r="10" fill="white"/>
  <line x1="59" y1="59" x2="78" y2="78" stroke="white" stroke-width="9" stroke-linecap="round"/>
  <circle cx="78" cy="78" r="10" fill="white"/>
</svg>`;

function featureIconSvg(size: number, inner: string) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

export const FEATURE_ICONS = {
  trusted: featureIconSvg(
    34,
    `<path d="M12 2L4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-4z" stroke="${BLUE.icon}" stroke-width="1.6" fill="none"/>
     <path d="M9.5 12l1.8 1.8L15 10" stroke="${BLUE.icon}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  ),
  local: featureIconSvg(
    34,
    `<path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" stroke="${BLUE.icon}" stroke-width="1.6" fill="none"/>
     <circle cx="12" cy="10" r="2.5" stroke="${BLUE.icon}" stroke-width="1.6"/>`,
  ),
  verified: featureIconSvg(
    34,
    `<circle cx="9" cy="8" r="3" stroke="${BLUE.icon}" stroke-width="1.6"/>
     <circle cx="17" cy="10" r="2.5" stroke="${BLUE.icon}" stroke-width="1.6"/>
     <path d="M3.5 19c0-3.3 2.5-5 5.5-5s5.5 1.7 5.5 5" stroke="${BLUE.icon}" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M15 19c0-2.2 1.5-3.5 3.5-3.5" stroke="${BLUE.icon}" stroke-width="1.6" stroke-linecap="round"/>`,
  ),
  support: featureIconSvg(
    34,
    `<path d="M4 5h16a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4v-4H4a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="${BLUE.icon}" stroke-width="1.6" fill="none"/>
     <circle cx="8" cy="11.5" r="1" fill="${BLUE.icon}"/>
     <circle cx="12" cy="11.5" r="1" fill="${BLUE.icon}"/>
     <circle cx="16" cy="11.5" r="1" fill="${BLUE.icon}"/>`,
  ),
  quote: featureIconSvg(
    36,
    `<text x="4" y="28" fill="${BLUE.quote}" font-size="32" font-family="Georgia, serif" font-weight="700">"</text>`,
  ),
  globe: featureIconSvg(
    22,
    `<circle cx="12" cy="12" r="9" stroke="${BLUE.link}" stroke-width="1.6"/>
     <path d="M3 12h18M12 3c2.8 3.2 2.8 14.8 0 18M12 3c-2.8 3.2-2.8 14.8 0 18" stroke="${BLUE.link}" stroke-width="1.6"/>`,
  ),
} as const;

/** 16-point scalloped seal path (viewBox 0 0 48 48) */
const VERIFIED_SEAL_PATH =
  "M 24.00,4.00 L 26.61,8.61 L 31.31,6.31 L 32.00,11.66 L 37.31,11.31 L 35.90,16.48 L 40.90,18.48 L 37.07,22.76 L 40.90,27.05 L 35.90,29.05 L 37.31,34.21 L 32.00,33.86 L 31.31,39.21 L 26.61,36.91 L 24.00,41.52 L 21.39,36.91 L 16.69,39.21 L 16.00,33.86 L 10.69,34.21 L 12.10,29.05 L 7.10,27.05 L 10.93,22.76 L 7.10,18.48 L 12.10,16.48 L 10.69,11.31 L 16.00,11.66 L 16.69,6.31 L 21.39,8.61 Z";

/** Scalloped verified seal with checkmark */
export function verifiedSealSvg(size = 48) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${VERIFIED_SEAL_PATH}" fill="${BLUE.verify}"/>
    <path d="M17.2 24.2l5.4 5.4 11.2-11.4" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
