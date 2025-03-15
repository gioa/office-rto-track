
/**
 * Combined entries operations (badges + user entries)
 */
import { Entry } from "@/lib/types";
import { getBadgeEntries } from "./badgeEntries";
import { getUserEntries } from "./userEntries";
import { generateWeeklyStats } from "@/lib/data/statsGenerator";
import { currentUser } from "@/lib/data/currentUser";
import { deleteUserEntry } from "./userEntries";

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
    officeLocation: badge.officeLocation || 'Unknown', // Include the office location
    isTempBadge: false // Badge entries are not temp badges
  }));
  
  // Convert user entries to Entry format
  const otherEntries: Entry[] = userEntries.map(entry => ({
    id: entry.id,
    date: new Date(entry.date),
    type: entry.type,
    note: entry.note,
    userId: entry.email === currentUser.email ? currentUser.id : entry.email,
    isTempBadge: entry.type === 'office-visit' ? (entry.isTempBadge || false) : undefined
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

// Delete an entry based on its ID
// This function determines if it's a user entry and deletes it if possible
export const deleteEntry = async (entryId: string): Promise<void> => {
  // Currently, we only support deleting user entries (PTO, sick days, etc.)
  // Office visit entries (badge entries) cannot be deleted
  try {
    // We're assuming the ID format allows us to determine it's a user entry
    // In a real system, we would use more sophisticated ID detection or separate endpoints
    await deleteUserEntry(entryId);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
