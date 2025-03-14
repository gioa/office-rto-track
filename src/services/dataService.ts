
import { BadgeEntry, UserEntry, UserPlannedDays, Entry, User, PlannedDay } from "@/lib/types";
import { mockEntries } from "@/lib/mockData";
import { currentUser } from "@/lib/data/currentUser";

// In-memory storage for demo purposes
// In a real app, this would be replaced with API calls to your backend
const badgeEntries: BadgeEntry[] = [];
const userEntries: UserEntry[] = [];
const userPlannedDays: UserPlannedDays[] = [];

// Convert existing mock entries to our new data model format
const initializeFromMockData = () => {
  // Only initialize once
  if (badgeEntries.length > 0 || userEntries.length > 0) return;
  
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
  userPlannedDays.push({
    id: 'plan-1',
    userId: currentUser.id,
    email: currentUser.email,
    plannedDays: [1, 3, 5], // Monday, Wednesday, Friday
    effectiveFrom: new Date()
  });
}

// Badge entries API
export const getBadgeEntries = (): BadgeEntry[] => {
  initializeFromMockData();
  return badgeEntries;
};

export const getBadgeEntriesByEmail = (email: string): BadgeEntry[] => {
  initializeFromMockData();
  return badgeEntries.filter(entry => entry.email === email);
};

export const addBadgeEntry = (entry: Omit<BadgeEntry, 'id'>): BadgeEntry => {
  const newEntry = {
    ...entry,
    id: `badge-${Date.now()}`
  };
  badgeEntries.push(newEntry);
  return newEntry;
};

// User entries API
export const getUserEntries = (): UserEntry[] => {
  initializeFromMockData();
  return userEntries;
};

export const getUserEntriesByEmail = (email: string): UserEntry[] => {
  initializeFromMockData();
  return userEntries.filter(entry => entry.email === email);
};

export const addUserEntry = (entry: Omit<UserEntry, 'id'>): UserEntry => {
  const newEntry = {
    ...entry,
    id: `user-entry-${Date.now()}`
  };
  userEntries.push(newEntry);
  return newEntry;
};

// User planned days API
export const getUserPlannedDays = (): UserPlannedDays[] => {
  initializeFromMockData();
  return userPlannedDays;
};

export const getUserPlannedDaysByUserId = (userId: string): UserPlannedDays | undefined => {
  initializeFromMockData();
  return userPlannedDays.find(plan => plan.userId === userId);
};

export const getUserPlannedDaysByEmail = (email: string): UserPlannedDays | undefined => {
  initializeFromMockData();
  return userPlannedDays.find(plan => plan.email === email);
};

export const saveUserPlannedDays = (
  userId: string, 
  email: string, 
  plannedDays: number[],
  effectiveFrom?: Date,
  effectiveTo?: Date
): UserPlannedDays => {
  initializeFromMockData();
  
  // Look for existing plan to update
  const existingPlanIndex = userPlannedDays.findIndex(plan => plan.userId === userId);
  
  if (existingPlanIndex >= 0) {
    // Update existing plan
    userPlannedDays[existingPlanIndex] = {
      ...userPlannedDays[existingPlanIndex],
      plannedDays,
      effectiveFrom,
      effectiveTo
    };
    return userPlannedDays[existingPlanIndex];
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
    userPlannedDays.push(newPlan);
    return newPlan;
  }
};

// Utility to convert from our data model to PlannedDay[] for UI components
export const convertToPlannedDays = (plans: UserPlannedDays[]): PlannedDay[] => {
  const result: PlannedDay[] = [];
  
  plans.forEach(plan => {
    plan.plannedDays.forEach(weekday => {
      result.push({
        userId: plan.userId,
        userName: plan.email.split('@')[0], // Simple name extraction from email
        weekday,
        department: 'General' // Default department
      });
    });
  });
  
  return result;
};
