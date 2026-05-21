export type UserType = 'worker' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  type: UserType;
  city: string;
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
  name: string;
  category: string;
  city: string;
  area: string;
  description: string;
  photos: string[];
  services: ServiceItem[];
  rating: number;
  reviewCount: number;
  experience: string;
  phone: string;
  verified: boolean;
  available: boolean;
  tags: string[];
  createdAt: string;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  price: string;
  city: string;
  area: string;
  photos: string[];
  type: 'service' | 'product';
  active: boolean;
  createdAt: string;
}

export const GUJARAT_CITIES = ['Surat', 'Ahmedabad', 'Vadodara', 'Navsari'];
export const EXPANDING_CITIES = ['Rajkot', 'Gandhinagar', 'Bhavnagar'];
export const ALL_CITIES = [...GUJARAT_CITIES, ...EXPANDING_CITIES];

export const SERVICE_CATEGORIES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Tailor / Dress Maker',
  'Beautician',
  'Mehendi Artist',
  'Home Chef / Tiffin Service',
  'Baker / Confectioner',
  'Home Tutor',
  'AC / Refrigerator Repair',
  'Mobile / Electronics Repair',
  'Interior Designer',
  'Event Planner',
  'Photographer / Videographer',
  'Yoga / Fitness Trainer',
  'Cleaning Service',
  'Pest Control',
  'Vehicle Driver',
  'Security Guard',
  'Gardener',
  'Catering Service',
  'Massage Therapist',
  'Computer Trainer',
  'Astrologer / Vastu Consultant',
];
