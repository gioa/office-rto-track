
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Entry, DateRange } from "@/lib/types";
import { countEntriesByType, countEntriesInDateRange } from "@/lib/utils/entryFilters";
import { Activity, ShieldCheck, Calendar, Building } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StatsProps {
  entries: Entry[];
  dateRange: DateRange;
}

interface OfficeLocation {
  name: string;
  count: number;
}

const Stats = ({ entries, dateRange }: StatsProps) => {
  const [stats, setStats] = useState({
    totalOfficeVisits: 0,
    totalSickDays: 0,
    totalPTO: 0,
    weeklyAverage: 0,
    complianceRate: 0
  });
  
  const [topOffices, setTopOffices] = useState<OfficeLocation[]>([]);
  
  // Calculate top office locations from badge entries
  useEffect(() => {
    const fetchTopOffices = async () => {
      try {
        // Get all badge entries from Supabase - excluding weekends
        const { data, error } = await supabase
          .from('badge_entries')
          .select('office_location')
          .not('office_location', 'is', null)
          .filter('day_of_week', 'neq', 0)  // Exclude Sunday
          .filter('day_of_week', 'neq', 6);  // Exclude Saturday
        
        if (error) throw error;
        
        // Create a map to count occurrences of each office
        const officeMap = new Map<string, number>();
        
        // Process results
        if (data && Array.isArray(data)) {
          data.forEach(entry => {
            if (entry.office_location) {
              const location = entry.office_location;
              officeMap.set(location, (officeMap.get(location) || 0) + 1);
            }
          });
        }
        
        // Convert map to array and sort by count
        const sortedOffices = Array.from(officeMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);  // Get top 3
        
        setTopOffices(sortedOffices.length > 0 ? sortedOffices : [
          { name: "No Data", count: 0 } 
        ]);
      } catch (error) {
        console.error("Error fetching top offices:", error);
        setTopOffices([{ name: "Error", count: 0 }]);
      }
    };
    
    fetchTopOffices();
  }, []);
  
  // Recalculate stats when entries or dateRange changes
  useEffect(() => {
    // Filter out weekend entries first
    const weekdayEntries = entries.filter(entry => {
      const day = new Date(entry.date).getDay();
      return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
    });
    
    // Calculate metrics - count events as office visits for stats
    const officeVisits = weekdayEntries.filter(entry => entry.type === 'office-visit').length;
    const eventDays = weekdayEntries.filter(entry => entry.type === 'event').length;
    const totalOfficeVisits = officeVisits + eventDays;
    
    const totalSickDays = countEntriesByType(weekdayEntries, 'sick');
    const totalPTO = countEntriesByType(weekdayEntries, 'pto');
    
    // Calculate weekly average (if date range is set)
    let weeklyAverage = 0;
    if (dateRange.from && dateRange.to) {
      const workdays = countWorkdays(dateRange.from, dateRange.to);
      const weeks = Math.max(1, Math.round(workdays / 5));
      
      // Count office visits and events in the date range
      const officeVisitsInRange = weekdayEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (entry.type === 'office-visit' || entry.type === 'event') && 
               entryDate >= dateRange.from && 
               entryDate <= dateRange.to;
      }).length;
      
      weeklyAverage = Math.round((officeVisitsInRange / weeks) * 10) / 10;
    }
    
    // Calculate compliance
    let complianceRate = 0;
    if (dateRange.from && dateRange.to) {
      // Count both office visits and events toward compliance
      const officeVisitsInRange = weekdayEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (entry.type === 'office-visit' || entry.type === 'event') && 
               entryDate >= dateRange.from && 
               entryDate <= dateRange.to;
      }).length;
      
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
          <div className="text-2xl font-bold">{topOffices[0]?.name || "N/A"}</div>
          <p className="text-xs text-muted-foreground">
            {topOffices.map((office, index) => (
              <span key={office.name}>
                {office.name}: {office.count}{index < topOffices.length - 1 ? ', ' : ''}
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
