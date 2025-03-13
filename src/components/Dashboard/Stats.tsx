
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Entry } from "@/lib/types";
import { countEntriesByType, countEntriesInDateRange } from "@/lib/mockData";

interface StatsProps {
  entries: Entry[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

// Top office locations for the mock data
const officeLocations = [
  { name: "SF", count: 12 },
  { name: "NYC", count: 9 },
  { name: "MTV", count: 6 }
];

const Stats = ({ entries, dateRange }: StatsProps) => {
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
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up animation-delay-100">
      <Card className="glass subtle-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Top Offices</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
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
      
      <Card className="glass subtle-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyAverage}</div>
          <p className="text-xs text-muted-foreground">days in office per week</p>
        </CardContent>
      </Card>
      
      <Card className="glass subtle-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{complianceRate}%</div>
          <p className="text-xs text-muted-foreground">of required office days</p>
        </CardContent>
      </Card>
      
      <Card className="glass subtle-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Time Off</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSickDays + totalPTO}</div>
          <p className="text-xs text-muted-foreground">
            {totalSickDays} sick, {totalPTO} PTO days
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
