import type {
  Job,
  Listing,
  ListingPhoto,
  ProfilePhoto,
  ProfileService,
  ProfileTag,
  ServiceProfile,
  User,
} from "@workspace/db";
import { HttpError } from "./http-error";

type ProfileRow = ServiceProfile & {
  services?: ProfileService[];
  photos?: ProfilePhoto[];
  tags?: ProfileTag[];
};

type ListingRow = Listing & {
  photos?: ListingPhoto[];
};

export function serializeUser(user: User) {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    whatsappNumber: user.whatsappNumber,
    type: user.userType,
    city: user.city,
    district: user.districtName,
    serviceCategory: user.serviceCategory ?? undefined,
    instagramUrl: user.instagramUrl ?? undefined,
    websiteUrl: user.websiteUrl ?? undefined,
    role: user.role,
    status: user.status,
    onboardingCompleted: Boolean(user.onboardingCompletedAt),
    createdAt: user.createdAt.toISOString(),
  };
}

export function serializeProfile(profile: ProfileRow) {
  return {
    id: String(profile.id),
    userId: String(profile.userId),
    slug: profile.slug,
    name: profile.name,
    category: profile.category,
    profileType: profile.profileType,
    city: profile.city,
    area: profile.area,
    district: profile.districtName,
    description: profile.description,
    photos: (profile.photos ?? [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((p) => p.url),
    services: (profile.services ?? [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({
        id: String(s.id),
        name: s.name,
        price: s.price,
        description: s.description,
      })),
    rating: Number(profile.rating),
    reviewCount: profile.reviewCount,
    experience: profile.experience,
    phone: profile.phone,
    whatsappNumber: profile.whatsappNumber,
    mapUrl: profile.mapUrl,
    verified: profile.verified,
    available: profile.available,
    tags: (profile.tags ?? []).map((t) => t.tag),
    approvalStatus: profile.approvalStatus,
    resumeUrl: profile.resumeUrl ?? undefined,
    deliveryAvailable: profile.deliveryAvailable,
    pickupAvailable: profile.pickupAvailable,
    trustCardUrl: profile.trustCardUrl ?? undefined,
    createdAt: profile.createdAt.toISOString(),
  };
}

export function serializeListing(listing: ListingRow) {
  return {
    id: String(listing.id),
    userId: String(listing.userId),
    title: listing.title,
    category: listing.category,
    subCategory: listing.subCategory,
    description: listing.description,
    price: listing.price,
    city: listing.city,
    area: listing.area,
    district: listing.districtName,
    photos: (listing.photos ?? [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((p) => p.url),
    type: listing.type,
    deliveryAvailable: listing.deliveryAvailable,
    pickupAvailable: listing.pickupAvailable,
    whatsappNumber: listing.whatsappNumber,
    active: listing.active,
    approvalStatus: listing.approvalStatus,
    createdAt: listing.createdAt.toISOString(),
  };
}

export function serializeJob(job: Job) {
  return {
    id: String(job.id),
    userId: String(job.userId),
    posterName: job.posterName,
    listingType: job.listingType,
    title: job.title,
    category: job.category,
    city: job.city,
    area: job.area,
    district: job.districtName,
    description: job.description,
    salary: job.salary,
    employmentType: job.employmentType,
    experience: job.experience,
    contact: job.contact,
    whatsappNumber: job.whatsappNumber,
    resumeRequired: job.resumeRequired,
    approvalStatus: job.approvalStatus,
    active: job.active,
    createdAt: job.createdAt.toISOString(),
  };
}

export function parseIdParam(value: string | string[], label = "id"): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);
  if (!raw || !Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `Invalid ${label}`);
  }
  return id;
}
