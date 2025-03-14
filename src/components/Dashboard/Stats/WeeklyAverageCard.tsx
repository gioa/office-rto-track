
import { Activity } from "lucide-react";
import StatsCard from "./StatsCard";
import { Entry, DateRange } from "@/lib/types";
import { useEffect, useState } from "react";

interface WeeklyAverageCardProps {
  entries: Entry[];
  dateRange: DateRange;
}

const WeeklyAverageCard = ({ entries, dateRange }: WeeklyAverageCardProps) => {
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  useEffect(() => {
    // Calculate weekly average (if date range is set)
    let average = 0;
    if (dateRange.from && dateRange.to) {
      const workdays = countWorkdays(dateRange.from, dateRange.to);
      const weeks = Math.max(1, Math.round(workdays / 5));
      
      // Count office visits and events in the date range
      const officeVisitsInRange = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (entry.type === 'office-visit' || entry.type === 'event') && 
               entryDate >= dateRange.from && 
               entryDate <= dateRange.to;
      }).length;
      
      average = Math.round((officeVisitsInRange / weeks) * 10) / 10;
    }
    
    setWeeklyAverage(average);
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

// Helper function to count workdays in a date range (excluding weekends)
const countWorkdays = (start: Date, end: Date): number => {
  let count = 0;
  const curDate = new Date(start.getTime());
  
  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  
  return count;
};

export default WeeklyAverageCard;
