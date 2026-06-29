import { Router, type IRouter } from "express";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import {
  approvalLogsTable,
  db,
  jobsTable,
  listingPhotosTable,
  listingsTable,
  profilePhotosTable,
  profileServicesTable,
  profileTagsTable,
  serviceProfilesTable,
  usersTable,
  waitlistLeadsTable,
} from "@workspace/db";
import { asyncHandler } from "../lib/async-handler";
import { HttpError } from "../lib/http-error";
import { logger } from "../lib/logger";
import { generateAndUploadTrustCard } from "../lib/trust-card";
import {
  parseIdParam,
  serializeJob,
  serializeListing,
  serializeProfile,
  serializeUser,
} from "../lib/serializers";
import { requireAdmin } from "../middleware/auth";

const router: IRouter = Router();

router.use(requireAdmin);

async function logApproval(
  adminUserId: number,
  entityType: "user" | "profile" | "listing" | "job",
  entityId: number,
  action: "approved" | "rejected" | "suspended" | "deleted",
  reason?: string,
) {
  await db.insert(approvalLogsTable).values({
    adminUserId,
    entityType,
    entityId,
    action,
    reason,
  });
}

router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [[userCount], [profileCount], [listingCount], [jobCount], [waitlistCount]] =
      await Promise.all([
        db.select({ n: count() }).from(usersTable).where(isNull(usersTable.deletedAt)),
        db.select({ n: count() }).from(serviceProfilesTable),
        db.select({ n: count() }).from(listingsTable),
        db.select({ n: count() }).from(jobsTable),
        db.select({ n: count() }).from(waitlistLeadsTable),
      ]);

    const pendingProfiles = await db
      .select({ n: count() })
      .from(serviceProfilesTable)
      .where(eq(serviceProfilesTable.approvalStatus, "pending"));
    const pendingListings = await db
      .select({ n: count() })
      .from(listingsTable)
      .where(eq(listingsTable.approvalStatus, "pending"));
    const pendingJobs = await db
      .select({ n: count() })
      .from(jobsTable)
      .where(eq(jobsTable.approvalStatus, "pending"));

    res.json({
      users: userCount?.n ?? 0,
      profiles: profileCount?.n ?? 0,
      listings: listingCount?.n ?? 0,
      jobs: jobCount?.n ?? 0,
      waitlist: waitlistCount?.n ?? 0,
      pendingProfiles: pendingProfiles[0]?.n ?? 0,
      pendingListings: pendingListings[0]?.n ?? 0,
      pendingJobs: pendingJobs[0]?.n ?? 0,
    });
  }),
);

router.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const rows = await db
      .select()
      .from(usersTable)
      .where(isNull(usersTable.deletedAt))
      .orderBy(desc(usersTable.createdAt));
    res.json({ users: rows.map(serializeUser) });
  }),
);

const userPatchSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  type: z.enum(["user", "service_provider", "business_owner"]).optional(),
  status: z.enum(["pending_verification", "active", "suspended"]).optional(),
});

router.patch(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const body = userPatchSchema.parse(req.body);

    const [updated] = await db
      .update(usersTable)
      .set({
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.type !== undefined ? { userType: body.type } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(usersTable.id, id), isNull(usersTable.deletedAt)))
      .returning();

    if (!updated) throw new HttpError(404, "User not found");
    res.json({ user: serializeUser(updated) });
  }),
);

router.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const [updated] = await db
      .update(usersTable)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(usersTable.id, id), isNull(usersTable.deletedAt)))
      .returning({ id: usersTable.id });

    if (!updated) throw new HttpError(404, "User not found");
    await logApproval(req.user!.id, "user", id, "deleted");
    res.json({ ok: true });
  }),
);

router.get(
  "/profiles",
  asyncHandler(async (_req, res) => {
    const rows = await db.query.serviceProfilesTable.findMany({
      with: { services: true, photos: true, tags: true },
      orderBy: [desc(serviceProfilesTable.createdAt)],
    });
    res.json({ profiles: rows.map(serializeProfile) });
  }),
);

const profileAdminPatchSchema = z.object({
  approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
  verified: z.boolean().optional(),
  available: z.boolean().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

router.patch(
  "/profiles/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const body = profileAdminPatchSchema.parse(req.body);

    const existing = await db.query.serviceProfilesTable.findFirst({
      where: eq(serviceProfilesTable.id, id),
    });
    if (!existing) throw new HttpError(404, "Profile not found");

    await db
      .update(serviceProfilesTable)
      .set({
        ...(body.approvalStatus !== undefined
          ? { approvalStatus: body.approvalStatus }
          : {}),
        ...(body.verified !== undefined ? { verified: body.verified } : {}),
        ...(body.available !== undefined ? { available: body.available } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        updatedAt: new Date(),
      })
      .where(eq(serviceProfilesTable.id, id));

    if (body.tags) {
      await db.delete(profileTagsTable).where(eq(profileTagsTable.profileId, id));
      if (body.tags.length) {
        await db.insert(profileTagsTable).values(
          body.tags.map((tag) => ({ profileId: id, tag })),
        );
      }
    }

    if (body.approvalStatus === "approved" || body.approvalStatus === "rejected") {
      await logApproval(req.user!.id, "profile", id, body.approvalStatus);
    }

    if (body.approvalStatus === "approved") {
      try {
        await generateAndUploadTrustCard(id);
      } catch (err) {
        logger.error({ err, profileId: id }, "Trust card generation failed after profile approval");
      }
    }

    const updated = await db.query.serviceProfilesTable.findFirst({
      where: eq(serviceProfilesTable.id, id),
      with: { services: true, photos: true, tags: true },
    });

    res.json({ profile: serializeProfile(updated!) });
  }),
);

router.delete(
  "/profiles/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const existing = await db.query.serviceProfilesTable.findFirst({
      where: eq(serviceProfilesTable.id, id),
      columns: { id: true },
    });
    if (!existing) throw new HttpError(404, "Profile not found");

    await db.delete(profileServicesTable).where(eq(profileServicesTable.profileId, id));
    await db.delete(profilePhotosTable).where(eq(profilePhotosTable.profileId, id));
    await db.delete(profileTagsTable).where(eq(profileTagsTable.profileId, id));
    await db.delete(serviceProfilesTable).where(eq(serviceProfilesTable.id, id));
    await logApproval(req.user!.id, "profile", id, "deleted");
    res.json({ ok: true });
  }),
);

