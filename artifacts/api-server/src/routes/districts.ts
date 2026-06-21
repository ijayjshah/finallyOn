import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { areasTable, db, districtsTable } from "@workspace/db";
import { asyncHandler } from "../lib/async-handler";

const router: IRouter = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const districts = await db
      .select()
      .from(districtsTable)
      .orderBy(asc(districtsTable.sortOrder));

    const areas = await db.select().from(areasTable).orderBy(asc(areasTable.name));

    res.json({
      districts: districts.map((d) => ({
        id: String(d.id),
        name: d.name,
        slug: d.slug,
        status: d.status,
        areas: areas
          .filter((a) => a.districtId === d.id)
          .map((a) => ({ id: String(a.id), name: a.name })),
      })),
    });
  }),
);

export default router;
