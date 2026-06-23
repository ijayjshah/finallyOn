import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { createPoolConfig } from "./pg-config";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool(createPoolConfig(process.env.DATABASE_URL));
export const db = drizzle(pool, { schema });

export * from "./schema";
export * from "./password";
export * from "./profile-slug";
