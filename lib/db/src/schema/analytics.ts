import { index, integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { analyticsEventTypeEnum } from "./enums";
import { jobsTable } from "./jobs";
import { listingsTable } from "./listings";
import { serviceProfilesTable } from "./service-profiles";
import { usersTable } from "./users";

export const analyticsEventsTable = pgTable(
  "analytics_events",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    eventType: analyticsEventTypeEnum("event_type").notNull(),
    actorUserId: integer("actor_user_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    profileId: integer("profile_id").references(() => serviceProfilesTable.id, {
      onDelete: "set null",
    }),
    listingId: integer("listing_id").references(() => listingsTable.id, {
      onDelete: "set null",
    }),
    jobId: integer("job_id").references(() => jobsTable.id, {
      onDelete: "set null",
    }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("analytics_events_event_type_idx").on(table.eventType),
    index("analytics_events_actor_user_id_idx").on(table.actorUserId),
    index("analytics_events_profile_id_idx").on(table.profileId),
    index("analytics_events_listing_id_idx").on(table.listingId),
    index("analytics_events_job_id_idx").on(table.jobId),
    index("analytics_events_created_at_idx").on(table.createdAt),
  ],
);

export const insertAnalyticsEventSchema = createInsertSchema(
  analyticsEventsTable,
).omit({ id: true, createdAt: true });

export type AnalyticsEvent = typeof analyticsEventsTable.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
