import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { areasTable, districtsTable } from "./districts";
import { approvalStatusEnum, profileTypeEnum } from "./enums";
import { usersTable } from "./users";

export const serviceProfilesTable = pgTable(
  "service_profiles",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    category: text("category").notNull(),
    profileType: profileTypeEnum("profile_type").notNull(),
    city: text("city").notNull(),
    area: text("area").notNull(),
    districtName: text("district_name").notNull(),
    districtId: integer("district_id").references(() => districtsTable.id, {
      onDelete: "set null",
    }),
    areaId: integer("area_id").references(() => areasTable.id, {
      onDelete: "set null",
    }),
    description: text("description").notNull().default(""),
    experience: text("experience").notNull().default(""),
    phone: text("phone").notNull(),
    whatsappNumber: text("whatsapp_number").notNull(),
    mapUrl: text("map_url").notNull().default(""),
    resumeUrl: text("resume_url"),
    verified: boolean("verified").notNull().default(false),
    available: boolean("available").notNull().default(true),
    rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("0"),
    reviewCount: integer("review_count").notNull().default(0),
    approvalStatus: approvalStatusEnum("approval_status")
      .notNull()
      .default("pending"),
    rejectionReason: text("rejection_reason"),
    deliveryAvailable: boolean("delivery_available").notNull().default(false),
    pickupAvailable: boolean("pickup_available").notNull().default(true),
    trustCardUrl: text("trust_card_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("service_profiles_user_id_unique").on(table.userId),
    uniqueIndex("service_profiles_slug_unique").on(table.slug),
    index("service_profiles_approval_status_idx").on(table.approvalStatus),
    index("service_profiles_district_name_idx").on(table.districtName),
    index("service_profiles_category_idx").on(table.category),
    index("service_profiles_profile_type_idx").on(table.profileType),
    index("service_profiles_verified_idx").on(table.verified),
    index("service_profiles_available_idx").on(table.available),
  ],
);

export const profileServicesTable = pgTable(
  "profile_services",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => serviceProfilesTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    price: text("price").notNull(),
    description: text("description").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("profile_services_profile_id_idx").on(table.profileId),
    index("profile_services_sort_order_idx").on(table.profileId, table.sortOrder),
  ],
);

export const profilePhotosTable = pgTable(
  "profile_photos",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => serviceProfilesTable.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("profile_photos_profile_id_idx").on(table.profileId),
    index("profile_photos_sort_order_idx").on(table.profileId, table.sortOrder),
  ],
);

export const profileTagsTable = pgTable(
  "profile_tags",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    profileId: integer("profile_id")
      .notNull()
      .references(() => serviceProfilesTable.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("profile_tags_profile_tag_unique").on(table.profileId, table.tag),
    index("profile_tags_tag_idx").on(table.tag),
  ],
);

export const insertServiceProfileSchema = createInsertSchema(
  serviceProfilesTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  reviewCount: true,
});
export const insertProfileServiceSchema = createInsertSchema(
  profileServicesTable,
).omit({ id: true, createdAt: true });
export const insertProfilePhotoSchema = createInsertSchema(
  profilePhotosTable,
).omit({ id: true, createdAt: true });
export const insertProfileTagSchema = createInsertSchema(profileTagsTable).omit({
  id: true,
  createdAt: true,
});

export type ServiceProfile = typeof serviceProfilesTable.$inferSelect;
export type InsertServiceProfile = z.infer<typeof insertServiceProfileSchema>;
export type ProfileService = typeof profileServicesTable.$inferSelect;
export type ProfilePhoto = typeof profilePhotosTable.$inferSelect;
export type ProfileTag = typeof profileTagsTable.$inferSelect;
