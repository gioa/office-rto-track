
/**
 * LocalStorage operations for planned days
 */
import { UserPlannedDays } from "@/lib/types";
import { STORAGE_KEYS, getStorageItem, setStorageItem } from "./config";
import { initializeStorage } from "./initialize";

// User planned days methods
export const getUserPlannedDays = (): UserPlannedDays[] => {
  initializeStorage();
  return getStorageItem<UserPlannedDays[]>(STORAGE_KEYS.USER_PLANNED_DAYS, []);
};

export const getUserPlannedDaysByUserId = (userId: string): UserPlannedDays | undefined => {
  const plans = getUserPlannedDays();
  return plans.find(plan => plan.userId === userId);
};

export const getUserPlannedDaysByEmail = (email: string): UserPlannedDays | undefined => {
  const plans = getUserPlannedDays();
  return plans.find(plan => plan.email === email);
};

export const saveUserPlannedDays = (
  userId: string, 
  email: string, 
  plannedDays: number[],
  effectiveFrom?: Date,
  effectiveTo?: Date
): UserPlannedDays => {
  const plans = getUserPlannedDays();
  
  // Look for existing plan to update
  const existingPlanIndex = plans.findIndex(plan => plan.userId === userId);
  
  if (existingPlanIndex >= 0) {
    // Update existing plan
    plans[existingPlanIndex] = {
      ...plans[existingPlanIndex],
      plannedDays,
      effectiveFrom,
      effectiveTo
    };
    setStorageItem(STORAGE_KEYS.USER_PLANNED_DAYS, plans);
    return plans[existingPlanIndex];
  } else {
    // Create new plan
    const newPlan: UserPlannedDays = {
      id: `plan-${Date.now()}`,
      userId,
      email,
      plannedDays,
      effectiveFrom,
      effectiveTo
    };
    plans.push(newPlan);
    setStorageItem(STORAGE_KEYS.USER_PLANNED_DAYS, plans);
    return newPlan;
  }
};
