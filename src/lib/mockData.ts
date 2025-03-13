
import { Entry, User, WeeklyStats } from './types';

// Current user mock
export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  department: 'Engineering',
  isAdmin: false,
};

// Function to generate random entries for the last 3 months
export const generateMockEntries = (): Entry[] => {
  const entries: Entry[] = [];
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  // Loop through each day in the date range
  for (let d = new Date(threeMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    if (isWeekend) continue; // Skip weekends

    const dayOfWeek = d.getDay();
    const random = Math.random();

    // Create office visits - higher probability on Tues, Wed, Thurs
    if ((dayOfWeek >= 2 && dayOfWeek <= 4 && random > 0.2) || (random > 0.7)) {
      entries.push({
        id: `office-${d.toISOString()}`,
        date: new Date(d),
        type: 'office-visit',
        userId: currentUser.id,
      });
    } 
    // Occasionally add sick days
    else if (random < 0.05) {
      entries.push({
        id: `sick-${d.toISOString()}`,
        date: new Date(d),
        type: 'sick',
        note: 'Not feeling well',
        userId: currentUser.id,
      });
    } 
    // Occasionally add PTO
    else if (random >= 0.05 && random < 0.1) {
      entries.push({
        id: `pto-${d.toISOString()}`,
        date: new Date(d),
        type: 'pto',
        note: 'Personal time off',
        userId: currentUser.id,
      });
    }
  }

  // Add some company events
  const eventDates = [
    new Date(today.getFullYear(), today.getMonth() - 2, 15),
    new Date(today.getFullYear(), today.getMonth() - 1, 5),
    new Date(today.getFullYear(), today.getMonth(), 10),
  ];

  eventDates.forEach((date, index) => {
    if (date.getDay() !== 0 && date.getDay() !== 6) { // Not on weekends
      entries.push({
        id: `event-${index}`,
        date,
        type: 'event',
        note: 'Company All-Hands Meeting',
        userId: 'company',
      });
    }
  });

  // Add some holidays
  const holidays = [
    { date: new Date(today.getFullYear(), 0, 1), name: 'New Year\'s Day' },
    { date: new Date(today.getFullYear(), 4, 29), name: 'Memorial Day' },
    { date: new Date(today.getFullYear(), 6, 4), name: 'Independence Day' },
    { date: new Date(today.getFullYear(), 8, 5), name: 'Labor Day' },
    { date: new Date(today.getFullYear(), 10, 28), name: 'Thanksgiving Day' },
    { date: new Date(today.getFullYear(), 11, 25), name: 'Christmas Day' },
  ];

  holidays.forEach((holiday, index) => {
    if (holiday.date >= threeMonthsAgo && holiday.date <= today) {
      // Skip adding holidays on weekends
      const day = holiday.date.getDay();
      if (day !== 0 && day !== 6) {
        entries.push({
          id: `holiday-${index}`,
          date: holiday.date,
          type: 'holiday',
          note: holiday.name,
          userId: 'company',
        });
      }
    }
  });

  return entries;
};

// Generate weekly statistics for the dashboard
export const generateWeeklyStats = (entries: Entry[]): WeeklyStats[] => {
  const stats: WeeklyStats[] = [];
  const today = new Date();
  
  // Generate stats for the last 10 weeks
  for (let i = 0; i < 10; i++) {
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - (today.getDay() + 7 * i));
    
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);
    
    // Count days in office for this week
    const daysInOffice = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.type === 'office-visit' && 
             entryDate >= weekStart && 
             entryDate <= weekEnd;
    }).length;
    
    // Calculate working days (excluding weekends)
    let totalWorkDays = 0;
    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) totalWorkDays++;
    }
    
    stats.push({
      weekOf: weekStart,
      daysInOffice,
      totalWorkDays,
      percentage: totalWorkDays > 0 ? (daysInOffice / totalWorkDays) * 100 : 0
    });
  }
  
  return stats.reverse(); // Most recent week first
};

// Export mock data
export const mockEntries = generateMockEntries();
export const mockWeeklyStats = generateWeeklyStats(mockEntries);

// Helper functions
export const countEntriesByType = (entries: Entry[], type: Entry['type']): number => {
  return entries.filter(entry => entry.type === type).length;
};

export const countEntriesInDateRange = (
  entries: Entry[], 
  from: Date | undefined, 
  to: Date | undefined, 
  type?: Entry['type']
): number => {
  if (!from || !to) return 0;
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const matchesType = type ? entry.type === type : true;
    return matchesType && entryDate >= from && entryDate <= to;
  }).length;
};

export const getEntriesForDate = (entries: Entry[], date: Date): Entry[] => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === targetDate.getTime();
  });
};

export const getFilteredEntries = (
  entries: Entry[],
  filters: {
    dateRange?: { from?: Date, to?: Date },
    includeSick?: boolean,
    includePto?: boolean,
    includeEvents?: boolean
  }
): Entry[] => {
  return entries.filter(entry => {
    // Date range filter
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const entryDate = new Date(entry.date);
      if (entryDate < filters.dateRange.from || entryDate > filters.dateRange.to) {
        return false;
      }
    }
    
    // Type filters
    if (entry.type === 'sick' && filters.includeSick === false) return false;
    if (entry.type === 'pto' && filters.includePto === false) return false;
    if (entry.type === 'event' && filters.includeEvents === false) return false;
    
    return true;
  });
};
