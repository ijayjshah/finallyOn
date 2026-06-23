const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

/**
 * Allowed browser origins for CORS + session cookies.
 * Set one of: CORS_ORIGIN, CORS_ORIGINS (comma-separated), or WEB_ORIGIN.
 */
export function getCorsOriginList(): string[] {
  const raw =
    process.env.CORS_ORIGIN ??
    process.env.CORS_ORIGINS ??
    process.env.WEB_ORIGIN ??
    "http://localhost:26163";

  return raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

export function getCorsOrigins(): string | string[] {
  const origins = getCorsOriginList();
  return origins.length === 1 ? origins[0]! : origins;
}

/** True when the frontend is hosted on a different site than the API (e.g. Vercel + Render). */
export function needsCrossSiteSessionCookies(): boolean {
  return getCorsOriginList().some((origin) => !LOCAL_ORIGIN.test(origin));
}
