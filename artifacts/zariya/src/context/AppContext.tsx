import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, ServiceProfile, Listing, ServiceItem } from "@/types";

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
    city: "Surat",
    area: "Athwa Lines",
    description: "Licensed electrician with 14 years of experience in Surat. Specialise in residential wiring, panel upgrades, and emergency repairs. Available 7 days a week.",
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
    verified: true,
    available: true,
    tags: ["Wiring", "Panel Repair", "Emergency", "Residential"],
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "prof_002",
    userId: "demo2_user",
    name: "Priya Shah",
    category: "Beautician",
    city: "Ahmedabad",
    area: "Navrangpura",
    description: "Professional beautician and makeup artist based in Navrangpura. Trained from Mumbai. Bridal packages available. Home visits on request.",
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
    verified: true,
    available: true,
    tags: ["Bridal", "Makeup", "Facials", "Hair"],
    createdAt: "2025-01-12T10:00:00Z",
  },
  {
    id: "prof_003",
    userId: "demo3_user",
    name: "Mohammed Shaikh",
    category: "Plumber",
    city: "Vadodara",
    area: "Alkapuri",
    description: "Experienced plumber serving Vadodara for over 10 years. Pipe fitting, bathroom installation, water tank work, and drainage solutions.",
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
    verified: true,
    available: true,
    tags: ["Pipe Fitting", "Bathroom", "Drainage", "Tank"],
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "prof_004",
    userId: "demo4_user",
    name: "Kavita Ben Desai",
    category: "Home Chef / Tiffin Service",
    city: "Navsari",
    area: "Lunsikui",
    description: "Pure Gujarati home-cooked tiffin service in Navsari. Fresh vegetables, no maida, traditional recipes. Daily, weekly, and monthly subscriptions.",
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
    verified: true,
    available: true,
    tags: ["Gujarati Food", "Tiffin", "Home Cooked", "Pure Veg"],
    createdAt: "2025-01-18T10:00:00Z",
  },
  {
    id: "prof_005",
    userId: "demo5_user",
    name: "Jayesh Desai",
    category: "Home Tutor",
    city: "Surat",
    area: "Vesu",
    description: "B.Tech graduate offering home tuition for Maths, Science, and Computer Science. Classes 6–12 and JEE/NEET foundation. Batch and individual sessions.",
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
    verified: true,
    available: true,
    tags: ["Maths", "Science", "JEE", "NEET", "Computer"],
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "prof_006",
    userId: "demo6_user",
    name: "Hina Trivedi",
    category: "Mehendi Artist",
    city: "Ahmedabad",
    area: "Bopal",
    description: "Professional mehendi artist specialising in bridal, Arabic, and Indo-fusion designs. 9 years of experience. Home visits available across Ahmedabad.",
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
    verified: true,
    available: true,
    tags: ["Bridal", "Arabic", "Rajasthani", "Festive"],
    createdAt: "2025-01-22T10:00:00Z",
  },
];

const SEED_USERS: User[] = [
  {
    id: "demo_seed_user",
    name: "Demo User",
    email: "demo@foundwork.in",
    password: "demo123",
    phone: "+91 99999 00000",
    type: "customer",
    city: "Surat",
    createdAt: "2025-01-01T00:00:00Z",
  },
];

interface AppContextType {
  currentUser: User | null;
  users: User[];
  profiles: ServiceProfile[];
  listings: Listing[];
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
    // localStorage quota exceeded — ignore for prototype
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

  useEffect(() => { save("fw_users", users); }, [users]);
  useEffect(() => { save("fw_profiles", profiles); }, [profiles]);
  useEffect(() => { save("fw_listings", listings); }, [listings]);

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

  return (
    <AppContext.Provider value={{
      currentUser, users, profiles, listings,
      login, logout, register,
      createProfile, updateProfile, getProfileByUserId, getProfileById,
      addListing, updateListing, deleteListing, getListingsByUserId,
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
