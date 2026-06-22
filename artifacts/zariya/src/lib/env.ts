/**
 * Frontend env (Vite `VITE_*` vars).
 *
 * Local dev: leave VITE_API_URL unset — requests use `/api` and Vite proxies to the backend.
 * Vercel/production: set VITE_API_URL to your API host (Render, etc.).
 */

function trimSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Base URL for API requests, including `/api` prefix. */
export function getApiBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();
  if (apiUrl) {
    return `${trimSlash(apiUrl)}/api`;
  }
  return "/api";
}

/** Public frontend URL (optional — meta, share links, etc.). */
export function getAppUrl(): string {
  const appUrl = import.meta.env.VITE_APP_URL?.trim();
  if (appUrl) return trimSlash(appUrl);
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
