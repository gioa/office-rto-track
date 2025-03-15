
import { ShieldCheck } from "lucide-react";
import StatsCard from "./StatsCard";
import { Entry, DateRange } from "@/lib/types";
import { useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek, isSameWeek, addWeeks } from "date-fns";

interface ComplianceRateCardProps {
  entries: Entry[];
  dateRange: DateRange;
}

const ComplianceRateCard = ({ entries, dateRange }: ComplianceRateCardProps) => {
  const [complianceRate, setComplianceRate] = useState(0);
  const [complianceText, setComplianceText] = useState("of required office days");

  useEffect(() => {
    // Calculate compliance based on weeks meeting the requirement
    if (dateRange.from && dateRange.to) {
      const weeks = getWeeksInRange(dateRange.from, dateRange.to);
      const totalWeeks = weeks.length;
      
      if (totalWeeks === 0) {
        setComplianceRate(0);
        setComplianceText("of required office days");
        return;
      }
      
      // Count compliant weeks (weeks with at least 3 days)
      let compliantWeeks = 0;
      
      weeks.forEach(week => {
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
        
        // Total for this week
        const totalDays = badgeEntries + additionalDaysUsed;
        
        // Week is compliant if total days >= 3
        if (totalDays >= 3) {
          compliantWeeks++;
        }
      });
      
      // Calculate compliance percentage
      const compliance = Math.round((compliantWeeks / totalWeeks) * 100);
      setComplianceRate(compliance);
      setComplianceText(`(${compliantWeeks}/${totalWeeks} weeks)`);
    } else {
      setComplianceRate(0);
      setComplianceText("of required office days");
    }
  }, [entries, dateRange]);

  return (
    <StatsCard
      title="Compliance Rate"
      value={`${complianceRate}%`}
      description={complianceText}
      icon={ShieldCheck}
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

export default ComplianceRateCard;
