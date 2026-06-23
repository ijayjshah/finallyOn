import { eq } from "drizzle-orm";
import { db, serviceProfilesTable, slugifyProfileName } from "../src/index";

async function uniqueSlugForBackfill(
  base: string,
  excludeId: number,
  taken: Set<string>,
): Promise<string> {
  let candidate = base;
  let suffix = 2;

  while (taken.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  taken.add(candidate);
  return candidate;
}

async function main() {
  const rows = await db
    .select({
      id: serviceProfilesTable.id,
      name: serviceProfilesTable.name,
      slug: serviceProfilesTable.slug,
    })
    .from(serviceProfilesTable);

  const taken = new Set(
    rows.map((row) => row.slug).filter((slug): slug is string => Boolean(slug)),
  );

  let updated = 0;

  for (const row of rows) {
    if (row.slug) continue;

    const slug = await uniqueSlugForBackfill(
      slugifyProfileName(row.name),
      row.id,
      taken,
    );

    await db
      .update(serviceProfilesTable)
      .set({ slug })
      .where(eq(serviceProfilesTable.id, row.id));

    updated += 1;
    console.log(`  ${row.name} → ${slug}`);
  }

  console.log(updated ? `Backfilled ${updated} profile slug(s).` : "All profiles already have slugs.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
