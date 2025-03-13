
import { WeeklyStats } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, TooltipProps } from "recharts";

interface VisitChartProps {
  data: WeeklyStats[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as WeeklyStats;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-xs font-medium">Week of</span>
            <span className="text-xs">{format(new Date(data.weekOf), 'MMM d')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">Office Days</span>
            <span className="text-xs">{data.daysInOffice} of {data.totalWorkDays}</span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-xs font-medium">Compliance</span>
            <span className="text-xs">{Math.round(data.percentage)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const VisitChart = ({ data }: VisitChartProps) => {
  const chartData = data.map(week => ({
    ...week,
    weekLabel: format(new Date(week.weekOf), 'MMM d')
  }));
  
  return (
    <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200">
      <CardHeader>
        <CardTitle>Weekly Office Visits</CardTitle>
        <CardDescription>
          Your office attendance over the past weeks
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                domain={[0, (dataMax: number) => Math.max(dataMax, 5)]}
              />
              <Tooltip content={<CustomTooltip />} />
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
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50} 
                name="Days in Office"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitChart;
