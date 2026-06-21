import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

function isRemotePostgres(connectionString) {
  return (
    connectionString.includes("supabase.co") ||
    connectionString.includes("sslmode=")
  );
}

function isSupabaseDirectHost(connectionString) {
  try {
    return /^db\.[^.]+\.supabase\.co$/i.test(new URL(connectionString).hostname);
  } catch {
    return false;
  }
}

function createPoolConfig(connectionString) {
  return {
    connectionString,
    ...(isRemotePostgres(connectionString)
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  };
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const envPath = path.join(root, ".env");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key in process.env) continue;
    process.env[key] = trimmed.slice(eq + 1).trim();
  }
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

let host = "(unknown)";
try {
  host = new URL(databaseUrl).hostname;
} catch {
  console.error("DATABASE_URL is not a valid URL");
  process.exit(1);
}

console.log(`Connecting to ${host}...`);

const pool = new pg.Pool({
  ...createPoolConfig(databaseUrl),
  connectionTimeoutMillis: 15_000,
});

try {
  const result = await pool.query("SELECT version()");
  console.log("Connection OK");
  console.log(result.rows[0].version);
} catch (error) {
  console.error("Connection failed:");
  console.error(error instanceof Error ? error.message : error);

  const message = error instanceof Error ? error.message : "";
  if (
    isSupabaseDirectHost(databaseUrl) &&
    (message.includes("ENETUNREACH") || message.includes("2606:") || message.includes("2406:"))
  ) {
    console.error("");
    console.error(
      [
        "This Supabase direct host (db.*.supabase.co) is IPv6-only.",
        "Your network cannot reach it.",
        "",
        "Fix: Supabase Dashboard → Connect → Session pooler → copy that URI into .env",
        "Example:",
        "  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres",
      ].join("\n"),
    );
  }

  process.exit(1);
} finally {
  await pool.end();
}
