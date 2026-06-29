import { Router, type IRouter } from "express";
import { and, desc, eq, or } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  profilePhotosTable,
  profileServicesTable,
  profileTagsTable,
  serviceProfilesTable,
} from "@workspace/db";
import { asyncHandler } from "../lib/async-handler";
import { HttpError } from "../lib/http-error";
import { parseIdParam, serializeProfile } from "../lib/serializers";
import { uniqueProfileSlug } from "../lib/profile-slug";
import { generateAndUploadTrustCard } from "../lib/trust-card";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

const serviceItemSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().default(""),
});

const profileBodySchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  profileType: z.enum(["service", "business"]),
  city: z.string().min(1),
  area: z.string().min(1),
  district: z.string().min(1),
  description: z.string().default(""),
  experience: z.string().default(""),
  phone: z.string().min(1),
  whatsappNumber: z.string().min(1),
  mapUrl: z.string().default(""),
  resumeUrl: z.string().optional(),
  photos: z.array(z.string().min(1)).default([]),
  services: z.array(serviceItemSchema).default([]),
  tags: z.array(z.string()).default([]),
  deliveryAvailable: z.boolean().optional(),
  pickupAvailable: z.boolean().optional(),
});

async function loadProfile(id: number) {
  return db.query.serviceProfilesTable.findFirst({
    where: eq(serviceProfilesTable.id, id),
    with: {
      services: true,
      photos: true,
      tags: true,
    },
  });
}

async function loadProfileBySlug(slug: string) {
  return db.query.serviceProfilesTable.findFirst({
    where: eq(serviceProfilesTable.slug, slug),
    with: {
      services: true,
      photos: true,
      tags: true,
    },
  });
}

async function insertProfileChildren(
  profileId: number,
  data: z.infer<typeof profileBodySchema>,
) {
  if (data.services.length) {
    await db.insert(profileServicesTable).values(
      data.services.map((s, i) => ({
        profileId,
        name: s.name,
        price: s.price,
        description: s.description,
        sortOrder: i,
      })),
    );
  }

  if (data.photos.length) {
    await db.insert(profilePhotosTable).values(
      data.photos.map((url, i) => ({
        profileId,
        url,
        sortOrder: i,
      })),
    );
  }

  if (data.tags.length) {
    await db.insert(profileTagsTable).values(
      data.tags.map((tag) => ({ profileId, tag })),
    );
  }
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const district = typeof req.query.district === "string" ? req.query.district : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;

    const rows = await db.query.serviceProfilesTable.findMany({
      where: and(
        eq(serviceProfilesTable.approvalStatus, "approved"),
        district ? eq(serviceProfilesTable.districtName, district) : undefined,
        category ? eq(serviceProfilesTable.category, category) : undefined,
      ),
      with: { services: true, photos: true, tags: true },
      orderBy: [desc(serviceProfilesTable.createdAt)],
    });

    res.json({ profiles: rows.map(serializeProfile) });
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const profile = await db.query.serviceProfilesTable.findFirst({
      where: eq(serviceProfilesTable.userId, req.user!.id),
      with: { services: true, photos: true, tags: true },
    });

    res.json({ profile: profile ? serializeProfile(profile) : null });
  }),
);

router.post(
  "/me/trust-card",
  requireAuth,
  asyncHandler(async (req, res) => {
    const profile = await db.query.serviceProfilesTable.findFirst({
      where: eq(serviceProfilesTable.userId, req.user!.id),
      columns: { id: true, approvalStatus: true },
    });
    if (!profile) throw new HttpError(404, "Profile not found");
    if (profile.approvalStatus !== "approved") {
      throw new HttpError(400, "Your profile must be approved before downloading a business card.");
    }

    const trustCardUrl = await generateAndUploadTrustCard(profile.id);
    if (!trustCardUrl) {
      throw new HttpError(500, "Could not generate your business card. Try again later.");
    }

    res.json({ trustCardUrl });
  }),
);

