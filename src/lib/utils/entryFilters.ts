
import { Entry, FilterOptions } from '../types';

// Count entries by type (with special handling for office visits that include events)
export const countEntriesByType = (entries: Entry[], type: Entry['type']): number => {
  if (type === 'office-visit') {
    // Count both office visits and events
    return entries.filter(entry => entry.type === 'office-visit' || entry.type === 'event').length;
  }
  return entries.filter(entry => entry.type === type).length;
};

// Count entries in date range
export const countEntriesInDateRange = (
  entries: Entry[], 
  from: Date | undefined, 
  to: Date | undefined, 
  type?: Entry['type']
): number => {
  if (!from || !to) return 0;
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    // Special handling for office visits to include events
    const matchesType = type 
      ? (type === 'office-visit' 
         ? (entry.type === 'office-visit' || entry.type === 'event') 
         : entry.type === type)
      : true;
    return matchesType && entryDate >= from && entryDate <= to;
  }).length;
};

// Get entries for a specific date
export const getEntriesForDate = (entries: Entry[], date: Date): Entry[] => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === targetDate.getTime();
  });
};

// Filter entries by various criteria
export const getFilteredEntries = (
  entries: Entry[],
  filters: {
    dateRange?: { from?: Date, to?: Date },
    includeSick?: boolean,
    includePto?: boolean,
    includeEvents?: boolean,
    includeHolidays?: boolean
  }
): Entry[] => {
  // Create a defensive copy of entries to avoid mutation
  return [...entries].filter(entry => {
    // Date range filter
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const entryDate = new Date(entry.date);
      const fromDate = new Date(filters.dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      
      if (entryDate < fromDate || entryDate > toDate) {
        return false;
      }
    }
    
    // Type filters
    if (entry.type === 'sick' && filters.includeSick === false) return false;
    if (entry.type === 'pto' && filters.includePto === false) return false;
    if (entry.type === 'event' && filters.includeEvents === false) return false;
    if (entry.type === 'holiday' && filters.includeHolidays === false) return false;
    
    return true;
  });
};
