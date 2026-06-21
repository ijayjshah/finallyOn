import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { areasTable, districtsTable } from "./districts";
import { approvalStatusEnum, jobListingTypeEnum } from "./enums";
import { usersTable } from "./users";

export const jobsTable = pgTable(
  "jobs",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    posterName: text("poster_name").notNull(),
    listingType: jobListingTypeEnum("listing_type").notNull(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    description: text("description").notNull().default(""),
    salary: text("salary").notNull().default(""),
    employmentType: text("employment_type").notNull().default(""),
    experience: text("experience").notNull().default(""),
    city: text("city").notNull(),
    area: text("area").notNull(),
    districtName: text("district_name").notNull(),
    districtId: integer("district_id").references(() => districtsTable.id, {
      onDelete: "set null",
    }),
    areaId: integer("area_id").references(() => areasTable.id, {
      onDelete: "set null",
    }),
    contact: text("contact").notNull(),
    whatsappNumber: text("whatsapp_number").notNull(),
    resumeRequired: boolean("resume_required").notNull().default(false),
    approvalStatus: approvalStatusEnum("approval_status")
      .notNull()
      .default("pending"),
    rejectionReason: text("rejection_reason"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("jobs_user_id_idx").on(table.userId),
    index("jobs_approval_status_idx").on(table.approvalStatus),
    index("jobs_listing_type_idx").on(table.listingType),
    index("jobs_district_name_idx").on(table.districtName),
    index("jobs_category_idx").on(table.category),
    index("jobs_active_idx").on(table.active),
  ],
);

export const insertJobSchema = createInsertSchema(jobsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Job = typeof jobsTable.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
