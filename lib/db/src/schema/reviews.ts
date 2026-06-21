import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { serviceProfilesTable } from "./service-profiles";
import { usersTable } from "./users";

export const reviewsTable = pgTable(
  "reviews",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => serviceProfilesTable.id, { onDelete: "cascade" }),
    reviewerUserId: integer("reviewer_user_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    reviewerName: text("reviewer_name").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("reviews_profile_id_idx").on(table.profileId),
    index("reviews_reviewer_user_id_idx").on(table.reviewerUserId),
    index("reviews_rating_idx").on(table.rating),
    index("reviews_created_at_idx").on(table.createdAt),
  ],
);

export const insertReviewSchema = createInsertSchema(reviewsTable)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    rating: z.number().int().min(1).max(5),
  });

export type Review = typeof reviewsTable.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
