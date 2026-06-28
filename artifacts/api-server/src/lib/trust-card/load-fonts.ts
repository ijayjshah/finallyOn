import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function getAssetsDir() {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const bundledPath = path.join(moduleDir, "lib/trust-card/assets");
  if (existsSync(bundledPath)) return bundledPath;
  return path.join(moduleDir, "assets");
}

export function getFinallyOnLogoBuffer() {
  return readFileSync(path.join(getAssetsDir(), "finallyon-logo.png"));
}
