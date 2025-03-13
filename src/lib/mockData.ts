
import { Entry, User, WeeklyStats } from './types';
import { currentUser } from './data/currentUser';
import { generateMockEntries } from './data/entriesGenerator';
import { generateWeeklyStats } from './data/statsGenerator';
import { 
  countEntriesByType, 
  countEntriesInDateRange, 
  getEntriesForDate, 
  getFilteredEntries 
} from './utils/entryFilters';

// Export mock data
export const mockEntries = generateMockEntries();
export const mockWeeklyStats = generateWeeklyStats(mockEntries);

// Re-export everything for backward compatibility
export {
  currentUser,
  generateMockEntries,
  generateWeeklyStats,
  countEntriesByType,
  countEntriesInDateRange,
  getEntriesForDate,
  getFilteredEntries
};
