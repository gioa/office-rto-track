
import { Activity } from "lucide-react";
import StatsCard from "./StatsCard";
import { Entry, DateRange } from "@/lib/types";
import { useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek, isSameWeek, addWeeks } from "date-fns";

interface WeeklyAverageCardProps {
  entries: Entry[];
  dateRange: DateRange;
}

const WeeklyAverageCard = ({ entries, dateRange }: WeeklyAverageCardProps) => {
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  useEffect(() => {
    // Calculate weekly average using the new rules
    if (dateRange.from && dateRange.to) {
      const weeks = getWeeksInRange(dateRange.from, dateRange.to);
      const totalWeeks = weeks.length;
      
      if (totalWeeks === 0) {
        setWeeklyAverage(0);
        return;
      }
      
      // Calculate entries per week
      const weeklyTotals = weeks.map(week => {
        // Filter entries within this week
        const weekEntries = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return isSameWeek(entryDate, week.start);
        });
        
        // Count badge entries (non-temp badges)
        const badgeEntries = weekEntries.filter(entry => 
          entry.type === 'office-visit' && !entry.isTempBadge
        ).length;
        
        // Count how many additional days we need
        const additionalDaysNeeded = Math.max(0, 3 - badgeEntries);
        
        // Count other entry types that can be used to meet the requirement
        const altEntries = weekEntries.filter(entry => 
          (entry.type === 'office-visit' && entry.isTempBadge) || // temp badges
          entry.type === 'sick' || 
          entry.type === 'pto' || 
          entry.type === 'event' || 
          entry.type === 'holiday'
        );
        
        // Use additional days up to what's needed
        const additionalDaysUsed = Math.min(additionalDaysNeeded, altEntries.length);
        
        // Total for this week (capped at 3)
        return Math.min(3, badgeEntries + additionalDaysUsed);
      });
      
      // Calculate average
      const totalDays = weeklyTotals.reduce((sum, days) => sum + days, 0);
      const average = totalDays / totalWeeks;
      
      setWeeklyAverage(Math.round(average * 10) / 10); // Round to 1 decimal place
    } else {
      setWeeklyAverage(0);
    }
  }, [entries, dateRange]);

  return (
    <StatsCard
      title="Weekly Average"
      value={weeklyAverage}
      description="days in office per week"
      icon={Activity}
    />
  );
};

// Helper function to get all weeks in a date range
const getWeeksInRange = (start: Date, end: Date): { start: Date, end: Date }[] => {
  const weeks: { start: Date, end: Date }[] = [];
  let currentWeekStart = startOfWeek(start, { weekStartsOn: 0 });
  
  while (currentWeekStart <= end) {
    const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });
    weeks.push({
      start: currentWeekStart,
      end: currentWeekEnd > end ? end : currentWeekEnd
    });
    
    // Move to next week
    currentWeekStart = addWeeks(currentWeekStart, 1);
  }
  
  return weeks;
};

export default WeeklyAverageCard;
