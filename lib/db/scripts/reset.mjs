import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

function createPoolConfig(connectionString) {
  const isRemote =
    connectionString.includes("supabase.co") ||
    connectionString.includes("sslmode=");
  return {
    connectionString,
    ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
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

const pool = new pg.Pool({
  ...createPoolConfig(databaseUrl),
  connectionTimeoutMillis: 15_000,
});

try {
  console.log("Dropping and recreating public schema...");
  await pool.query("DROP SCHEMA IF EXISTS public CASCADE");
  await pool.query("CREATE SCHEMA public");
  await pool.query("GRANT ALL ON SCHEMA public TO postgres");
  await pool.query("GRANT ALL ON SCHEMA public TO public");
  console.log("Database reset complete.");
} catch (error) {
  console.error("Reset failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
