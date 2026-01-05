
export enum UserRole {
  PROVIDER = 'PROVIDER',
  NGO = 'NGO',
  ADMIN = 'ADMIN'
}

export enum StorageCondition {
  ROOM_TEMP = 'Room Temp',
  REFRIGERATED = 'Refrigerated',
  FROZEN = 'Frozen'
}

export enum UrgencyLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface ExpiryExplanation {
  factor: string;
  impact: string;
  score: number;
}
export interface Location {
  lat: number;
  lng: number;
  address: string;
}
export interface FoodDonation {
  id: string;
  providerId: string;
  providerName: string;
  type: string;
  quantity: number;
  prepDate: string;
  storage: StorageCondition;
  location: Location
  expiryHours: number;
  urgency: UrgencyLevel;
  explanation: ExpiryExplanation[];
  status: 'available' | 'claimed' | 'picked_up' | 'expired'| 'accepted';
  claimedBy?: string;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  points: number;
  mealsSaved: number;
  donationsCount: number;
  badges: string[];
  isApproved: boolean;
  type?: string; // e.g., Restaurant, Hotel
}

export enum BadgeType {
  DONATION_STAR = 'Donation Star',
  QUICK_ACTION = 'Quick Action',
  HUNGER_HERO = 'Hunger Hero',
  CONSISTENCY_KING = 'Consistency King'
}
