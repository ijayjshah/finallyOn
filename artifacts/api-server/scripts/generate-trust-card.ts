/**
 * One-off script to generate a trust card for an approved profile.
 * Usage: pnpm exec tsx --env-file=../../.env ./scripts/generate-trust-card.ts <profileId>
 */
import { generateAndUploadTrustCard } from "../src/lib/trust-card/index.ts";

const profileId = Number(process.argv[2]);
if (!Number.isInteger(profileId) || profileId <= 0) {
  console.error("Usage: generate-trust-card.ts <profileId>");
  process.exit(1);
}

generateAndUploadTrustCard(profileId)
  .then((url) => {
    if (!url) {
      console.error("Trust card was not generated (check logs / Cloudinary config / approval status).");
      process.exit(1);
    }
    console.log("Trust card URL:", url);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
