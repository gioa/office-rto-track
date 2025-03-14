
/**
 * LocalStorage operations for user entries
 */
import { UserEntry } from "@/lib/types";
import { STORAGE_KEYS, getStorageItem, setStorageItem } from "./config";
import { initializeStorage } from "./initialize";

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
