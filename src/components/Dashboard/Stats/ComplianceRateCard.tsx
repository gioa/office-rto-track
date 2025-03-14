
import { ShieldCheck } from "lucide-react";
import StatsCard from "./StatsCard";
import { Entry, DateRange } from "@/lib/types";
import { useEffect, useState } from "react";

interface ComplianceRateCardProps {
  entries: Entry[];
  dateRange: DateRange;
}

const ComplianceRateCard = ({ entries, dateRange }: ComplianceRateCardProps) => {
  const [complianceRate, setComplianceRate] = useState(0);

  useEffect(() => {
    // Calculate compliance
    let compliance = 0;
    if (dateRange.from && dateRange.to) {
      // Count both office visits and events toward compliance
      const officeVisitsInRange = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (entry.type === 'office-visit' || entry.type === 'event') && 
               entryDate >= dateRange.from && 
               entryDate <= dateRange.to;
      }).length;
      
      const workdays = countWorkdays(dateRange.from, dateRange.to);
      const weeks = Math.max(1, Math.round(workdays / 5));
      const requiredDays = weeks * 3; // 3 days per week policy
      compliance = Math.min(100, Math.round((officeVisitsInRange / requiredDays) * 100));
    }
    
    setComplianceRate(compliance);
  }, [entries, dateRange]);

  return (
    <StatsCard
      title="Compliance Rate"
      value={`${complianceRate}%`}
      description="of required office days"
      icon={ShieldCheck}
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

export default ComplianceRateCard;
