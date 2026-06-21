import { pgEnum } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", [
  "user",
  "service_provider",
  "business_owner",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const userStatusEnum = pgEnum("user_status", [
  "pending_verification",
  "active",
  "suspended",
]);

export const districtStatusEnum = pgEnum("district_status", [
  "live",
  "coming_soon",
]);

export const categoryKindEnum = pgEnum("category_kind", [
  "service_provider",
  "business",
  "product",
]);

export const profileTypeEnum = pgEnum("profile_type", ["service", "business"]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

export const listingTypeEnum = pgEnum("listing_type", ["service", "product"]);

export const jobListingTypeEnum = pgEnum("job_listing_type", [
  "opening",
  "seeker",
]);

export const waitlistStatusEnum = pgEnum("waitlist_status", [
  "new",
  "contacted",
  "converted",
]);

export const inquiryChannelEnum = pgEnum("inquiry_channel", [
  "whatsapp",
  "call",
  "form",
]);

export const analyticsEventTypeEnum = pgEnum("analytics_event_type", [
  "profile_view",
  "listing_view",
  "job_view",
  "whatsapp_click",
  "call_click",
  "search",
]);

export const approvalEntityTypeEnum = pgEnum("approval_entity_type", [
  "user",
  "profile",
  "listing",
  "job",
]);

export const approvalActionEnum = pgEnum("approval_action", [
  "approved",
  "rejected",
  "suspended",
  "deleted",
  "restored",
]);
