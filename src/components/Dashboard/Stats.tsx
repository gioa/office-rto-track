
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Entry, DateRange } from "@/lib/types";
import { countEntriesByType, countEntriesInDateRange } from "@/lib/utils/entryFilters";
import { Activity, ShieldCheck, Calendar, Building } from "lucide-react";
import { useEffect, useState } from "react";

interface StatsProps {
  entries: Entry[];
  dateRange: DateRange;
}

// Top office locations for the mock data
const officeLocations = [
  { name: "SF", count: 12 },
  { name: "NYC", count: 9 },
  { name: "MTV", count: 6 }
];

const Stats = ({ entries, dateRange }: StatsProps) => {
  const [stats, setStats] = useState({
    totalOfficeVisits: 0,
    totalSickDays: 0,
    totalPTO: 0,
    weeklyAverage: 0,
    complianceRate: 0
  });

  // Recalculate stats when entries or dateRange changes
  useEffect(() => {
    // Calculate metrics
    const totalOfficeVisits = countEntriesByType(entries, 'office-visit');
    const totalSickDays = countEntriesByType(entries, 'sick');
    const totalPTO = countEntriesByType(entries, 'pto');
    
    // Calculate weekly average (if date range is set)
    let weeklyAverage = 0;
    if (dateRange.from && dateRange.to) {
      const daysDiff = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      const weeks = Math.max(1, Math.round(daysDiff / 7));
      const officeVisitsInRange = countEntriesInDateRange(entries, dateRange.from, dateRange.to, 'office-visit');
      weeklyAverage = Math.round((officeVisitsInRange / weeks) * 10) / 10;
    }
    
    // Calculate compliance
    let complianceRate = 0;
    if (dateRange.from && dateRange.to) {
      const officeVisitsInRange = countEntriesInDateRange(entries, dateRange.from, dateRange.to, 'office-visit');
      const workdays = countWorkdays(dateRange.from, dateRange.to);
      const weeks = Math.max(1, Math.round(workdays / 5));
      const requiredDays = weeks * 3; // 3 days per week policy
      complianceRate = Math.min(100, Math.round((officeVisitsInRange / requiredDays) * 100));
    }

    setStats({
      totalOfficeVisits,
      totalSickDays,
      totalPTO,
      weeklyAverage,
      complianceRate
    });
  }, [entries, dateRange]);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up animation-delay-100">
      <Card className="glass subtle-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weeklyAverage}</div>
          <p className="text-xs text-muted-foreground">days in office per week</p>
        </CardContent>
      </Card>
      
      <Card className="glass subtle-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.complianceRate}%</div>
          <p className="text-xs text-muted-foreground">of required office days</p>
        </CardContent>
      </Card>
      
      <Card className="glass subtle-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Time Off</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSickDays + stats.totalPTO}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalSickDays} sick, {stats.totalPTO} PTO days
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass subtle-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Top Offices</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{officeLocations[0].name}</div>
          <p className="text-xs text-muted-foreground">
            {officeLocations.map((office, index) => (
              <span key={office.name}>
                {office.name}: {office.count}{index < officeLocations.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </CardContent>
      </Card>
    </div>
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

export default Stats;
