import { eq } from "drizzle-orm";
import { db, serviceProfilesTable } from "@workspace/db";

function slugifyProfileName(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return base || "profile";
}

export async function uniqueProfileSlug(
  name: string,
  excludeProfileId?: number,
): Promise<string> {
  const base = slugifyProfileName(name);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.query.serviceProfilesTable.findFirst({
      where: eq(serviceProfilesTable.slug, candidate),
      columns: { id: true },
    });

    if (!existing || existing.id === excludeProfileId) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
