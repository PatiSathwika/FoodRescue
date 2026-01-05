
import { UrgencyLevel } from './types';

export const LEVELS = [
  { name: '🌱 Food Supporter', min: 0, max: 99, color: 'text-emerald-500' },
  { name: '🥗 Food Saver', min: 100, max: 299, color: 'text-sky-500' },
  { name: '🏅 Hunger Hero', min: 300, max: 699, color: 'text-indigo-500' },
  { name: '🥇 Zero Hunger Champion', min: 700, max: Infinity, color: 'text-amber-500' },
];

export const FOOD_TYPES = [
  'Cooked Meal',
  'Bakery Items',
  'Fruits & Vegetables',
  'Dairy Products',
  'Canned Goods',
  'Meats & Poultry'
];

export const URGENCY_COLORS = {
  HIGH: 'bg-red-950 text-red-400 border border-red-800',
  MEDIUM: 'bg-amber-950 text-amber-400 border border-amber-800',
  LOW: 'bg-emerald-950 text-emerald-400 border border-emerald-800'
};


export const STORAGE_FACTORS = {
  'Room Temp': 1.0,
  'Refrigerated': 4.0,
  'Frozen': 10.0,
};

export const FOOD_BASE_EXPIRY = {
  'Cooked Meal': 6,
  'Bakery Items': 24,
  'Fruits & Vegetables': 48,
  'Dairy Products': 12,
  'Canned Goods': 720,
  'Meats & Poultry': 4
};
