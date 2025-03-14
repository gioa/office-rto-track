
/**
 * Configuration for localStorage service
 */

// Storage keys used throughout the application
export const STORAGE_KEYS = {
  BADGE_ENTRIES: 'rto-badge-entries',
  USER_ENTRIES: 'rto-user-entries',
  USER_PLANNED_DAYS: 'rto-user-planned-days',
  USER_PROFILE: 'rto-user-profile',
};

// Helper to safely parse JSON from localStorage
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper to safely stringify and set localStorage
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

// Flag to track if storage has been initialized
export const STORAGE_INITIALIZED_KEY = 'rto-storage-initialized';
