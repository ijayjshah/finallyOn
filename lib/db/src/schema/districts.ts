import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { districtStatusEnum } from "./enums";

export const districtsTable = pgTable(
  "districts",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    status: districtStatusEnum("status").notNull().default("coming_soon"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("districts_name_unique").on(table.name),
    uniqueIndex("districts_slug_unique").on(table.slug),
    index("districts_status_idx").on(table.status),
  ],
);

export const areasTable = pgTable(
  "areas",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    districtId: integer("district_id")
      .notNull()
      .references(() => districtsTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("areas_district_name_unique").on(table.districtId, table.name),
    index("areas_district_id_idx").on(table.districtId),
  ],
);

export const insertDistrictSchema = createInsertSchema(districtsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertAreaSchema = createInsertSchema(areasTable).omit({
  id: true,
  createdAt: true,
});

export type District = typeof districtsTable.$inferSelect;
export type InsertDistrict = z.infer<typeof insertDistrictSchema>;
export type Area = typeof areasTable.$inferSelect;
export type InsertArea = z.infer<typeof insertAreaSchema>;
