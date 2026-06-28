import { eq } from "drizzle-orm";
import { db, serviceProfilesTable } from "@workspace/db";
import { generateAndUploadTrustCard } from "../src/lib/trust-card/index.ts";

async function main() {
  const profiles = await db.query.serviceProfilesTable.findMany({
    where: eq(serviceProfilesTable.approvalStatus, "approved"),
    columns: { id: true, name: true, trustCardUrl: true },
  });

  console.log(`Regenerating trust cards for ${profiles.length} approved profile(s)`);

  for (const profile of profiles) {
    console.log(`Generating for ${profile.name} (#${profile.id})...`);
    const url = await generateAndUploadTrustCard(profile.id);
    console.log(`  -> ${url}`);
  }

  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
