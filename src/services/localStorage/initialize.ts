
/**
 * Storage initialization with mock data if empty
 */
import { BadgeEntry, UserEntry, UserPlannedDays } from "@/lib/types";
import { mockEntries } from "@/lib/mockData";
import { currentUser } from "@/lib/data/currentUser";
import { STORAGE_KEYS, STORAGE_INITIALIZED_KEY, setStorageItem, getStorageItem } from "./config";

// Initialize storage with mock data if empty
export const initializeStorage = (): void => {
  // Check if we've already initialized
  if (localStorage.getItem(STORAGE_INITIALIZED_KEY)) {
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
  setStorageItem(STORAGE_KEYS.BADGE_ENTRIES, badgeEntries);
  setStorageItem(STORAGE_KEYS.USER_ENTRIES, userEntries);
  setStorageItem(STORAGE_KEYS.USER_PLANNED_DAYS, userPlannedDays);
  setStorageItem(STORAGE_KEYS.USER_PROFILE, currentUser);
  
  // Mark as initialized
  localStorage.setItem(STORAGE_INITIALIZED_KEY, 'true');
};
