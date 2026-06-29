import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  hashPassword,
  usersTable,
  verifyPassword,
} from "@workspace/db";
import { asyncHandler } from "../lib/async-handler";
import { HttpError } from "../lib/http-error";
import { serializeUser } from "../lib/serializers";
import {
  createSession,
  destroySession,
  readSessionCookie,
} from "../lib/session";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(1),
  whatsappNumber: z.string().min(1),
  type: z.enum(["user", "service_provider", "business_owner"]).default("user"),
  city: z.string().min(1),
  district: z.string().min(1),
  serviceCategory: z.string().optional(),
  instagramUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);

    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, body.email.toLowerCase()))
      .limit(1);

    if (existing) {
      throw new HttpError(409, "An account with this email already exists.");
    }

    const passwordHash = await hashPassword(body.password);

    const [user] = await db
      .insert(usersTable)
      .values({
        name: body.name,
        email: body.email.toLowerCase(),
        passwordHash,
        phone: body.phone,
        whatsappNumber: body.whatsappNumber,
        userType: body.type,
        city: body.city,
        districtName: body.district,
        serviceCategory: body.serviceCategory,
        instagramUrl: body.instagramUrl?.trim() || null,
        websiteUrl: body.websiteUrl?.trim() || null,
        status: "active",
        emailVerifiedAt: new Date(),
      })
      .returning();

    await createSession(user!.id, res, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent") ?? undefined,
    });

    res.status(201).json({ user: serializeUser(user!) });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, body.email.toLowerCase()))
      .limit(1);

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new HttpError(401, "Incorrect email or password.");
    }

    if (user.status === "suspended") {
      throw new HttpError(403, "Your account has been suspended.");
    }

    await createSession(user.id, res, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent") ?? undefined,
    });

    res.json({ user: serializeUser(user) });
  }),
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const token = readSessionCookie(req.cookies ?? {});
    await destroySession(token, res);
    res.json({ ok: true });
  }),
);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    if (!req.user) {
      res.json({ user: null });
      return;
    }
    res.json({ user: serializeUser(req.user) });
  }),
);

router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = z
      .object({ onboardingCompleted: z.boolean().optional() })
      .parse(req.body);

    if (body.onboardingCompleted) {
      const [updated] = await db
        .update(usersTable)
        .set({ onboardingCompletedAt: new Date(), updatedAt: new Date() })
        .where(eq(usersTable.id, req.user!.id))
        .returning();

      res.json({ user: serializeUser(updated!) });
      return;
    }

    res.json({ user: serializeUser(req.user!) });
  }),
);

export default router;
