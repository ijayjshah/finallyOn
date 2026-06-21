import type { PoolConfig } from "pg";

export function isRemotePostgres(url: string): boolean {
  return url.includes("supabase.co") || url.includes("sslmode=");
}

export function isSupabaseDirectHost(url: string): boolean {
  try {
    return /^db\.[^.]+\.supabase\.co$/i.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function createPoolConfig(connectionString: string): PoolConfig {
  if (!isRemotePostgres(connectionString)) {
    return { connectionString };
  }

  return {
    connectionString,
    ssl: { rejectUnauthorized: false },
  };
}

export function getDrizzleDbCredentials(connectionString: string) {
  const config = createPoolConfig(connectionString);

  return {
    url: config.connectionString as string,
    ...(config.ssl ? { ssl: config.ssl } : {}),
  };
}

export function supabasePoolerHint(): string {
  return [
    "This Supabase direct host (db.*.supabase.co) is IPv6-only.",
    "Your network cannot reach it (ENETUNREACH).",
    "",
    "Fix: In Supabase Dashboard → Connect → Session pooler, copy that URI instead.",
    "It looks like:",
    "  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres",
  ].join("\n");
}
