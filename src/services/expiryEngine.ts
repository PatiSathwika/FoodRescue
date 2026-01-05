
import { StorageCondition, UrgencyLevel, ExpiryExplanation } from '../types';
import { STORAGE_FACTORS, FOOD_BASE_EXPIRY } from '../constants';

export const predictExpiry = (
  foodType: string,
  storage: StorageCondition,
  prepDate: string
) => {
  const baseHours = FOOD_BASE_EXPIRY[foodType as keyof typeof FOOD_BASE_EXPIRY] || 12;
  const storageMultiplier = STORAGE_FACTORS[storage] || 1.0;
  
  // Hours since preparation
  const prepTime = new Date(prepDate).getTime();
  const now = Date.now();
  const elapsedHours = (now - prepTime) / (1000 * 60 * 60);
  
  const totalLifeHours = baseHours * storageMultiplier;
  const remainingHours = Math.max(0, totalLifeHours - elapsedHours);
  
  let urgency = UrgencyLevel.LOW;
  if (remainingHours < 4) urgency = UrgencyLevel.HIGH;
  else if (remainingHours < 12) urgency = UrgencyLevel.MEDIUM;

  const explanations: ExpiryExplanation[] = [
    {
      factor: 'Food Type Sensitivity',
      impact: `Base shelf life for ${foodType} is ${baseHours} hours.`,
      score: baseHours
    },
    {
      factor: 'Storage Optimization',
      impact: `${storage} storage increases shelf life by ${storageMultiplier}x.`,
      score: storageMultiplier
    },
    {
      factor: 'Freshness Decay',
      impact: `${elapsedHours.toFixed(1)} hours have passed since preparation.`,
      score: -elapsedHours
    }
  ];

  return {
    remainingHours: Number(remainingHours.toFixed(1)),
    urgency,
    explanations
  };
};