router.get(
  "/slug/:slug",
  asyncHandler(async (req, res) => {
    const rawSlug = req.params.slug;
    const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug)?.trim().toLowerCase();
    if (!slug) throw new HttpError(400, "Invalid slug");

    const profile = await loadProfileBySlug(slug);
    if (!profile) throw new HttpError(404, "Profile not found");

    const isOwner = req.user?.id === profile.userId;
    const isAdmin = req.user?.role === "admin";
    if (profile.approvalStatus !== "approved" && !isOwner && !isAdmin) {
      throw new HttpError(404, "Profile not found");
    }

    res.json({ profile: serializeProfile(profile) });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const profile = await loadProfile(id);
    if (!profile) throw new HttpError(404, "Profile not found");

    const isOwner = req.user?.id === profile.userId;
    const isAdmin = req.user?.role === "admin";
    if (profile.approvalStatus !== "approved" && !isOwner && !isAdmin) {
      throw new HttpError(404, "Profile not found");
    }

    res.json({ profile: serializeProfile(profile) });
  }),
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = profileBodySchema.parse(req.body);

    const existing = await db.query.serviceProfilesTable.findFirst({
      where: eq(serviceProfilesTable.userId, req.user!.id),
      columns: { id: true },
    });
    if (existing) {
      throw new HttpError(409, "You already have a profile.");
    }

    const slug = await uniqueProfileSlug(body.name);

    const [profile] = await db
      .insert(serviceProfilesTable)
      .values({
        userId: req.user!.id,
        name: body.name,
        slug,
        category: body.category,
        profileType: body.profileType,
        city: body.city,
        area: body.area,
        districtName: body.district,
        description: body.description,
        experience: body.experience,
        phone: body.phone,
        whatsappNumber: body.whatsappNumber,
        mapUrl: body.mapUrl,
        resumeUrl: body.resumeUrl,
        deliveryAvailable: body.deliveryAvailable ?? false,
        pickupAvailable: body.pickupAvailable ?? true,
        approvalStatus: "pending",
      })
      .returning();

    await insertProfileChildren(profile!.id, body);

    const full = await loadProfile(profile!.id);
    res.status(201).json({ profile: serializeProfile(full!) });
  }),
);

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const body = profileBodySchema.partial().parse(req.body);

    const profile = await loadProfile(id);
    if (!profile) throw new HttpError(404, "Profile not found");

    const isOwner = profile.userId === req.user!.id;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) throw new HttpError(403, "Forbidden");

    const nextName = body.name ?? profile.name;
    const nextSlug =
      body.name !== undefined && body.name !== profile.name
        ? await uniqueProfileSlug(nextName, id)
        : undefined;

    await db
      .update(serviceProfilesTable)
      .set({
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(nextSlug !== undefined ? { slug: nextSlug } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.profileType !== undefined ? { profileType: body.profileType } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.area !== undefined ? { area: body.area } : {}),
        ...(body.district !== undefined ? { districtName: body.district } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.experience !== undefined ? { experience: body.experience } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.whatsappNumber !== undefined ? { whatsappNumber: body.whatsappNumber } : {}),
        ...(body.mapUrl !== undefined ? { mapUrl: body.mapUrl } : {}),
        ...(body.resumeUrl !== undefined ? { resumeUrl: body.resumeUrl } : {}),
        ...(body.deliveryAvailable !== undefined
          ? { deliveryAvailable: body.deliveryAvailable }
          : {}),
        ...(body.pickupAvailable !== undefined
          ? { pickupAvailable: body.pickupAvailable }
          : {}),
        ...(isOwner && !isAdmin ? { approvalStatus: "pending" as const } : {}),
        updatedAt: new Date(),
      })
      .where(eq(serviceProfilesTable.id, id));

    if (body.services) {
      await db.delete(profileServicesTable).where(eq(profileServicesTable.profileId, id));
      await db.insert(profileServicesTable).values(
        body.services.map((s, i) => ({
          profileId: id,
          name: s.name,
          price: s.price,
          description: s.description,
          sortOrder: i,
        })),
      );
    }

    if (body.photos) {
      await db.delete(profilePhotosTable).where(eq(profilePhotosTable.profileId, id));
      await db.insert(profilePhotosTable).values(
        body.photos.map((url, i) => ({ profileId: id, url, sortOrder: i })),
      );
    }

    if (body.tags) {
      await db.delete(profileTagsTable).where(eq(profileTagsTable.profileId, id));
      await db.insert(profileTagsTable).values(
        body.tags.map((tag) => ({ profileId: id, tag })),
      );
    }

    const updated = await loadProfile(id);
    res.json({ profile: serializeProfile(updated!) });
  }),
);

export default router;
