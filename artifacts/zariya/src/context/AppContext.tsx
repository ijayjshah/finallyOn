import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, ServiceProfile, Listing, Job } from "@/types";
import { api, type ApiUser } from "@/lib/api";

export type AppUser = Omit<User, "password"> & {
  role?: "user" | "admin";
  onboardingCompleted?: boolean;
};

interface AppContextType {
  currentUser: AppUser | null;
  loading: boolean;
  users: AppUser[];
  profiles: ServiceProfile[];
  listings: Listing[];
  jobs: Job[];
  myProfile: ServiceProfile | null;
  myListings: Listing[];
  myJobs: Job[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: Omit<User, "id" | "createdAt"> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;
  updateUser: (id: string, data: Partial<AppUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  createProfile: (data: Omit<ServiceProfile, "id" | "createdAt">) => Promise<ServiceProfile | null>;
  updateProfile: (id: string, data: Partial<ServiceProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  getProfileByUserId: (userId: string) => ServiceProfile | undefined;
  getProfileById: (id: string) => ServiceProfile | undefined;
  addListing: (data: Omit<Listing, "id" | "createdAt">) => Promise<Listing | null>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  getListingsByUserId: (userId: string) => Listing[];
  addJob: (data: Omit<Job, "id" | "createdAt">) => Promise<Job | null>;
  updateJob: (id: string, data: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJobsByUserId: (userId: string) => Job[];
}

const AppContext = createContext<AppContextType | null>(null);

function toAppUser(user: ApiUser): AppUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    whatsappNumber: user.whatsappNumber,
    type: user.type,
    serviceCategory: user.serviceCategory,
    city: user.city,
    district: user.district,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [profiles, setProfiles] = useState<ServiceProfile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myProfile, setMyProfile] = useState<ServiceProfile | null>(null);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);

  const loadPublicData = useCallback(async () => {
    const [profilesRes, listingsRes, jobsRes] = await Promise.all([
      api.getProfiles(),
      api.getListings(),
      api.getJobs(),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data.profiles);
    if (listingsRes.data) setListings(listingsRes.data.listings);
    if (jobsRes.data) setJobs(jobsRes.data.jobs);
  }, []);

  const loadMyData = useCallback(async () => {
    const [profileRes, listingsRes, jobsRes] = await Promise.all([
      api.getMyProfile(),
      api.getMyListings(),
      api.getMyJobs(),
    ]);
    if (profileRes.data) setMyProfile(profileRes.data.profile);
    if (listingsRes.data) setMyListings(listingsRes.data.listings);
    if (jobsRes.data) setMyJobs(jobsRes.data.jobs);
  }, []);

  const loadAdminData = useCallback(async () => {
    const [usersRes, profilesRes, listingsRes, jobsRes] = await Promise.all([
      api.admin.getUsers(),
      api.admin.getProfiles(),
      api.admin.getListings(),
      api.admin.getJobs(),
    ]);
    if (usersRes.data) setUsers(usersRes.data.users.map(toAppUser));
    if (profilesRes.data) setProfiles(profilesRes.data.profiles);
    if (listingsRes.data) setListings(listingsRes.data.listings);
    if (jobsRes.data) setJobs(jobsRes.data.jobs);
  }, []);

  const refreshData = useCallback(async () => {
    if (currentUser?.role === "admin") {
      await loadAdminData();
    } else {
      await loadPublicData();
      if (currentUser) await loadMyData();
    }
  }, [currentUser, loadAdminData, loadPublicData, loadMyData]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      const meRes = await api.getMe();
      if (cancelled) return;

      const user = meRes.data?.user ? toAppUser(meRes.data.user) : null;
      if (user) {
        setCurrentUser(user);
        if (user.role === "admin") {
          await loadAdminData();
        } else {
          await Promise.all([loadPublicData(), loadMyData()]);
        }
      } else {
        setCurrentUser(null);
        await loadPublicData();
      }

      if (!cancelled) setLoading(false);
    }

    void init();
    return () => { cancelled = true; };
  }, [loadAdminData, loadPublicData, loadMyData]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.error || !res.data) {
      return { success: false, error: res.error ?? "Login failed." };
    }
    const user = toAppUser(res.data.user);
    setCurrentUser(user);
    if (user.role === "admin") {
      await loadAdminData();
    } else {
      await Promise.all([loadPublicData(), loadMyData()]);
    }
    return { success: true };
  }, [loadAdminData, loadPublicData, loadMyData]);

  const logout = useCallback(async () => {
    await api.logout();
    setCurrentUser(null);
    setMyProfile(null);
    setMyListings([]);
    setMyJobs([]);
    setUsers([]);
    await loadPublicData();
  }, [loadPublicData]);

  const register = useCallback(async (data: Omit<User, "id" | "createdAt"> & { password: string }) => {
    const res = await api.register({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      whatsappNumber: data.whatsappNumber,
      type: data.type,
      city: data.city,
      district: data.district,
      serviceCategory: data.serviceCategory,
    });
    if (res.error || !res.data) {
      return { success: false, error: res.error ?? "Registration failed." };
    }
    const user = toAppUser(res.data.user);
    setCurrentUser(user);
    await Promise.all([loadPublicData(), loadMyData()]);
    return { success: true };
  }, [loadPublicData, loadMyData]);

  const updateUser = useCallback(async (id: string, data: Partial<AppUser>) => {
    const res = await api.admin.updateUser(id, data);
    if (res.data) {
      setUsers((prev) => prev.map((u) => (u.id === id ? toAppUser(res.data!.user) : u)));
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    await api.admin.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const profilePayload = (data: Partial<ServiceProfile>) => ({
    name: data.name,
    category: data.category,
    profileType: data.profileType,
    city: data.city,
    area: data.area,
    district: data.district,
    description: data.description,
    experience: data.experience,
    phone: data.phone,
    whatsappNumber: data.whatsappNumber,
    mapUrl: data.mapUrl,
    resumeUrl: data.resumeUrl,
    photos: data.photos,
    services: data.services?.map(({ name, price, description }) => ({ name, price, description })),
    tags: data.tags,
    deliveryAvailable: data.deliveryAvailable,
    pickupAvailable: data.pickupAvailable,
  });

  const createProfile = useCallback(async (data: Omit<ServiceProfile, "id" | "createdAt">) => {
    const profileType =
      data.profileType ??
      (currentUser?.type === "business_owner" ? "business" : "service");

    const res = await api.createProfile({
      ...profilePayload(data),
      profileType,
    });
    if (!res.data) return null;
    const profile = res.data.profile;
    setMyProfile(profile);
    if (profile.approvalStatus === "approved") {
      setProfiles((prev) => [...prev, profile]);
    }
    return profile;
  }, [currentUser?.type]);

  const updateProfile = useCallback(async (id: string, data: Partial<ServiceProfile>) => {
    const isAdmin = currentUser?.role === "admin";
    const adminFields = ["approvalStatus", "verified", "available", "category", "description", "tags"] as const;
    const hasAdminField = adminFields.some((k) => data[k] !== undefined);

    const res = isAdmin && hasAdminField
      ? await api.admin.updateProfile(id, {
          approvalStatus: data.approvalStatus,
          verified: data.verified,
          available: data.available,
          category: data.category,
          description: data.description,
          tags: data.tags,
        })
      : await api.updateProfile(id, profilePayload(data));

    if (!res.data) return;
    const profile = res.data.profile;
    setProfiles((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (profile.approvalStatus === "approved") {
        return idx >= 0 ? prev.map((p) => (p.id === id ? profile : p)) : [...prev, profile];
      }
      return prev.filter((p) => p.id !== id);
    });
    if (myProfile?.id === id) setMyProfile(profile);
  }, [currentUser?.role, myProfile?.id]);

  const deleteProfile = useCallback(async (id: string) => {
    await api.admin.deleteProfile(id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (myProfile?.id === id) setMyProfile(null);
  }, [myProfile?.id]);

  const getProfileByUserId = useCallback(
    (userId: string) => {
      if (currentUser?.id === userId && myProfile) return myProfile;
      return profiles.find((p) => p.userId === userId);
    },
    [currentUser?.id, myProfile, profiles],
  );

  const getProfileById = useCallback(
    (id: string) => {
      if (myProfile?.id === id) return myProfile;
      return profiles.find((p) => p.id === id);
    },
    [myProfile, profiles],
  );

  const listingPayload = (data: Partial<Listing>) => ({
    title: data.title,
    category: data.category,
    subCategory: data.subCategory,
    description: data.description,
    price: data.price,
    city: data.city,
    area: data.area,
    district: data.district,
    photos: data.photos,
    type: data.type,
    deliveryAvailable: data.deliveryAvailable,
    pickupAvailable: data.pickupAvailable,
    whatsappNumber: data.whatsappNumber,
    active: data.active,
  });

  const addListing = useCallback(async (data: Omit<Listing, "id" | "createdAt">) => {
    const res = await api.createListing(listingPayload(data));
    if (!res.data) return null;
    const listing = res.data.listing;
    setMyListings((prev) => [listing, ...prev]);
    if (listing.approvalStatus === "approved") {
      setListings((prev) => [listing, ...prev]);
    }
    return listing;
  }, []);

  const updateListing = useCallback(async (id: string, data: Partial<Listing>) => {
    const isAdmin = currentUser?.role === "admin";
    const res = isAdmin && data.approvalStatus !== undefined
      ? await api.admin.updateListing(id, { approvalStatus: data.approvalStatus, active: data.active })
      : await api.updateListing(id, listingPayload(data));

    if (!res.data) return;
    const listing = res.data.listing;
    setMyListings((prev) => prev.map((l) => (l.id === id ? listing : l)));
    setListings((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (listing.approvalStatus === "approved" && listing.active) {
        return idx >= 0 ? prev.map((l) => (l.id === id ? listing : l)) : [...prev, listing];
      }
      return prev.filter((l) => l.id !== id);
    });
  }, [currentUser?.role]);

  const deleteListing = useCallback(async (id: string) => {
    const isAdmin = currentUser?.role === "admin";
    if (isAdmin) {
      await api.admin.deleteListing(id);
    } else {
      await api.deleteListing(id);
    }
    setMyListings((prev) => prev.filter((l) => l.id !== id));
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, [currentUser?.role]);

  const getListingsByUserId = useCallback(
    (userId: string) => (currentUser?.id === userId ? myListings : listings.filter((l) => l.userId === userId)),
    [currentUser?.id, myListings, listings],
  );

  const jobPayload = (data: Partial<Job>) => ({
    posterName: data.posterName,
    listingType: data.listingType,
    title: data.title,
    category: data.category,
    city: data.city,
    area: data.area,
    district: data.district,
    description: data.description,
    salary: data.salary,
    employmentType: data.employmentType,
    experience: data.experience,
    contact: data.contact,
    whatsappNumber: data.whatsappNumber,
    resumeRequired: data.resumeRequired,
    active: data.active,
  });

  const addJob = useCallback(async (data: Omit<Job, "id" | "createdAt">) => {
    const res = await api.createJob(jobPayload(data));
    if (!res.data) return null;
    const job = res.data.job;
    setMyJobs((prev) => [job, ...prev]);
    if (job.approvalStatus === "approved") {
      setJobs((prev) => [job, ...prev]);
    }
    return job;
  }, []);

  const updateJob = useCallback(async (id: string, data: Partial<Job>) => {
    const isAdmin = currentUser?.role === "admin";
    const res = isAdmin && data.approvalStatus !== undefined
      ? await api.admin.updateJob(id, { approvalStatus: data.approvalStatus, active: data.active })
      : await api.updateJob(id, jobPayload(data));

    if (!res.data) return;
    const job = res.data.job;
    setMyJobs((prev) => prev.map((j) => (j.id === id ? job : j)));
    setJobs((prev) => {
      const idx = prev.findIndex((j) => j.id === id);
      if (job.approvalStatus === "approved" && job.active) {
        return idx >= 0 ? prev.map((j) => (j.id === id ? job : j)) : [...prev, job];
      }
      return prev.filter((j) => j.id !== id);
    });
  }, [currentUser?.role]);

  const deleteJob = useCallback(async (id: string) => {
    const isAdmin = currentUser?.role === "admin";
    if (isAdmin) {
      await api.admin.deleteJob(id);
    } else {
      await api.deleteJob(id);
    }
    setMyJobs((prev) => prev.filter((j) => j.id !== id));
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, [currentUser?.role]);

  const getJobsByUserId = useCallback(
    (userId: string) => (currentUser?.id === userId ? myJobs : jobs.filter((j) => j.userId === userId)),
    [currentUser?.id, myJobs, jobs],
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        loading,
        users,
        profiles,
        listings,
        jobs,
        myProfile,
        myListings,
        myJobs,
        login,
        logout,
        register,
        refreshData,
        updateUser,
        deleteUser,
        createProfile,
        updateProfile,
        deleteProfile,
        getProfileByUserId,
        getProfileById,
        addListing,
        updateListing,
        deleteListing,
        getListingsByUserId,
        addJob,
        updateJob,
        deleteJob,
        getJobsByUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function useCurrentUser() {
  return useApp().currentUser;
}
