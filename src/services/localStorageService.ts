
/**
 * LocalStorage Service
 * 
 * This service provides methods for working with localStorage to persist data.
 * In a real app, this would be replaced with API calls to your backend,
 * but this demonstrates how the application can maintain state even on refresh.
 */

import { BadgeEntry, Entry, UserEntry, UserPlannedDays, WeeklyStats } from "@/lib/types";
import { mockEntries } from "@/lib/mockData";
import { generateWeeklyStats } from "@/lib/data/statsGenerator";
import { currentUser } from "@/lib/data/currentUser";

// Storage keys
const STORAGE_KEYS = {
  BADGE_ENTRIES: 'rto-badge-entries',
  USER_ENTRIES: 'rto-user-entries',
  USER_PLANNED_DAYS: 'rto-user-planned-days',
  USER_PROFILE: 'rto-user-profile',
};

// Initialize storage with mock data if empty
const initializeStorage = () => {
  // Check if we've already initialized
  if (localStorage.getItem('rto-storage-initialized')) {
    return;
  }
  
  // Initialize badge entries and user entries from mock data
  const badgeEntries: BadgeEntry[] = [];
  const userEntries: UserEntry[] = [];
  
  mockEntries.forEach(entry => {
    const date = new Date(entry.date);
    const dayOfWeek = date.getDay();
    const email = entry.userId === currentUser.id ? currentUser.email : 'company@example.com';
    
    if (entry.type === 'office-visit') {
      // Create badge entry for office visits
      badgeEntries.push({
        id: entry.id,
        email,
        date,
        dayOfWeek,
        officeLocation: entry.id.includes('sf') ? 'San Francisco' : 
                        entry.id.includes('ny') ? 'New York' : 'Mountain View',
        checkinTime: new Date(date.setHours(9, 0, 0, 0)),
        checkoutTime: new Date(date.setHours(17, 0, 0, 0))
      });
    } else {
      // Create user entry for other types
      userEntries.push({
        id: entry.id,
        email,
        date,
        dayOfWeek,
        type: entry.type,
        note: entry.note
      });
    }
  });
  
  // Initialize some planned days for current user
  const userPlannedDays: UserPlannedDays[] = [{
    id: 'plan-1',
    userId: currentUser.id,
    email: currentUser.email,
    plannedDays: [1, 3, 5], // Monday, Wednesday, Friday
    effectiveFrom: new Date()
  }];
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.BADGE_ENTRIES, JSON.stringify(badgeEntries));
  localStorage.setItem(STORAGE_KEYS.USER_ENTRIES, JSON.stringify(userEntries));
  localStorage.setItem(STORAGE_KEYS.USER_PLANNED_DAYS, JSON.stringify(userPlannedDays));
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(currentUser));
  
  // Mark as initialized
  localStorage.setItem('rto-storage-initialized', 'true');
};

// Helper to safely parse JSON from localStorage
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper to safely stringify and set localStorage
const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

// Badge entries methods
export const getBadgeEntries = (): BadgeEntry[] => {
  initializeStorage();
  return getStorageItem<BadgeEntry[]>(STORAGE_KEYS.BADGE_ENTRIES, []);
};

export const getBadgeEntriesByEmail = (email: string): BadgeEntry[] => {
  const entries = getBadgeEntries();
  return entries.filter(entry => entry.email === email);
};

export const addBadgeEntry = (entry: Omit<BadgeEntry, 'id'>): BadgeEntry => {
  const entries = getBadgeEntries();
  const newEntry = {
    ...entry,
    id: `badge-${Date.now()}`
  };
  entries.push(newEntry);
  setStorageItem(STORAGE_KEYS.BADGE_ENTRIES, entries);
  return newEntry;
};

// User entries methods
export const getUserEntries = (): UserEntry[] => {
  initializeStorage();
  return getStorageItem<UserEntry[]>(STORAGE_KEYS.USER_ENTRIES, []);
};

export const getUserEntriesByEmail = (email: string): UserEntry[] => {
  const entries = getUserEntries();
  return entries.filter(entry => entry.email === email);
};

export const addUserEntry = (entry: Omit<UserEntry, 'id'>): UserEntry => {
  const entries = getUserEntries();
  const newEntry = {
    ...entry,
    id: `user-entry-${Date.now()}`
  };
  entries.push(newEntry);
  setStorageItem(STORAGE_KEYS.USER_ENTRIES, entries);
  return newEntry;
};

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

// Get all entries in Entry format (for compatibility with current components)
export const getAllEntries = (): Entry[] => {
  const badgeEntries = getBadgeEntries();
  const userEntries = getUserEntries();
  
  // Convert badge entries to Entry format
  const officeVisits: Entry[] = badgeEntries.map(badge => ({
    id: badge.id,
    date: new Date(badge.date),
    type: 'office-visit',
    userId: badge.email,
  }));
  
  // Convert user entries to Entry format
  const otherEntries: Entry[] = userEntries.map(entry => ({
    id: entry.id,
    date: new Date(entry.date),
    type: entry.type,
    note: entry.note,
    userId: entry.email,
  }));
  
  return [...officeVisits, ...otherEntries];
};

// Generate weekly stats from localStorage data
export const getWeeklyStats = (): WeeklyStats[] => {
  const entries = getAllEntries();
  return generateWeeklyStats(entries);
};
