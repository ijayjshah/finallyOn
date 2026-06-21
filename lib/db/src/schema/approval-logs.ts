import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import {
  approvalActionEnum,
  approvalEntityTypeEnum,
} from "./enums";
import { usersTable } from "./users";

export const approvalLogsTable = pgTable(
  "approval_logs",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    adminUserId: integer("admin_user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    entityType: approvalEntityTypeEnum("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    action: approvalActionEnum("action").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("approval_logs_admin_user_id_idx").on(table.adminUserId),
    index("approval_logs_entity_idx").on(table.entityType, table.entityId),
    index("approval_logs_action_idx").on(table.action),
    index("approval_logs_created_at_idx").on(table.createdAt),
  ],
);

export const insertApprovalLogSchema = createInsertSchema(approvalLogsTable).omit(
  {
    id: true,
    createdAt: true,
  },
);

export type ApprovalLog = typeof approvalLogsTable.$inferSelect;
export type InsertApprovalLog = z.infer<typeof insertApprovalLogSchema>;
