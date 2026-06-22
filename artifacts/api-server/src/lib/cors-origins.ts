/**
 * Allowed browser origins for CORS + session cookies.
 * Set one of: CORS_ORIGIN, CORS_ORIGINS (comma-separated), or WEB_ORIGIN.
 */
export function getCorsOrigins(): string | string[] {
  const raw =
    process.env.CORS_ORIGIN ??
    process.env.CORS_ORIGINS ??
    process.env.WEB_ORIGIN ??
    "http://localhost:26163";

  const origins = raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  return origins.length === 1 ? origins[0]! : origins;
}
