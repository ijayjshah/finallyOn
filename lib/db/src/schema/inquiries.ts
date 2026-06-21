import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { inquiryChannelEnum } from "./enums";
import { jobsTable } from "./jobs";
import { listingsTable } from "./listings";
import { serviceProfilesTable } from "./service-profiles";
import { usersTable } from "./users";

export const inquiriesTable = pgTable(
  "inquiries",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    profileId: integer("profile_id").references(() => serviceProfilesTable.id, {
      onDelete: "set null",
    }),
    listingId: integer("listing_id").references(() => listingsTable.id, {
      onDelete: "set null",
    }),
    jobId: integer("job_id").references(() => jobsTable.id, {
      onDelete: "set null",
    }),
    senderUserId: integer("sender_user_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    visitorName: text("visitor_name"),
    visitorPhone: text("visitor_phone"),
    visitorEmail: text("visitor_email"),
    message: text("message").notNull().default(""),
    channel: inquiryChannelEnum("channel").notNull().default("whatsapp"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("inquiries_profile_id_idx").on(table.profileId),
    index("inquiries_listing_id_idx").on(table.listingId),
    index("inquiries_job_id_idx").on(table.jobId),
    index("inquiries_sender_user_id_idx").on(table.senderUserId),
    index("inquiries_channel_idx").on(table.channel),
    index("inquiries_created_at_idx").on(table.createdAt),
  ],
);

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({
  id: true,
  createdAt: true,
});

export type Inquiry = typeof inquiriesTable.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
