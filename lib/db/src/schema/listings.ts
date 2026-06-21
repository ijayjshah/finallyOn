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
import { approvalStatusEnum, listingTypeEnum } from "./enums";
import { usersTable } from "./users";

export const listingsTable = pgTable(
  "listings",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    category: text("category").notNull(),
    subCategory: text("sub_category").notNull().default(""),
    description: text("description").notNull().default(""),
    price: text("price").notNull().default(""),
    city: text("city").notNull(),
    area: text("area").notNull(),
    districtName: text("district_name").notNull(),
    districtId: integer("district_id").references(() => districtsTable.id, {
      onDelete: "set null",
    }),
    areaId: integer("area_id").references(() => areasTable.id, {
      onDelete: "set null",
    }),
    type: listingTypeEnum("type").notNull(),
    deliveryAvailable: boolean("delivery_available").notNull().default(false),
    pickupAvailable: boolean("pickup_available").notNull().default(true),
    whatsappNumber: text("whatsapp_number").notNull(),
    active: boolean("active").notNull().default(true),
    approvalStatus: approvalStatusEnum("approval_status")
      .notNull()
      .default("pending"),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("listings_user_id_idx").on(table.userId),
    index("listings_approval_status_idx").on(table.approvalStatus),
    index("listings_type_idx").on(table.type),
    index("listings_district_name_idx").on(table.districtName),
    index("listings_category_idx").on(table.category),
    index("listings_active_idx").on(table.active),
  ],
);

export const listingPhotosTable = pgTable(
  "listing_photos",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listingsTable.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("listing_photos_listing_id_idx").on(table.listingId),
    index("listing_photos_sort_order_idx").on(table.listingId, table.sortOrder),
  ],
);

export const insertListingSchema = createInsertSchema(listingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertListingPhotoSchema = createInsertSchema(
  listingPhotosTable,
).omit({ id: true, createdAt: true });

export type Listing = typeof listingsTable.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type ListingPhoto = typeof listingPhotosTable.$inferSelect;
