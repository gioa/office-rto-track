
import { WeeklyStats } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { transformWeeklyStats } from "./utils";
import ChartTooltip from "./ChartTooltip";
import { chartConfig } from "./config";

interface VisitChartProps {
  data: WeeklyStats[];
}

const VisitChart = ({ data }: VisitChartProps) => {
  const chartData = transformWeeklyStats(data);
  
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
              <Tooltip content={<ChartTooltip />} />
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
                radius={0} 
                maxBarSize={50} 
                name="Sick Days"
              />
              
              {/* PTO days with no radius (middle layers) */}
              <Bar 
                dataKey="displayPtoDays" 
                stackId="a"
                fill="var(--color-pto)" 
                radius={0} 
                maxBarSize={50} 
                name="PTO Days"
              />
              
              {/* Events with no radius (middle layers) */}
              <Bar 
                dataKey="displayEventDays" 
                stackId="a"
                fill="var(--color-event)" 
                radius={0} 
                maxBarSize={50} 
                name="Events"
              />
              
              {/* Holidays - potential top layer with top radius */}
              <Bar 
                dataKey="displayHolidayDays" 
                stackId="a"
                fill="var(--color-holiday)" 
                radius={[4, 4, 0, 0]} 
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
