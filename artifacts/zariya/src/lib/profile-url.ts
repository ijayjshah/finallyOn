import { getAppUrl } from "@/lib/env";

export function getPublicProfilePath(slug: string): string {
  return `/p/${slug}`;
}

export function getPublicProfileUrl(slug: string): string {
  const base = getAppUrl();
  return `${base}${getPublicProfilePath(slug)}`;
}
