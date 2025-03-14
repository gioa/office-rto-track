
import { Entry, WeeklyStats } from '../types';

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
    
    // Count sick days for this week
    const sickDays = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.type === 'sick' && 
             entryDate >= weekStart && 
             entryDate <= weekEnd;
    }).length;
    
    // Count PTO days for this week
    const ptoDays = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.type === 'pto' && 
             entryDate >= weekStart && 
             entryDate <= weekEnd;
    }).length;
    
    // Count event days for this week
    const eventDays = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.type === 'event' && 
             entryDate >= weekStart && 
             entryDate <= weekEnd;
    }).length;
    
    // Count holiday days for this week
    const holidayDays = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.type === 'holiday' && 
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
      percentage: totalWorkDays > 0 ? (daysInOffice / totalWorkDays) * 100 : 0,
      sickDays,
      ptoDays,
      eventDays,
      holidayDays
    });
  }
  
  return stats.reverse(); // Most recent week first
};
