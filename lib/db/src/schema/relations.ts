import { relations } from "drizzle-orm";
import { approvalLogsTable } from "./approval-logs";
import {
  emailVerificationCodesTable,
  passwordResetTokensTable,
  sessionsTable,
} from "./auth";
import { categoriesTable } from "./categories";
import { areasTable, districtsTable } from "./districts";
import { inquiriesTable } from "./inquiries";
import { jobsTable } from "./jobs";
import { listingPhotosTable, listingsTable } from "./listings";
import { analyticsEventsTable } from "./analytics";
import { reviewsTable } from "./reviews";
import {
  profilePhotosTable,
  profileServicesTable,
  profileTagsTable,
  serviceProfilesTable,
} from "./service-profiles";
import { usersTable } from "./users";
import { waitlistLeadsTable } from "./waitlist";

export const districtsRelations = relations(districtsTable, ({ many }) => ({
  areas: many(areasTable),
  users: many(usersTable),
  profiles: many(serviceProfilesTable),
  listings: many(listingsTable),
  jobs: many(jobsTable),
}));

export const areasRelations = relations(areasTable, ({ one, many }) => ({
  district: one(districtsTable, {
    fields: [areasTable.districtId],
    references: [districtsTable.id],
  }),
  profiles: many(serviceProfilesTable),
  listings: many(listingsTable),
  jobs: many(jobsTable),
}));

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  district: one(districtsTable, {
    fields: [usersTable.districtId],
    references: [districtsTable.id],
  }),
  sessions: many(sessionsTable),
  emailVerificationCodes: many(emailVerificationCodesTable),
  passwordResetTokens: many(passwordResetTokensTable),
  serviceProfile: many(serviceProfilesTable),
  listings: many(listingsTable),
  jobs: many(jobsTable),
  reviewsWritten: many(reviewsTable),
  inquiriesSent: many(inquiriesTable),
  analyticsEvents: many(analyticsEventsTable),
  approvalLogs: many(approvalLogsTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const serviceProfilesRelations = relations(
  serviceProfilesTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [serviceProfilesTable.userId],
      references: [usersTable.id],
    }),
    district: one(districtsTable, {
      fields: [serviceProfilesTable.districtId],
      references: [districtsTable.id],
    }),
    area: one(areasTable, {
      fields: [serviceProfilesTable.areaId],
      references: [areasTable.id],
    }),
    services: many(profileServicesTable),
    photos: many(profilePhotosTable),
    tags: many(profileTagsTable),
    reviews: many(reviewsTable),
    inquiries: many(inquiriesTable),
    analyticsEvents: many(analyticsEventsTable),
  }),
);

export const profileServicesRelations = relations(
  profileServicesTable,
  ({ one }) => ({
    profile: one(serviceProfilesTable, {
      fields: [profileServicesTable.profileId],
      references: [serviceProfilesTable.id],
    }),
  }),
);

export const profilePhotosRelations = relations(profilePhotosTable, ({ one }) => ({
  profile: one(serviceProfilesTable, {
    fields: [profilePhotosTable.profileId],
    references: [serviceProfilesTable.id],
  }),
}));

export const profileTagsRelations = relations(profileTagsTable, ({ one }) => ({
  profile: one(serviceProfilesTable, {
    fields: [profileTagsTable.profileId],
    references: [serviceProfilesTable.id],
  }),
}));

export const listingsRelations = relations(listingsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [listingsTable.userId],
    references: [usersTable.id],
  }),
  district: one(districtsTable, {
    fields: [listingsTable.districtId],
    references: [districtsTable.id],
  }),
  area: one(areasTable, {
    fields: [listingsTable.areaId],
    references: [areasTable.id],
  }),
  photos: many(listingPhotosTable),
  inquiries: many(inquiriesTable),
  analyticsEvents: many(analyticsEventsTable),
}));

export const listingPhotosRelations = relations(listingPhotosTable, ({ one }) => ({
  listing: one(listingsTable, {
    fields: [listingPhotosTable.listingId],
    references: [listingsTable.id],
  }),
}));

export const jobsRelations = relations(jobsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [jobsTable.userId],
    references: [usersTable.id],
  }),
  district: one(districtsTable, {
    fields: [jobsTable.districtId],
    references: [districtsTable.id],
  }),
  area: one(areasTable, {
    fields: [jobsTable.areaId],
    references: [areasTable.id],
  }),
  inquiries: many(inquiriesTable),
  analyticsEvents: many(analyticsEventsTable),
}));

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  profile: one(serviceProfilesTable, {
    fields: [reviewsTable.profileId],
    references: [serviceProfilesTable.id],
  }),
  reviewer: one(usersTable, {
    fields: [reviewsTable.reviewerUserId],
    references: [usersTable.id],
  }),
}));

export const inquiriesRelations = relations(inquiriesTable, ({ one }) => ({
  profile: one(serviceProfilesTable, {
    fields: [inquiriesTable.profileId],
    references: [serviceProfilesTable.id],
  }),
  listing: one(listingsTable, {
    fields: [inquiriesTable.listingId],
    references: [listingsTable.id],
  }),
  job: one(jobsTable, {
    fields: [inquiriesTable.jobId],
    references: [jobsTable.id],
  }),
  sender: one(usersTable, {
    fields: [inquiriesTable.senderUserId],
    references: [usersTable.id],
  }),
}));

export const analyticsEventsRelations = relations(
  analyticsEventsTable,
  ({ one }) => ({
    actor: one(usersTable, {
      fields: [analyticsEventsTable.actorUserId],
      references: [usersTable.id],
    }),
    profile: one(serviceProfilesTable, {
      fields: [analyticsEventsTable.profileId],
      references: [serviceProfilesTable.id],
    }),
    listing: one(listingsTable, {
      fields: [analyticsEventsTable.listingId],
      references: [listingsTable.id],
    }),
    job: one(jobsTable, {
      fields: [analyticsEventsTable.jobId],
      references: [jobsTable.id],
    }),
  }),
);

export const approvalLogsRelations = relations(approvalLogsTable, ({ one }) => ({
  admin: one(usersTable, {
    fields: [approvalLogsTable.adminUserId],
    references: [usersTable.id],
  }),
}));

export const categoriesRelations = relations(categoriesTable, () => ({}));

export const waitlistLeadsRelations = relations(waitlistLeadsTable, () => ({}));

export const schemaRelations = {
  districtsRelations,
  areasRelations,
  usersRelations,
  sessionsRelations,
  serviceProfilesRelations,
  profileServicesRelations,
  profilePhotosRelations,
  profileTagsRelations,
  listingsRelations,
  listingPhotosRelations,
  jobsRelations,
  reviewsRelations,
  inquiriesRelations,
  analyticsEventsRelations,
  approvalLogsRelations,
  categoriesRelations,
  waitlistLeadsRelations,
};
