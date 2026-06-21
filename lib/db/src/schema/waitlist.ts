import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { waitlistStatusEnum } from "./enums";

export const waitlistLeadsTable = pgTable(
  "waitlist_leads",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    district: text("district").notNull(),
    category: text("category").notNull(),
    customCategory: text("custom_category"),
    status: waitlistStatusEnum("status").notNull().default("new"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("waitlist_leads_status_idx").on(table.status),
    index("waitlist_leads_district_idx").on(table.district),
    index("waitlist_leads_email_idx").on(table.email),
    index("waitlist_leads_created_at_idx").on(table.createdAt),
  ],
);

export const insertWaitlistLeadSchema = createInsertSchema(waitlistLeadsTable).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
);

export type WaitlistLead = typeof waitlistLeadsTable.$inferSelect;
export type InsertWaitlistLead = z.infer<typeof insertWaitlistLeadSchema>;
