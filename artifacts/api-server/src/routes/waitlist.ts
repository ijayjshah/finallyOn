import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, waitlistLeadsTable } from "@workspace/db";
import { asyncHandler } from "../lib/async-handler";

const router: IRouter = Router();

const waitlistSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  district: z.string().min(1),
  category: z.string().min(1),
  customCategory: z.string().optional(),
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = waitlistSchema.parse(req.body);

    const [lead] = await db
      .insert(waitlistLeadsTable)
      .values({
        name: body.name,
        phone: body.phone,
        email: body.email,
        district: body.district,
        category: body.category,
        customCategory: body.customCategory,
        status: "new",
      })
      .returning();

    res.status(201).json({
      lead: {
        id: String(lead!.id),
        name: lead!.name,
        phone: lead!.phone,
        email: lead!.email,
        district: lead!.district,
        category: lead!.category,
        status: lead!.status,
        createdAt: lead!.createdAt.toISOString(),
      },
    });
  }),
);

export default router;
