import type { NextFunction, Request, Response } from "express";
import { getUserFromSessionToken, readSessionCookie } from "../lib/session";
import { HttpError } from "../lib/http-error";

export async function attachUser(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = readSessionCookie(req.cookies ?? {});
    req.user = token ? await getUserFromSessionToken(token) : null;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    next(new HttpError(401, "Authentication required"));
    return;
  }
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    next(new HttpError(403, "Admin access required"));
    return;
  }
  next();
}
