
/**
 * LocalStorage operations for badge entries
 */
import { BadgeEntry } from "@/lib/types";
import { STORAGE_KEYS, getStorageItem, setStorageItem } from "./config";
import { initializeStorage } from "./initialize";

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
