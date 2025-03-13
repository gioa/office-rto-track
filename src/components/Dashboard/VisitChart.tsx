
import { WeeklyStats } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, TooltipProps, Legend } from "recharts";
import { mockEntries } from "@/lib/mockData";
import { startOfWeek, endOfWeek, isSameDay } from "date-fns";

interface VisitChartProps {
  data: WeeklyStats[];
}

// Extend the chart data with counts for each type
interface EnhancedWeeklyStats extends WeeklyStats {
  weekLabel: string;
  sickDays: number;
  ptoDays: number;
  eventDays: number;
  holidayDays: number;
  // The actual days to display for non-office types (only shown when needed)
  displaySickDays: number;
  displayPtoDays: number;
  displayEventDays: number;
  displayHolidayDays: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EnhancedWeeklyStats;
    const total = data.daysInOffice + 
      data.displaySickDays + 
      data.displayPtoDays + 
      data.displayEventDays + 
      data.displayHolidayDays;
    
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-xs font-medium">Week of</span>
            <span className="text-xs">{format(new Date(data.weekOf), 'MMM d')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">Office Days</span>
            <span className="text-xs">{data.daysInOffice} of 3</span>
          </div>
          
          {data.displaySickDays > 0 && (
            <div className="flex flex-col">
              <span className="text-xs font-medium">Sick Days</span>
              <span className="text-xs">{data.displaySickDays}</span>
            </div>
          )}
          
          {data.displayPtoDays > 0 && (
            <div className="flex flex-col">
              <span className="text-xs font-medium">PTO Days</span>
              <span className="text-xs">{data.displayPtoDays}</span>
            </div>
          )}
          
          {data.displayEventDays > 0 && (
            <div className="flex flex-col">
              <span className="text-xs font-medium">Event Days</span>
              <span className="text-xs">{data.displayEventDays}</span>
            </div>
          )}
          
          {data.displayHolidayDays > 0 && (
            <div className="flex flex-col">
              <span className="text-xs font-medium">Holidays</span>
              <span className="text-xs">{data.displayHolidayDays}</span>
            </div>
          )}
          
          <div className="flex flex-col col-span-2 mt-1 pt-1 border-t">
            <span className="text-xs font-medium">Total Days</span>
            <span className="text-xs">{total} days</span>
          </div>
          
          <div className="flex flex-col col-span-2">
            <span className="text-xs font-medium">Compliance</span>
            <span className="text-xs">{Math.min(100, Math.round((data.daysInOffice / 3) * 100))}%</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const VisitChart = ({ data }: VisitChartProps) => {
  // Process the data to include counts for different entry types
  const chartData: EnhancedWeeklyStats[] = data.map(week => {
    const weekStart = startOfWeek(new Date(week.weekOf), { weekStartsOn: 0 });
    const weekEnd = endOfWeek(new Date(week.weekOf), { weekStartsOn: 0 });
    
    // Count days by type for this week
    let sickDays = 0;
    let ptoDays = 0;
    let eventDays = 0;
    let holidayDays = 0;
    
    // Count entries by type
    mockEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate >= weekStart && entryDate <= weekEnd) {
        // Don't count weekends
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
    
    // Only display these days when office visits are under 3
    const remainingNeeded = Math.max(0, 3 - week.daysInOffice);
    
    // Calculate how many of each type to display (prioritize in order)
    let displaySickDays = 0;
    let displayPtoDays = 0;
    let displayEventDays = 0;
    let displayHolidayDays = 0;
    
    let remaining = remainingNeeded;
    
    // Prioritize sick days first
    displaySickDays = Math.min(remaining, sickDays);
    remaining -= displaySickDays;
    
    // Then PTO days
    if (remaining > 0) {
      displayPtoDays = Math.min(remaining, ptoDays);
      remaining -= displayPtoDays;
    }
    
    // Then event days
    if (remaining > 0) {
      displayEventDays = Math.min(remaining, eventDays);
      remaining -= displayEventDays;
    }
    
    // Finally holidays
    if (remaining > 0) {
      displayHolidayDays = Math.min(remaining, holidayDays);
    }
    
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
      // Update percentage to be based on 3 days instead of total work days
      percentage: Math.min(100, (week.daysInOffice / 3) * 100)
    };
  });
  
  return (
    <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200">
      <CardHeader>
        <CardTitle>Weekly Office Visits</CardTitle>
        <CardDescription>
          Your RTO compliance (target: 3 days per week)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              stackOffset="sign"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.3)" />
              <XAxis 
                dataKey="weekLabel" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--muted)/0.3)' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 5]}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine 
                y={3} 
                stroke="hsl(var(--primary)/0.5)" 
                strokeDasharray="3 3" 
                label={{ 
                  value: "Target (3 days)", 
                  position: "insideBottomRight", 
                  fontSize: 12,
                  fill: "hsl(var(--primary))" 
                }} 
              />
              <Bar 
                dataKey="daysInOffice" 
                stackId="a"
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50} 
                name="Office Days"
              />
              <Bar 
                dataKey="displaySickDays" 
                stackId="a"
                fill="hsl(var(--destructive)/0.7)" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={50} 
                name="Sick Days"
              />
              <Bar 
                dataKey="displayPtoDays" 
                stackId="a"
                fill="hsl(var(--secondary)/0.7)" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={50} 
                name="PTO Days"
              />
              <Bar 
                dataKey="displayEventDays" 
                stackId="a"
                fill="hsl(var(--accent)/0.7)" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={50} 
                name="Events"
              />
              <Bar 
                dataKey="displayHolidayDays" 
                stackId="a"
                fill="hsl(217, 91%, 60%)" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={50} 
                name="Holidays"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitChart;
