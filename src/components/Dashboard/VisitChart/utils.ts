
import { WeeklyStats } from "@/lib/types";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { mockEntries } from "@/lib/mockData";

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
    const weekStart = startOfWeek(new Date(week.weekOf), { weekStartsOn: 0 });
    const weekEnd = endOfWeek(new Date(week.weekOf), { weekStartsOn: 0 });
    
    let sickDays = 0;
    let ptoDays = 0;
    let eventDays = 0;
    let holidayDays = 0;
    
    mockEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate >= weekStart && entryDate <= weekEnd) {
        const day = entryDate.getDay();
        if (day === 0 || day === 6) return;
        
        switch (entry.type) {
          case 'sick':
            sickDays++;
            break;
          case 'pto':
            ptoDays++;
            break;
          case 'event':
            eventDays++;
            break;
          case 'holiday':
            holidayDays++;
            break;
        }
      }
    });
    
    // Calculate how many days we still need to reach the 3-day target
    const remainingNeeded = Math.max(0, 3 - week.daysInOffice);
    
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
    
    // Calculate compliance percentage - now counting all types toward the target
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
