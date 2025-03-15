
import { DateRange, Entry } from "@/lib/types";
import TopOfficesCard from "./TopOfficesCard";
import WeeklyAverageCard from "./WeeklyAverageCard";
import ComplianceRateCard from "./ComplianceRateCard";
import TimeOffCard from "./TimeOffCard";
import { currentUser } from "@/lib/data/currentUser";

interface StatsProps {
  entries: Entry[];
  dateRange: DateRange;
}

const Stats = ({ entries, dateRange }: StatsProps) => {
  // Filter entries to only show the current user's entries
  const userEntries = entries.filter(entry => 
    entry.userId === currentUser.id || entry.userId === currentUser.email
  );
  
  // Filter out weekend entries for consistency across all stats calculations
  const weekdayEntries = userEntries.filter(entry => {
    const day = new Date(entry.date).getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up animation-delay-100">
      <WeeklyAverageCard entries={weekdayEntries} dateRange={dateRange} />
      <ComplianceRateCard entries={weekdayEntries} dateRange={dateRange} />
      <TimeOffCard entries={weekdayEntries} />
      <TopOfficesCard />
    </div>
  );
};

export default Stats;
