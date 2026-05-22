import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, ServiceProfile, Listing, Job } from "@/types";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function seedPhoto(color: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="${color}"/><text x="150" y="105" font-family="sans-serif" font-size="13" fill="rgba(255,255,255,0.85)" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const DEMO_PROFILES: ServiceProfile[] = [
  {
    id: "prof_001",
    userId: "demo_user",
    name: "Ramesh Patel",
    category: "Electrician",
    city: "Navsari",
    area: "Navsari City",
    district: "Navsari",
    description: "Licensed electrician with 14 years of experience serving Navsari district. Specialise in residential wiring, panel upgrades, and emergency repairs. Available 7 days a week. Google Maps verified location.",
    photos: [
      seedPhoto("#4f46e5", "Electrical Panel Work"),
      seedPhoto("#6366f1", "Wiring Installation"),
      seedPhoto("#818cf8", "Emergency Repair"),
    ],
    services: [
      { id: uid(), name: "Home Wiring (per room)", price: "₹500–₹800", description: "Complete wiring with branded materials" },
      { id: uid(), name: "Fan/Light Installation", price: "₹150/unit", description: "Ceiling fans, lights, switches" },
      { id: uid(), name: "Emergency Repair", price: "₹200 call charge", description: "Available nights and weekends" },
    ],
    rating: 4.8,
    reviewCount: 156,
    experience: "14 years",
    phone: "+91 98765 43210",
    whatsappNumber: "919876543210",
    mapUrl: "https://maps.google.com/?q=Navsari+City",
    verified: true,
    available: true,
    tags: ["Wiring", "Panel Repair", "Emergency", "Residential"],
    approvalStatus: "approved",
    deliveryAvailable: false,
    pickupAvailable: true,
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "prof_002",
    userId: "demo2_user",
    name: "Priya Shah",
    category: "Beautician",
    city: "Navsari",
    area: "Jalalpore",
    district: "Navsari",
    description: "Professional beautician and makeup artist in Jalalpore, Navsari. Trained from Mumbai. Bridal packages available. Home visits on request across Navsari district.",
    photos: [
      seedPhoto("#db2777", "Bridal Makeup"),
      seedPhoto("#ec4899", "Facial Treatment"),
      seedPhoto("#f472b6", "Mehendi Design"),
      seedPhoto("#fb7185", "Hair Styling"),
    ],
    services: [
      { id: uid(), name: "Bridal Makeup Package", price: "₹8,000–₹15,000", description: "Full bridal with trial session" },
      { id: uid(), name: "Facial & Cleanup", price: "₹500–₹1,200", description: "Various skin types catered" },
      { id: uid(), name: "Hair Styling", price: "₹300–₹800", description: "Blow dry, setting, party styles" },
    ],
    rating: 4.9,
    reviewCount: 203,
    experience: "8 years",
    phone: "+91 98765 43211",
    whatsappNumber: "919876543211",
    mapUrl: "https://maps.google.com/?q=Jalalpore+Navsari",
    verified: true,
    available: true,
    tags: ["Bridal", "Makeup", "Facials", "Hair"],
    approvalStatus: "approved",
    createdAt: "2025-01-12T10:00:00Z",
  },
  {
    id: "prof_003",
    userId: "demo3_user",
    name: "Mohammed Shaikh",
    category: "Plumber",
    city: "Navsari",
    area: "Bilimora",
    district: "Navsari",
    description: "Experienced plumber serving Bilimora and nearby Navsari towns for over 10 years. Pipe fitting, bathroom installation, water tank work, and drainage solutions.",
    photos: [
      seedPhoto("#0891b2", "Bathroom Fitting"),
      seedPhoto("#06b6d4", "Pipe Work"),
    ],
    services: [
      { id: uid(), name: "Pipe Fitting & Repair", price: "₹300–₹600", description: "All pipe materials supported" },
      { id: uid(), name: "Bathroom Installation", price: "₹2,500–₹8,000", description: "Full bathroom fitting" },
      { id: uid(), name: "Water Tank Cleaning", price: "₹800–₹1,500", description: "Overhead and underground tanks" },
    ],
    rating: 4.7,
    reviewCount: 89,
    experience: "10 years",
    phone: "+91 98765 43212",
    whatsappNumber: "919876543212",
    mapUrl: "https://maps.google.com/?q=Bilimora+Navsari",
    verified: true,
    available: true,
    tags: ["Pipe Fitting", "Bathroom", "Drainage", "Tank"],
    approvalStatus: "approved",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "prof_004",
    userId: "demo4_user",
    name: "Kavita Ben Desai",
    category: "Home Chef / Tiffin Service",
    city: "Navsari",
    area: "Gandevi",
    district: "Navsari",
    description: "Pure Gujarati home-cooked tiffin service in Gandevi, Navsari. Fresh vegetables, no maida, traditional recipes. Daily, weekly, and monthly subscriptions. Home delivery available.",
    photos: [
      seedPhoto("#16a34a", "Gujarati Thali"),
      seedPhoto("#22c55e", "Fresh Sabji"),
      seedPhoto("#4ade80", "Dal Dhokli"),
      seedPhoto("#86efac", "Rotli & Rice"),
      seedPhoto("#bbf7d0", "Seasonal Menu"),
    ],
    services: [
      { id: uid(), name: "Daily Tiffin (Lunch)", price: "₹80/meal", description: "2 rotli, sabji, dal, rice, salad" },
      { id: uid(), name: "Monthly Subscription", price: "₹1,800/month", description: "Lunch + dinner, 26 days" },
      { id: uid(), name: "Weekend Special Thali", price: "₹150/thali", description: "7 items + dessert" },
    ],
    rating: 5.0,
    reviewCount: 74,
    experience: "5 years",
    phone: "+91 98765 43213",
    whatsappNumber: "919876543213",
    mapUrl: "https://maps.google.com/?q=Gandevi+Navsari",
    verified: true,
    available: true,
    tags: ["Gujarati Food", "Tiffin", "Home Cooked", "Pure Veg"],
    approvalStatus: "approved",
    deliveryAvailable: true,
    pickupAvailable: true,
    createdAt: "2025-01-18T10:00:00Z",
  },
  {
    id: "prof_005",
    userId: "demo5_user",
    name: "Jayesh Desai",
    category: "Home Tutor",
    city: "Navsari",
    area: "Chikhli",
    district: "Navsari",
    description: "B.Tech graduate offering home tuition in Chikhli, Navsari for Maths, Science, and Computer Science. Classes 6–12 and JEE/NEET foundation. Batch and individual sessions available.",
    photos: [
      seedPhoto("#7c3aed", "Teaching Session"),
      seedPhoto("#8b5cf6", "Science Lab Help"),
      seedPhoto("#a78bfa", "JEE Preparation"),
    ],
    services: [
      { id: uid(), name: "Individual Tuition (per hour)", price: "₹300/hr", description: "Maths or Science" },
      { id: uid(), name: "Batch Classes (5 students)", price: "₹150/hr per student", description: "Small group sessions" },
      { id: uid(), name: "JEE Foundation (monthly)", price: "₹2,500/month", description: "Class 9–11 JEE prep" },
    ],
    rating: 4.8,
    reviewCount: 112,
    experience: "6 years",
    phone: "+91 98765 43214",
    whatsappNumber: "919876543214",
    mapUrl: "https://maps.google.com/?q=Chikhli+Navsari",
    verified: true,
    available: true,
    tags: ["Maths", "Science", "JEE", "NEET", "Computer"],
    approvalStatus: "approved",
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "prof_006",
    userId: "demo6_user",
    name: "Hina Trivedi",
    category: "Mehendi Artist",
    city: "Navsari",
    area: "Navsari City",
    district: "Navsari",
    description: "Professional mehendi artist specialising in bridal, Arabic, and Indo-fusion designs in Navsari. 9 years of experience. Home visits available across Navsari district.",
    photos: [
      seedPhoto("#b45309", "Bridal Mehendi"),
      seedPhoto("#d97706", "Arabic Style"),
      seedPhoto("#f59e0b", "Rajasthani Pattern"),
      seedPhoto("#fbbf24", "Full Hand Design"),
    ],
    services: [
      { id: uid(), name: "Bridal Full Hands + Feet", price: "₹3,500–₹6,000", description: "Intricate bridal designs" },
      { id: uid(), name: "Arabic Design (both hands)", price: "₹800–₹1,500", description: "Modern Arabic patterns" },
      { id: uid(), name: "Party Mehendi (single hand)", price: "₹400–₹700", description: "Quick festive designs" },
    ],
    rating: 4.9,
    reviewCount: 287,
    experience: "9 years",
    phone: "+91 98765 43215",
    whatsappNumber: "919876543215",
    mapUrl: "https://maps.google.com/?q=Navsari+City",
    verified: true,
    available: true,
    tags: ["Bridal", "Arabic", "Rajasthani", "Festive"],
    approvalStatus: "approved",
    createdAt: "2025-01-22T10:00:00Z",
  },
];

const DEMO_JOBS: Job[] = [
  {
    id: "job_001",
    userId: "biz_001",
    posterName: "Mehta Electricals",
    listingType: "opening",
    title: "Electrician Required – Residential Projects",
    category: "Electrician",
    city: "Navsari",
    area: "Jalalpore",
    district: "Navsari",
    description: "Growing electrical contractor firm in Navsari looking for a skilled electrician for residential projects. Tools provided. Regular work guaranteed.",
    salary: "₹18,000–₹25,000/month",
    employmentType: "Full-time",
    experience: "2+ years",
    contact: "+91 94270 11001",
    whatsappNumber: "919427011001",
    approvalStatus: "approved",
    active: true,
    createdAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "job_002",
    userId: "biz_002",
    posterName: "Radha Beauty Salon",
    listingType: "opening",
    title: "Beautician & Makeup Artist Wanted",
    category: "Beautician",
    city: "Navsari",
    area: "Navsari City",
    district: "Navsari",
    description: "Established beauty salon in Navsari City hiring a full-time beautician. Skills needed: facials, waxing, threading, basic makeup. Friendly team, good earning potential.",
    salary: "₹12,000–₹20,000/month + commission",
    employmentType: "Full-time",
    experience: "1+ years",
    contact: "+91 94270 11002",
    whatsappNumber: "919427011002",
    approvalStatus: "approved",
    active: true,
    createdAt: "2025-02-03T10:00:00Z",
  },
  {
    id: "job_003",
    userId: "biz_003",
    posterName: "Anand Catering Services",
    listingType: "opening",
    title: "Cook / Helper Needed for Catering Events",
    category: "Catering Service",
    city: "Navsari",
    area: "Gandevi",
    district: "Navsari",
    description: "Reputed catering service in Navsari seeks experienced cook and kitchen helpers for weddings and corporate events. Weekend-heavy work. Transport provided.",
    salary: "₹800–₹1,200/day",
    employmentType: "Daily Wage",
    experience: "Any",
    contact: "+91 94270 11003",
    whatsappNumber: "919427011003",
    approvalStatus: "approved",
    active: true,
    createdAt: "2025-02-05T10:00:00Z",
  },
  {
    id: "job_004",
    userId: "biz_004",
    posterName: "Parents Group, Chikhli",
    listingType: "opening",
    title: "Home Tutor Required – Maths & Science",
    category: "Home Tutor",
    city: "Navsari",
    area: "Chikhli",
    district: "Navsari",
    description: "Parents group in Chikhli looking for a qualified tutor for Maths and Science, Classes 8–10. 5 days a week, morning or evening slots.",
    salary: "₹8,000–₹12,000/month",
    employmentType: "Part-time",
    experience: "Graduate preferred",
    contact: "+91 94270 11004",
    whatsappNumber: "919427011004",
    approvalStatus: "approved",
    active: true,
    createdAt: "2025-02-07T10:00:00Z",
  },
  {
    id: "job_005",
    userId: "biz_005",
    posterName: "Arjun Patel",
    listingType: "seeker",
    title: "Experienced Carpenter – Looking for Full-time Work",
    category: "Carpenter",
    city: "Navsari",
    area: "Bilimora",
    district: "Navsari",
    description: "Carpenter with 8 years of experience in furniture making, kitchen fittings, and door/window installation. Looking for full-time work in Navsari district. Tools available.",
    salary: "Expected ₹20,000–₹28,000/month",
    employmentType: "Full-time",
    experience: "8 years",
    contact: "+91 94270 22001",
    whatsappNumber: "919427022001",
    approvalStatus: "approved",
    active: true,
    createdAt: "2025-02-09T10:00:00Z",
  },
  {
    id: "job_006",
    userId: "biz_006",
    posterName: "Sunita Bai",
    listingType: "seeker",
    title: "Cleaning & Housekeeping – Available Daily or Monthly",
    category: "Cleaning Service",
    city: "Navsari",
    area: "Vansda",
    district: "Navsari",
    description: "6 years of experience in home and office cleaning. Available for daily or monthly domestic work in Vansda and nearby Navsari areas. Reliable and trustworthy.",
    salary: "₹6,000–₹9,000/month or ₹300/day",
    employmentType: "Full-time",
    experience: "6 years",
    contact: "+91 94270 22002",
    whatsappNumber: "919427022002",
    approvalStatus: "approved",
    active: true,
    createdAt: "2025-02-11T10:00:00Z",
  },
  {
    id: "job_007",
    userId: "biz_007",
    posterName: "Ravi Sharma",
    listingType: "seeker",
    title: "Security Guard – Seeking Placement in Navsari",
    category: "Security Guard",
    city: "Navsari",
    area: "Navsari City",
    district: "Navsari",
    description: "Ex-Army trained security professional with 5 years of private security experience. Looking for placement with a housing society or commercial property in Navsari.",
    salary: "Expected ₹14,000–₹18,000/month",
    employmentType: "Full-time",
    experience: "5 years",
    contact: "+91 94270 22003",
    whatsappNumber: "919427022003",
    approvalStatus: "approved",
    active: true,
    createdAt: "2025-02-13T10:00:00Z",
  },
];

const SEED_USERS: User[] = [
  {
    id: "demo_seed_user",
    name: "Demo User",
    email: "demo@finallyon.in",
    password: "demo123",
    phone: "+91 99999 00000",
    whatsappNumber: "919999900000",
    type: "customer",
    city: "Navsari",
    district: "Navsari",
    createdAt: "2025-01-01T00:00:00Z",
  },
];

interface AppContextType {
  currentUser: User | null;
  users: User[];
  profiles: ServiceProfile[];
  listings: Listing[];
  jobs: Job[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (data: Omit<User, "id" | "createdAt">) => { success: boolean; error?: string };
  createProfile: (data: Omit<ServiceProfile, "id" | "createdAt">) => ServiceProfile;
  updateProfile: (id: string, data: Partial<ServiceProfile>) => void;
  getProfileByUserId: (userId: string) => ServiceProfile | undefined;
  getProfileById: (id: string) => ServiceProfile | undefined;
  addListing: (data: Omit<Listing, "id" | "createdAt">) => Listing;
  updateListing: (id: string, data: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getListingsByUserId: (userId: string) => Listing[];
  addJob: (data: Omit<Job, "id" | "createdAt">) => Job;
  updateJob: (id: string, data: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJobsByUserId: (userId: string) => Job[];
}

const AppContext = createContext<AppContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const id = localStorage.getItem("fw_current_user_id");
    if (!id) return null;
    const users = load<User[]>("fw_users", []);
    return users.find((u) => u.id === id) ?? null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const stored = load<User[]>("fw_users", []);
    if (stored.length === 0) {
      save("fw_users", SEED_USERS);
      return SEED_USERS;
    }
    return stored;
  });

  const [profiles, setProfiles] = useState<ServiceProfile[]>(() => {
    const stored = load<ServiceProfile[]>("fw_profiles", []);
    if (stored.length === 0) {
      save("fw_profiles", DEMO_PROFILES);
      return DEMO_PROFILES;
    }
    return stored;
  });

  const [listings, setListings] = useState<Listing[]>(() =>
    load<Listing[]>("fw_listings", [])
  );

  const [jobs, setJobs] = useState<Job[]>(() => {
    const stored = load<Job[]>("fw_jobs", []);
    if (stored.length === 0) {
      save("fw_jobs", DEMO_JOBS);
      return DEMO_JOBS;
    }
    return stored;
  });

  useEffect(() => { save("fw_users", users); }, [users]);
  useEffect(() => { save("fw_profiles", profiles); }, [profiles]);
  useEffect(() => { save("fw_listings", listings); }, [listings]);
  useEffect(() => { save("fw_jobs", jobs); }, [jobs]);

  const login = useCallback((email: string, password: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, error: "Incorrect email or password." };
    setCurrentUser(user);
    localStorage.setItem("fw_current_user_id", user.id);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("fw_current_user_id");
  }, []);

  const register = useCallback((data: Omit<User, "id" | "createdAt">) => {
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: User = { ...data, id: uid(), createdAt: new Date().toISOString() };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem("fw_current_user_id", newUser.id);
    return { success: true };
  }, [users]);

  const createProfile = useCallback((data: Omit<ServiceProfile, "id" | "createdAt">) => {
    const profile: ServiceProfile = { ...data, id: uid(), createdAt: new Date().toISOString() };
    setProfiles((prev) => [...prev, profile]);
    return profile;
  }, []);

  const updateProfile = useCallback((id: string, data: Partial<ServiceProfile>) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const getProfileByUserId = useCallback((userId: string) =>
    profiles.find((p) => p.userId === userId), [profiles]);

  const getProfileById = useCallback((id: string) =>
    profiles.find((p) => p.id === id), [profiles]);

  const addListing = useCallback((data: Omit<Listing, "id" | "createdAt">) => {
    const listing: Listing = { ...data, id: uid(), createdAt: new Date().toISOString() };
    setListings((prev) => [...prev, listing]);
    return listing;
  }, []);

  const updateListing = useCallback((id: string, data: Partial<Listing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const getListingsByUserId = useCallback((userId: string) =>
    listings.filter((l) => l.userId === userId), [listings]);

  const addJob = useCallback((data: Omit<Job, "id" | "createdAt">) => {
    const job: Job = { ...data, id: uid(), createdAt: new Date().toISOString() };
    setJobs((prev) => [...prev, job]);
    return job;
  }, []);

  const updateJob = useCallback((id: string, data: Partial<Job>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...data } : j)));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const getJobsByUserId = useCallback((userId: string) =>
    jobs.filter((j) => j.userId === userId), [jobs]);

  return (
    <AppContext.Provider value={{
      currentUser, users, profiles, listings, jobs,
      login, logout, register,
      createProfile, updateProfile, getProfileByUserId, getProfileById,
      addListing, updateListing, deleteListing, getListingsByUserId,
      addJob, updateJob, deleteJob, getJobsByUserId,
    }}>
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
