
/**
 * Combined entries operations (badges + user entries)
 */
import { Entry } from "@/lib/types";
import { getBadgeEntries } from "./badgeEntries";
import { getUserEntries } from "./userEntries";
import { generateWeeklyStats } from "@/lib/data/statsGenerator";
import { currentUser } from "@/lib/data/currentUser";

// Get all entries in Entry format (for compatibility with current components)
export const getAllEntries = (): Entry[] => {
  const badgeEntries = getBadgeEntries();
  const userEntries = getUserEntries();
  
  // Convert badge entries to Entry format
  const officeVisits: Entry[] = badgeEntries.map(badge => ({
    id: badge.id,
    date: new Date(badge.date),
    type: 'office-visit',
    userId: badge.email === currentUser.email ? currentUser.id : badge.email,
  }));
  
  // Convert user entries to Entry format
  const otherEntries: Entry[] = userEntries.map(entry => ({
    id: entry.id,
    date: new Date(entry.date),
    type: entry.type,
    note: entry.note,
    userId: entry.email === currentUser.email ? currentUser.id : entry.email,
  }));
  
  return [...officeVisits, ...otherEntries];
};

// Generate weekly stats from localStorage data
export const getWeeklyStats = (): ReturnType<typeof generateWeeklyStats> => {
  const entries = getAllEntries();
  return generateWeeklyStats(entries);
};
