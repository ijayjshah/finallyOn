import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, jobsTable } from "@workspace/db";
import { asyncHandler } from "../lib/async-handler";
import { HttpError } from "../lib/http-error";
import { parseIdParam, serializeJob } from "../lib/serializers";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

const jobBodySchema = z.object({
  posterName: z.string().min(1),
  listingType: z.enum(["opening", "seeker"]),
  title: z.string().min(1),
  category: z.string().min(1),
  city: z.string().min(1),
  area: z.string().min(1),
  district: z.string().min(1),
  description: z.string().default(""),
  salary: z.string().default(""),
  employmentType: z.string().default(""),
  experience: z.string().default(""),
  contact: z.string().min(1),
  whatsappNumber: z.string().min(1),
  resumeRequired: z.boolean().optional(),
  active: z.boolean().default(true),
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const district = typeof req.query.district === "string" ? req.query.district : undefined;

    const rows = await db
      .select()
      .from(jobsTable)
      .where(
        and(
          eq(jobsTable.approvalStatus, "approved"),
          eq(jobsTable.active, true),
          district ? eq(jobsTable.districtName, district) : undefined,
        ),
      )
      .orderBy(desc(jobsTable.createdAt));

    res.json({ jobs: rows.map(serializeJob) });
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.userId, req.user!.id))
      .orderBy(desc(jobsTable.createdAt));

    res.json({ jobs: rows.map(serializeJob) });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id)).limit(1);
    if (!job) throw new HttpError(404, "Job not found");

    const isOwner = req.user?.id === job.userId;
    const isAdmin = req.user?.role === "admin";
    if (job.approvalStatus !== "approved" && !isOwner && !isAdmin) {
      throw new HttpError(404, "Job not found");
    }

    res.json({ job: serializeJob(job) });
  }),
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = jobBodySchema.parse(req.body);

    const [job] = await db
      .insert(jobsTable)
      .values({
        userId: req.user!.id,
        posterName: body.posterName,
        listingType: body.listingType,
        title: body.title,
        category: body.category,
        description: body.description,
        salary: body.salary,
        employmentType: body.employmentType,
        experience: body.experience,
        city: body.city,
        area: body.area,
        districtName: body.district,
        contact: body.contact,
        whatsappNumber: body.whatsappNumber,
        resumeRequired: body.resumeRequired ?? false,
        active: body.active,
        approvalStatus: "pending",
      })
      .returning();

    res.status(201).json({ job: serializeJob(job!) });
  }),
);

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const body = jobBodySchema.partial().parse(req.body);

    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id)).limit(1);
    if (!job) throw new HttpError(404, "Job not found");

    const isOwner = job.userId === req.user!.id;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) throw new HttpError(403, "Forbidden");

    const [updated] = await db
      .update(jobsTable)
      .set({
        ...(body.posterName !== undefined ? { posterName: body.posterName } : {}),
        ...(body.listingType !== undefined ? { listingType: body.listingType } : {}),
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.salary !== undefined ? { salary: body.salary } : {}),
        ...(body.employmentType !== undefined ? { employmentType: body.employmentType } : {}),
        ...(body.experience !== undefined ? { experience: body.experience } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.area !== undefined ? { area: body.area } : {}),
        ...(body.district !== undefined ? { districtName: body.district } : {}),
        ...(body.contact !== undefined ? { contact: body.contact } : {}),
        ...(body.whatsappNumber !== undefined ? { whatsappNumber: body.whatsappNumber } : {}),
        ...(body.resumeRequired !== undefined ? { resumeRequired: body.resumeRequired } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
        ...(isOwner && !isAdmin ? { approvalStatus: "pending" as const } : {}),
        updatedAt: new Date(),
      })
      .where(eq(jobsTable.id, id))
      .returning();

    res.json({ job: serializeJob(updated!) });
  }),
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = parseIdParam(req.params.id);
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id)).limit(1);
    if (!job) throw new HttpError(404, "Job not found");

    const isOwner = job.userId === req.user!.id;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) throw new HttpError(403, "Forbidden");

    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    res.json({ ok: true });
  }),
);

export default router;
