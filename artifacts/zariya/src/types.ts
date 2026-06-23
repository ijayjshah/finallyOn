export type UserType = 'user' | 'service_provider' | 'business_owner';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  whatsappNumber: string;
  type: UserType;
  serviceCategory?: string;
  city: string;
  district: string;
  role?: 'user' | 'admin';
  onboardingCompleted?: boolean;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface ServiceProfile {
  id: string;
  userId: string;
  slug: string;
  name: string;
  category: string;
  profileType: 'service' | 'business';
  city: string;
  area: string;
  district: string;
  description: string;
  photos: string[];
  services: ServiceItem[];
  rating: number;
  reviewCount: number;
  experience: string;
  phone: string;
  whatsappNumber: string;
  mapUrl: string;
  verified: boolean;
  available: boolean;
  tags: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  resumeUrl?: string;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  createdAt: string;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  price: string;
  city: string;
  area: string;
  district: string;
  photos: string[];
  type: 'service' | 'product';
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  whatsappNumber: string;
  active: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Job {
  id: string;
  userId: string;
  posterName: string;
  listingType: 'opening' | 'seeker';
  title: string;
  category: string;
  city: string;
  area: string;
  district: string;
  description: string;
  salary: string;
  employmentType: string;
  experience: string;
  contact: string;
  whatsappNumber: string;
  resumeRequired?: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  active: boolean;
  createdAt: string;
}

export const DISTRICTS = ['Navsari'];
export const COMING_SOON_DISTRICTS = ['Surat', 'Valsad', 'Vapi'];
export const ALL_DISTRICTS = [...DISTRICTS, ...COMING_SOON_DISTRICTS];

export const NAVSARI_AREAS = [
  'Navsari City', 'Jalalpore', 'Gandevi', 'Chikhli', 'Vansda',
  'Bilimora', 'Vijalpore', 'Dungri', 'Mahuva', 'Vejalpore',
  'Sanja', 'Khergam', 'Aat', 'Bapod', 'Variav',
];

export const GUJARAT_CITIES = ['Navsari', 'Surat', 'Ahmedabad', 'Vadodara'];
export const EXPANDING_CITIES = ['Rajkot', 'Gandhinagar', 'Bhavnagar'];
export const ALL_CITIES = [...GUJARAT_CITIES, ...EXPANDING_CITIES];

export const EMPLOYMENT_TYPES = [
  'Full-time', 'Part-time', 'Contract', 'Daily Wage', 'Seasonal',
];

export const SERVICE_PROVIDER_CATEGORIES = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter',
  'Tailor / Dress Maker', 'Beautician', 'Mehendi Artist',
  'Home Chef / Tiffin Service', 'Baker / Confectioner',
  'Home Tutor', 'AC / Refrigerator Repair', 'Mobile / Electronics Repair',
  'Interior Designer', 'Event Planner', 'Photographer / Videographer',
  'Yoga / Fitness Trainer', 'Cleaning Service', 'Pest Control',
  'Vehicle Driver', 'Security Guard', 'Gardener', 'Catering Service',
  'Massage Therapist', 'Computer Trainer', 'Astrologer / Vastu Consultant',
];

export const BUSINESS_CATEGORIES = [
  'Grocery / Kirana', 'Pharmacy', 'Hardware Store', 'Furniture Shop',
  'Jewellery Shop', 'Clothing & Garments', 'Electronics Store',
  'Restaurant / Dhaba', 'Bakery / Sweet Shop', 'Stationery Shop',
  'Book Store', 'Mobile Shop', 'Salon / Parlour', 'Gym / Fitness Centre',
  'Medical Clinic', 'Coaching Institute', 'General Store',
  'Automobile Parts', 'Textiles / Fabric Shop', 'Toys & Games Store',
];

export const SERVICE_CATEGORIES = [...SERVICE_PROVIDER_CATEGORIES, ...BUSINESS_CATEGORIES];

export const PRODUCT_MAX = 25;

export const BRAND = {
  name: 'FinallyOn',
  tagline: 'Finally, local businesses online. Properly.',
  district: 'Navsari',
  email: 'hellofinallyon@gmail.com',
  support: 'hellofinallyon@gmail.com',
  website: 'finallyon.in',
  digitalSupport: 'attachtotech.xyz',
} as const;
