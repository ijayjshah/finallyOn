import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  listingPhotosTable,
  listingsTable,
} from "@workspace/db";
import { asyncHandler } from "../lib/async-handler";
import { HttpError } from "../lib/http-error";
import { parseIdParam, serializeListing } from "../lib/serializers";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

const listingBodySchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  subCategory: z.string().default(""),
  description: z.string().default(""),
  price: z.string().default(""),
  city: z.string().min(1),
  area: z.string().min(1),
  district: z.string().min(1),
  photos: z.array(z.string().min(1)).default([]),
  type: z.enum(["service", "product"]),
  deliveryAvailable: z.boolean().default(false),
  pickupAvailable: z.boolean().default(true),
  whatsappNumber: z.string().min(1),
  active: z.boolean().default(true),
});

async function loadListing(id: number) {
  return db.query.listingsTable.findFirst({
    where: eq(listingsTable.id, id),
    with: { photos: true },
  });
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const district = typeof req.query.district === "string" ? req.query.district : undefined;
    const type = req.query.type === "service" || req.query.type === "product" ? req.query.type : undefined;

    const rows = await db.query.listingsTable.findMany({
      where: and(
        eq(listingsTable.approvalStatus, "approved"),
        eq(listingsTable.active, true),
        district ? eq(listingsTable.districtName, district) : undefined,
        type ? eq(listingsTable.type, type) : undefined,
      ),
      with: { photos: true },
      orderBy: [desc(listingsTable.createdAt)],
    });

    res.json({ listings: rows.map(serializeListing) });
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await db.query.listingsTable.findMany({
      where: eq(listingsTable.userId, req.user!.id),
      with: { photos: true },
      orderBy: [desc(listingsTable.createdAt)],
    });
    res.json({ listings: rows.map(serializeListing) });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const listing = await loadListing(id);
    if (!listing) throw new HttpError(404, "Listing not found");

    const isOwner = req.user?.id === listing.userId;
    const isAdmin = req.user?.role === "admin";
    if (listing.approvalStatus !== "approved" && !isOwner && !isAdmin) {
      throw new HttpError(404, "Listing not found");
    }

    res.json({ listing: serializeListing(listing) });
  }),
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = listingBodySchema.parse(req.body);

    const [listing] = await db
      .insert(listingsTable)
      .values({
        userId: req.user!.id,
        title: body.title,
        category: body.category,
        subCategory: body.subCategory,
        description: body.description,
        price: body.price,
        city: body.city,
        area: body.area,
        districtName: body.district,
        type: body.type,
        deliveryAvailable: body.deliveryAvailable,
        pickupAvailable: body.pickupAvailable,
        whatsappNumber: body.whatsappNumber,
        active: body.active,
        approvalStatus: "pending",
      })
      .returning();

    if (body.photos.length) {
      await db.insert(listingPhotosTable).values(
        body.photos.map((url, i) => ({
          listingId: listing!.id,
          url,
          sortOrder: i,
        })),
      );
    }

    const full = await loadListing(listing!.id);
    res.status(201).json({ listing: serializeListing(full!) });
  }),
);

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const body = listingBodySchema.partial().parse(req.body);
    const listing = await loadListing(id);
    if (!listing) throw new HttpError(404, "Listing not found");

    const isOwner = listing.userId === req.user!.id;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) throw new HttpError(403, "Forbidden");

    await db
      .update(listingsTable)
      .set({
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.subCategory !== undefined ? { subCategory: body.subCategory } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.price !== undefined ? { price: body.price } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.area !== undefined ? { area: body.area } : {}),
        ...(body.district !== undefined ? { districtName: body.district } : {}),
        ...(body.type !== undefined ? { type: body.type } : {}),
        ...(body.deliveryAvailable !== undefined
          ? { deliveryAvailable: body.deliveryAvailable }
          : {}),
        ...(body.pickupAvailable !== undefined
          ? { pickupAvailable: body.pickupAvailable }
          : {}),
        ...(body.whatsappNumber !== undefined
          ? { whatsappNumber: body.whatsappNumber }
          : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
        ...(isOwner && !isAdmin ? { approvalStatus: "pending" as const } : {}),
        updatedAt: new Date(),
      })
      .where(eq(listingsTable.id, id));

    if (body.photos) {
      await db.delete(listingPhotosTable).where(eq(listingPhotosTable.listingId, id));
      await db.insert(listingPhotosTable).values(
        body.photos.map((url, i) => ({ listingId: id, url, sortOrder: i })),
      );
    }

    const updated = await loadListing(id);
    res.json({ listing: serializeListing(updated!) });
  }),
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const listing = await loadListing(id);
    if (!listing) throw new HttpError(404, "Listing not found");

    const isOwner = listing.userId === req.user!.id;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) throw new HttpError(403, "Forbidden");

    await db.delete(listingsTable).where(eq(listingsTable.id, id));
    res.json({ ok: true });
  }),
);

export default router;
