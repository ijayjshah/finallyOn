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
import { districtsTable } from "./districts";
import {
  userRoleEnum,
  userStatusEnum,
  userTypeEnum,
} from "./enums";

export const usersTable = pgTable(
  "users",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    phone: text("phone").notNull(),
    whatsappNumber: text("whatsapp_number").notNull(),
    userType: userTypeEnum("user_type").notNull().default("user"),
    role: userRoleEnum("role").notNull().default("user"),
    status: userStatusEnum("status").notNull().default("pending_verification"),
    city: text("city").notNull(),
    districtId: integer("district_id").references(() => districtsTable.id, {
      onDelete: "set null",
    }),
    districtName: text("district_name").notNull(),
    serviceCategory: text("service_category"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    onboardingCompletedAt: timestamp("onboarding_completed_at", {
      withTimezone: true,
    }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    index("users_district_id_idx").on(table.districtId),
    index("users_status_idx").on(table.status),
    index("users_user_type_idx").on(table.userType),
    index("users_role_idx").on(table.role),
  ],
);

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  emailVerifiedAt: true,
  onboardingCompletedAt: true,
  lastLoginAt: true,
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
