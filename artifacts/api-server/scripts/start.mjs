import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFile = path.resolve(rootDir, "../../.env");
const entry = path.join(rootDir, "dist/index.mjs");

const nodeArgs = ["--enable-source-maps"];
if (existsSync(envFile)) {
  nodeArgs.push(`--env-file=${envFile}`);
}

nodeArgs.push(entry);

const result = spawnSync(process.execPath, nodeArgs, {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
