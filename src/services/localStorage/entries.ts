
/**
 * Combined entries operations (badges + user entries)
 */
import { Entry } from "@/lib/types";
import { getBadgeEntries } from "./badgeEntries";
import { getUserEntries } from "./userEntries";
import { generateWeeklyStats } from "@/lib/data/statsGenerator";
import { currentUser } from "@/lib/data/currentUser";

// Get all entries in Entry format (for compatibility with current components)
export const getAllEntries = async (): Promise<Entry[]> => {
  const badgeEntries = await getBadgeEntries();
  const userEntries = await getUserEntries();
  
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
  
  // Combine all entries, but filter out weekend entries for consistency
  const allEntries = [...officeVisits, ...otherEntries].filter(entry => {
    const dayOfWeek = entry.date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Remove weekend entries (0=Sunday, 6=Saturday)
  });
  
  return allEntries;
};

// Generate weekly stats from Supabase data
export const getWeeklyStats = async (): Promise<ReturnType<typeof generateWeeklyStats>> => {
  const entries = await getAllEntries();
  return generateWeeklyStats(entries);
};
