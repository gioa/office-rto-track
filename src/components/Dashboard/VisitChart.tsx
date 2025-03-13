
import { WeeklyStats } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, TooltipProps, Legend } from "recharts";
import { mockEntries } from "@/lib/mockData";
import { startOfWeek, endOfWeek } from "date-fns";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

interface VisitChartProps {
  data: WeeklyStats[];
}

interface EnhancedWeeklyStats extends WeeklyStats {
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
            <span className="text-xs">{data.compliancePercentage}%</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Chart configuration with colors matching the calendar
const chartConfig: ChartConfig = {
  "office": {
    color: "#10b981" // green-500
  },
  "sick": {
    color: "#f97316" // orange-500 
  },
  "pto": {
    color: "#3b82f6" // blue-500
  },
  "event": {
    color: "#8b5cf6" // purple-500
  },
  "holiday": {
    color: "#ec4899" // pink-500
  }
};

const VisitChart = ({ data }: VisitChartProps) => {
  const chartData: EnhancedWeeklyStats[] = data.map(week => {
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
          <ChartContainer config={chartConfig}>
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
              
              {/* Office visits - always the base of the stack with bottom radius */}
              <Bar 
                dataKey="daysInOffice" 
                stackId="a"
                fill="var(--color-office)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50} 
                name="Office Days"
              />
              
              {/* Sick days with no radius (middle layers) */}
              <Bar 
                dataKey="displaySickDays" 
                stackId="a"
                fill="var(--color-sick)" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={50} 
                name="Sick Days"
              />
              
              {/* PTO days with no radius (middle layers) */}
              <Bar 
                dataKey="displayPtoDays" 
                stackId="a"
                fill="var(--color-pto)" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={50} 
                name="PTO Days"
              />
              
              {/* Events with no radius (middle layers) */}
              <Bar 
                dataKey="displayEventDays" 
                stackId="a"
                fill="var(--color-event)" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={50} 
                name="Events"
              />
              
              {/* Holidays - potential top layer with top radius */}
              <Bar 
                dataKey="displayHolidayDays" 
                stackId="a"
                fill="var(--color-holiday)" 
                radius={(datum) => {
                  // Apply top radius only if this is the top of the stack
                  const isTopOfStack = datum.displayHolidayDays > 0;
                  return isTopOfStack ? [4, 4, 0, 0] : [0, 0, 0, 0];
                }}
                maxBarSize={50} 
                name="Holidays"
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitChart;
