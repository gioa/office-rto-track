import { Entry, WeeklyStats } from '../types';
import { startOfWeek, endOfWeek, addWeeks, format, isSameDay } from 'date-fns';

// Generate weekly statistics for the dashboard
export const generateWeeklyStats = (entries: Entry[], weekStartDates?: Date[]): WeeklyStats[] => {
  const stats: WeeklyStats[] = [];
  const today = new Date();
  
  // If no week start dates provided, generate stats for the last 10 weeks
  if (!weekStartDates || weekStartDates.length === 0) {
    weekStartDates = [];
    // Generate stats for the last 10 weeks including current week
    for (let i = 0; i < 10; i++) {
      const weekEnd = new Date(today);
      // If we're on the first iteration (i=0), use today as the end of the week
      // Otherwise, set to the end of the previous weeks
      if (i > 0) {
        weekEnd.setDate(today.getDate() - (today.getDay() + 7 * (i - 1)));
      }
      
      const weekStart = startOfWeek(weekEnd, { weekStartsOn: 0 });
      weekStartDates.unshift(weekStart); // Add to beginning so most recent is last
    }
  }
  
  // Process each week
  for (const weekStart of weekStartDates) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
    
    // Count days in office for this week (including events as office visits)
    const daysInOffice = entries.filter(entry => {
      const entryDate = entry.date;
      const dayOfWeek = entryDate.getDay(); // 0 = Sunday, 6 = Saturday
      
      return (entry.type === 'office-visit' || entry.type === 'event') && 
             (isSameDay(entryDate, weekStart) || isSameDay(entryDate, weekEnd) || 
              (entryDate >= weekStart && entryDate <= weekEnd)) &&
             dayOfWeek !== 0 && dayOfWeek !== 6; // Ensure no weekends
    }).length;
    
    // Count sick days for this week
    const sickDays = entries.filter(entry => {
      const entryDate = entry.date;
      const dayOfWeek = entryDate.getDay();
      
      return entry.type === 'sick' && 
             (isSameDay(entryDate, weekStart) || isSameDay(entryDate, weekEnd) || 
              (entryDate >= weekStart && entryDate <= weekEnd)) &&
             dayOfWeek !== 0 && dayOfWeek !== 6;
    }).length;
    
    // Count PTO days for this week
    const ptoDays = entries.filter(entry => {
      const entryDate = entry.date;
      const dayOfWeek = entryDate.getDay();
      
      return entry.type === 'pto' && 
             (isSameDay(entryDate, weekStart) || isSameDay(entryDate, weekEnd) || 
              (entryDate >= weekStart && entryDate <= weekEnd)) &&
             dayOfWeek !== 0 && dayOfWeek !== 6;
    }).length;
    
    // Count event days for this week (still track separately for stats display)
    const eventDays = entries.filter(entry => {
      const entryDate = entry.date;
      const dayOfWeek = entryDate.getDay();
      
      return entry.type === 'event' && 
             (isSameDay(entryDate, weekStart) || isSameDay(entryDate, weekEnd) || 
              (entryDate >= weekStart && entryDate <= weekEnd)) &&
             dayOfWeek !== 0 && dayOfWeek !== 6;
    }).length;
    
    // Count holiday days for this week
    const holidayDays = entries.filter(entry => {
      const entryDate = entry.date;
      const dayOfWeek = entryDate.getDay();
      
      return entry.type === 'holiday' && 
             (isSameDay(entryDate, weekStart) || isSameDay(entryDate, weekEnd) || 
              (entryDate >= weekStart && entryDate <= weekEnd)) &&
             dayOfWeek !== 0 && dayOfWeek !== 6;
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
      percentage: totalWorkDays > 0 ? (daysInOffice / totalWorkDays) * 100 : 0,
      sickDays,
      ptoDays,
      eventDays,
      holidayDays
    });
  }
  
  return stats;
};
