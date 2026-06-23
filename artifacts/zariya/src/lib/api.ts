import type { Job, Listing, ServiceProfile, User, UserType } from "@/types";
import { getApiBaseUrl } from "@/lib/env";

type ApiUser = Omit<User, "password"> & {
  role?: "user" | "admin";
  status?: string;
  onboardingCompleted?: boolean;
};

type MeResponse = { user: ApiUser | null };

type Result<T> = { data: T; error?: never } | { data?: never; error: string };

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<Result<T>> {
  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: (body as { error?: string }).error ?? res.statusText };
    }

    return { data: body as T };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export const api = {
  async getMe() {
    return request<MeResponse>("/auth/me");
  },

  async login(email: string, password: string) {
    return request<{ user: ApiUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    whatsappNumber: string;
    type: UserType;
    city: string;
    district: string;
    serviceCategory?: string;
  }) {
    return request<{ user: ApiUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout() {
    return request<{ ok: boolean }>("/auth/logout", { method: "POST" });
  },

  async completeOnboarding() {
    return request<{ user: ApiUser }>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify({ onboardingCompleted: true }),
    });
  },

  async getProfiles(params?: { district?: string; category?: string }) {
    const qs = new URLSearchParams();
    if (params?.district) qs.set("district", params.district);
    if (params?.category) qs.set("category", params.category);
    const q = qs.toString();
    return request<{ profiles: ServiceProfile[] }>(
      `/profiles${q ? `?${q}` : ""}`,
    );
  },

  async getMyProfile() {
    return request<{ profile: ServiceProfile | null }>("/profiles/me");
  },

  async getProfile(id: string) {
    return request<{ profile: ServiceProfile }>(`/profiles/${id}`);
  },

  async getProfileBySlug(slug: string) {
    return request<{ profile: ServiceProfile }>(`/profiles/slug/${encodeURIComponent(slug)}`);
  },

  async createProfile(data: Record<string, unknown>) {
    return request<{ profile: ServiceProfile }>("/profiles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateProfile(id: string, data: Record<string, unknown>) {
    return request<{ profile: ServiceProfile }>(`/profiles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async getListings(params?: { district?: string; type?: string }) {
    const qs = new URLSearchParams();
    if (params?.district) qs.set("district", params.district);
    if (params?.type) qs.set("type", params.type);
    const q = qs.toString();
    return request<{ listings: Listing[] }>(`/listings${q ? `?${q}` : ""}`);
  },

  async getMyListings() {
    return request<{ listings: Listing[] }>("/listings/me");
  },

  async createListing(data: Record<string, unknown>) {
    return request<{ listing: Listing }>("/listings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateListing(id: string, data: Record<string, unknown>) {
    return request<{ listing: Listing }>(`/listings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteListing(id: string) {
    return request<{ ok: boolean }>(`/listings/${id}`, { method: "DELETE" });
  },

  async getJobs(params?: { district?: string }) {
    const qs = params?.district ? `?district=${encodeURIComponent(params.district)}` : "";
    return request<{ jobs: Job[] }>(`/jobs${qs}`);
  },

  async getMyJobs() {
    return request<{ jobs: Job[] }>("/jobs/me");
  },

  async createJob(data: Record<string, unknown>) {
    return request<{ job: Job }>("/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateJob(id: string, data: Record<string, unknown>) {
    return request<{ job: Job }>(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteJob(id: string) {
    return request<{ ok: boolean }>(`/jobs/${id}`, { method: "DELETE" });
  },

  async submitWaitlist(data: {
    name: string;
    phone: string;
    email: string;
    district: string;
    category: string;
    customCategory?: string;
  }) {
    return request<{ lead: { id: string } }>("/waitlist", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  admin: {
    async getStats() {
      return request<{
        users: number;
        profiles: number;
        listings: number;
        jobs: number;
        waitlist: number;
        pendingProfiles: number;
        pendingListings: number;
        pendingJobs: number;
      }>("/admin/stats");
    },

    async getUsers() {
      return request<{ users: ApiUser[] }>("/admin/users");
    },

    async updateUser(id: string, data: Record<string, unknown>) {
      return request<{ user: ApiUser }>(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    async deleteUser(id: string) {
      return request<{ ok: boolean }>(`/admin/users/${id}`, { method: "DELETE" });
    },

    async getProfiles() {
      return request<{ profiles: ServiceProfile[] }>("/admin/profiles");
    },

    async updateProfile(id: string, data: Record<string, unknown>) {
      return request<{ profile: ServiceProfile }>(`/admin/profiles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    async deleteProfile(id: string) {
      return request<{ ok: boolean }>(`/admin/profiles/${id}`, { method: "DELETE" });
    },

    async getListings() {
      return request<{ listings: Listing[] }>("/admin/listings");
    },

    async updateListing(id: string, data: Record<string, unknown>) {
      return request<{ listing: Listing }>(`/admin/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    async deleteListing(id: string) {
      return request<{ ok: boolean }>(`/admin/listings/${id}`, { method: "DELETE" });
    },

    async getJobs() {
      return request<{ jobs: Job[] }>("/admin/jobs");
    },

    async updateJob(id: string, data: Record<string, unknown>) {
      return request<{ job: Job }>(`/admin/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    async deleteJob(id: string) {
      return request<{ ok: boolean }>(`/admin/jobs/${id}`, { method: "DELETE" });
    },

    async getWaitlist() {
      return request<{
        leads: Array<{
          id: string;
          name: string;
          phone: string;
          email: string;
          district: string;
          category: string;
          status: string;
          createdAt: string;
        }>;
      }>("/admin/waitlist");
    },
  },
};

export type { ApiUser };