router.get(
  "/listings",
  asyncHandler(async (_req, res) => {
    const rows = await db.query.listingsTable.findMany({
      with: { photos: true },
      orderBy: [desc(listingsTable.createdAt)],
    });
    res.json({ listings: rows.map(serializeListing) });
  }),
);

const listingAdminPatchSchema = z.object({
  approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
  active: z.boolean().optional(),
});

router.patch(
  "/listings/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const body = listingAdminPatchSchema.parse(req.body);

    const [updated] = await db
      .update(listingsTable)
      .set({
        ...(body.approvalStatus !== undefined
          ? { approvalStatus: body.approvalStatus }
          : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
        updatedAt: new Date(),
      })
      .where(eq(listingsTable.id, id))
      .returning();

    if (!updated) throw new HttpError(404, "Listing not found");

    if (body.approvalStatus === "approved" || body.approvalStatus === "rejected") {
      await logApproval(req.user!.id, "listing", id, body.approvalStatus);
    }

    const full = await db.query.listingsTable.findFirst({
      where: eq(listingsTable.id, id),
      with: { photos: true },
    });

    res.json({ listing: serializeListing(full!) });
  }),
);

router.delete(
  "/listings/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const existing = await db.query.listingsTable.findFirst({
      where: eq(listingsTable.id, id),
      columns: { id: true },
    });
    if (!existing) throw new HttpError(404, "Listing not found");

    await db.delete(listingPhotosTable).where(eq(listingPhotosTable.listingId, id));
    await db.delete(listingsTable).where(eq(listingsTable.id, id));
    await logApproval(req.user!.id, "listing", id, "deleted");
    res.json({ ok: true });
  }),
);

router.get(
  "/jobs",
  asyncHandler(async (_req, res) => {
    const rows = await db
      .select()
      .from(jobsTable)
      .orderBy(desc(jobsTable.createdAt));
    res.json({ jobs: rows.map(serializeJob) });
  }),
);

const jobAdminPatchSchema = z.object({
  approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
  active: z.boolean().optional(),
});

router.patch(
  "/jobs/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const body = jobAdminPatchSchema.parse(req.body);

    const [updated] = await db
      .update(jobsTable)
      .set({
        ...(body.approvalStatus !== undefined
          ? { approvalStatus: body.approvalStatus }
          : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
        updatedAt: new Date(),
      })
      .where(eq(jobsTable.id, id))
      .returning();

    if (!updated) throw new HttpError(404, "Job not found");

    if (body.approvalStatus === "approved" || body.approvalStatus === "rejected") {
      await logApproval(req.user!.id, "job", id, body.approvalStatus);
    }

    res.json({ job: serializeJob(updated) });
  }),
);

router.delete(
  "/jobs/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const [existing] = await db
      .select({ id: jobsTable.id })
      .from(jobsTable)
      .where(eq(jobsTable.id, id))
      .limit(1);
    if (!existing) throw new HttpError(404, "Job not found");

    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    await logApproval(req.user!.id, "job", id, "deleted");
    res.json({ ok: true });
  }),
);

router.get(
  "/waitlist",
  asyncHandler(async (_req, res) => {
    const rows = await db
      .select()
      .from(waitlistLeadsTable)
      .orderBy(desc(waitlistLeadsTable.createdAt));

    res.json({
      leads: rows.map((l) => ({
        id: String(l.id),
        name: l.name,
        phone: l.phone,
        email: l.email,
        district: l.district,
        category: l.category,
        customCategory: l.customCategory ?? undefined,
        status: l.status,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  }),
);

const waitlistPatchSchema = z.object({
  status: z.enum(["new", "contacted", "converted"]).optional(),
  notes: z.string().optional(),
});

router.patch(
  "/waitlist/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const body = waitlistPatchSchema.parse(req.body);

    const [updated] = await db
      .update(waitlistLeadsTable)
      .set({
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        updatedAt: new Date(),
      })
      .where(eq(waitlistLeadsTable.id, id))
      .returning();

    if (!updated) throw new HttpError(404, "Waitlist lead not found");

    res.json({
      lead: {
        id: String(updated.id),
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        district: updated.district,
        category: updated.category,
        customCategory: updated.customCategory ?? undefined,
        status: updated.status,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  }),
);

export default router;
