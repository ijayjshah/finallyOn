import { createHash, randomBytes } from "node:crypto";
import type { CookieOptions, Response } from "express";
import { eq } from "drizzle-orm";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { needsCrossSiteSessionCookies } from "./cors-origins";

const COOKIE_NAME = "finallyon_session";
const SESSION_DAYS = 7;

function getSessionCookieOptions(): CookieOptions {
  const crossSite = needsCrossSiteSessionCookies();
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
  secure: isProduction || crossSite,
    sameSite: crossSite ? "none" : "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(
  userId: number,
  res: Response,
  meta?: { ipAddress?: string; userAgent?: string },
) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(sessionsTable).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  res.cookie(COOKIE_NAME, token, getSessionCookieOptions());
}

export async function destroySession(token: string | undefined, res: Response) {
  if (token) {
    await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.tokenHash, hashToken(token)));
  }

  const { secure, sameSite, path } = getSessionCookieOptions();
  res.clearCookie(COOKIE_NAME, { path, secure, sameSite });
}

export async function getUserFromSessionToken(token: string | undefined) {
  if (!token) return null;

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(
      eq(sessionsTable.tokenHash, hashToken(token)),
    )
    .limit(1);

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.userId))
    .limit(1);

  if (!user || user.deletedAt || user.status === "suspended") {
    return null;
  }

  return user;
}

export function readSessionCookie(cookies: Record<string, string | undefined>) {
  return cookies[COOKIE_NAME];
}

export { COOKIE_NAME };
