import { eq } from "drizzle-orm";
import { db, serviceProfilesTable } from "@workspace/db";
import { logger } from "../logger";
import { uploadTrustCardPng } from "./cloudinary";
import { renderTrustCardPngFromHtml } from "./render-html-card";
import { getFinallyOnLogoBuffer } from "./load-fonts";

async function fetchImageAsDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function bufferToDataUri(buffer: Buffer, mime = "image/png") {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function profileTypeLabel(profileType: "service" | "business") {
  return profileType === "business" ? "Business" : "Service Provider";
}

export async function generateAndUploadTrustCard(profileId: number): Promise<string | null> {
  const profile = await db.query.serviceProfilesTable.findFirst({
    where: eq(serviceProfilesTable.id, profileId),
    with: { photos: true },
  });

  if (!profile || profile.approvalStatus !== "approved") {
    return null;
  }

  const sortedPhotos = [...(profile.photos ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const profilePhotoUrl = sortedPhotos[0]?.url ?? null;

  const profileImageDataUri = profilePhotoUrl
    ? await fetchImageAsDataUri(profilePhotoUrl)
    : null;

  const finallyOnLogoDataUri = bufferToDataUri(getFinallyOnLogoBuffer());
  const avatarSrc = profileImageDataUri ?? finallyOnLogoDataUri;

  const png = await renderTrustCardPngFromHtml({
    businessName: profile.name,
    profileTypeLabel: profileTypeLabel(profile.profileType),
    district: profile.districtName,
    avatarSrc,
    avatarIsPhoto: Boolean(profileImageDataUri),
    logoDataUri: finallyOnLogoDataUri,
  });

  const trustCardUrl = await uploadTrustCardPng(png, profile.id, profile.slug);

  await db
    .update(serviceProfilesTable)
    .set({ trustCardUrl, updatedAt: new Date() })
    .where(eq(serviceProfilesTable.id, profileId));

  logger.info({ profileId, trustCardUrl }, "Trust card generated and uploaded");
  return trustCardUrl;
}

export function scheduleTrustCardGeneration(profileId: number) {
  void generateAndUploadTrustCard(profileId).catch((err) => {
    logger.error({ err, profileId }, "Failed to generate trust card");
  });
}
