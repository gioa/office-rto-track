
import { WeeklyStats } from "@/lib/types";
import { format, isThisWeek, startOfWeek, endOfWeek, isSameDay, isBefore, isAfter, addWeeks, subWeeks } from "date-fns";

export interface EnhancedWeeklyStats extends WeeklyStats {
  weekLabel: string;
  sickDays: number;
  ptoDays: number;
  eventDays: number;
  holidayDays: number;
  displaySickDays: number;
  displayPtoDays: number;
  displayEventDays: number;
  displayHolidayDays: number;
  compliancePercentage: number;
}

export const transformWeeklyStats = (data: WeeklyStats[], dateRange?: { from?: Date, to?: Date }): EnhancedWeeklyStats[] => {
  // If we have a date range, filter stats to only include weeks within the range
  let filteredData = data;
  
  if (dateRange?.from || dateRange?.to) {
    filteredData = data.filter(week => {
      const weekDate = new Date(week.weekOf);
      const weekStart = startOfWeek(weekDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(weekDate, { weekStartsOn: 0 });
      
      // Check if week overlaps with date range
      if (dateRange.from && dateRange.to) {
        return (
          (isSameDay(weekStart, dateRange.from) || isAfter(weekStart, dateRange.from)) &&
          (isSameDay(weekEnd, dateRange.to) || isBefore(weekEnd, dateRange.to))
        );
      } else if (dateRange.from) {
        return isSameDay(weekStart, dateRange.from) || isAfter(weekStart, dateRange.from);
      } else if (dateRange.to) {
        return isSameDay(weekEnd, dateRange.to) || isBefore(weekEnd, dateRange.to);
      }
      
      return true;
    });
  }
  
  return filteredData.map(week => {
    // Check if this is the current week
    const isCurrentWeek = isThisWeek(new Date(week.weekOf));
    
    const weekStart = startOfWeek(new Date(week.weekOf), { weekStartsOn: 0 });
    
    // Make sure we use the count directly from the stats
    // Note: daysInOffice already correctly includes event days
    const sickDays = week.sickDays || 0;
    const ptoDays = week.ptoDays || 0;
    const eventDays = week.eventDays || 0;
    const holidayDays = week.holidayDays || 0;
    
    // Calculate how many days we still need to reach the 3-day target
    const remainingNeeded = Math.max(0, 3 - week.daysInOffice);
    
    // For display, we'll count sick, PTO, event, and holiday towards the remaining target days
    let displaySickDays = 0;
    let displayPtoDays = 0;
    let displayEventDays = 0;
    let displayHolidayDays = 0;
    
    let remaining = remainingNeeded;
    
    // Since events are already counted in daysInOffice, we don't need to count them again
    // First count sick days towards the target
    if (remaining > 0) {
      displaySickDays = Math.min(remaining, sickDays);
      remaining -= displaySickDays;
    }
    
    // Then count PTO days towards the target
    if (remaining > 0) {
      displayPtoDays = Math.min(remaining, ptoDays);
      remaining -= displayPtoDays;
    }
    
    // Then count holiday days towards the target
    if (remaining > 0) {
      displayHolidayDays = Math.min(remaining, holidayDays);
      remaining -= displayHolidayDays;
    }
    
    // Also count event days if needed (though normally these are already in daysInOffice)
    if (remaining > 0) {
      displayEventDays = Math.min(remaining, eventDays);
      remaining -= displayEventDays;
    }
    
    // Calculate compliance percentage - counting all types toward the target
    const totalCountedDays = Math.min(3, week.daysInOffice + displaySickDays + displayPtoDays + displayHolidayDays + displayEventDays);
    const compliancePercentage = Math.min(100, Math.round((totalCountedDays / 3) * 100));
    
    // Add "Current" label for current week
    const weekLabel = isCurrentWeek 
      ? "Current" 
      : format(new Date(week.weekOf), 'MMM d');
    
    return {
      ...week,
      weekLabel,
      sickDays,
      ptoDays,
      eventDays,
      holidayDays,
      displaySickDays,
      displayPtoDays,
      displayEventDays,
      displayHolidayDays,
      compliancePercentage
    };
  });
};
