
import { WeeklyStats } from "@/lib/types";
import { format, startOfWeek, endOfWeek } from "date-fns";

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

export const transformWeeklyStats = (data: WeeklyStats[]): EnhancedWeeklyStats[] => {
  return data.map(week => {
    // Use the provided data directly without refiltering from mockEntries
    // This ensures filtered data is correctly represented
    
    const weekStart = startOfWeek(new Date(week.weekOf), { weekStartsOn: 0 });
    
    // Calculate how many days we still need to reach the 3-day target
    const remainingNeeded = Math.max(0, 3 - week.daysInOffice);
    
    // Use the sickDays, ptoDays, etc. that are already in the weekly stats
    // These values are now generated correctly based on filtered entries
    const sickDays = week.sickDays || 0;
    const ptoDays = week.ptoDays || 0;
    const eventDays = week.eventDays || 0;
    const holidayDays = week.holidayDays || 0;
    
    let displaySickDays = 0;
    let displayPtoDays = 0;
    let displayEventDays = 0;
    let displayHolidayDays = 0;
    
    let remaining = remainingNeeded;
    
    // Only include sick/pto/event/holiday days if we haven't reached 3 days yet
    if (remaining > 0) {
      displaySickDays = Math.min(remaining, sickDays);
      remaining -= displaySickDays;
    }
    
    if (remaining > 0) {
      displayPtoDays = Math.min(remaining, ptoDays);
      remaining -= displayPtoDays;
    }
    
    if (remaining > 0) {
      displayEventDays = Math.min(remaining, eventDays);
      remaining -= displayEventDays;
    }
    
    if (remaining > 0) {
      displayHolidayDays = Math.min(remaining, holidayDays);
    }
    
    // Calculate compliance percentage - counting all types toward the target
    const totalCountedDays = Math.min(3, week.daysInOffice + displaySickDays + displayPtoDays + displayEventDays + displayHolidayDays);
    const compliancePercentage = Math.min(100, Math.round((totalCountedDays / 3) * 100));
    
    return {
      ...week,
      weekLabel: format(new Date(week.weekOf), 'MMM d'),
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
