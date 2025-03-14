
import { Entry, WeeklyStats } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend, ResponsiveContainer } from "recharts";
import { transformWeeklyStats } from "./utils";
import ChartTooltip from "./ChartTooltip";
import { chartConfig } from "./config";
import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useEffect, useState } from "react";
import { generateWeeklyStats } from "@/lib/data/statsGenerator";

interface VisitChartProps {
  entries?: Entry[];
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const VisitChart = ({ entries, dateRange }: VisitChartProps) => {
  const { data: apiData, isLoading, error } = useWeeklyStats(10);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Regenerate chart data whenever entries or dateRange changes
  useEffect(() => {
    if (entries && entries.length > 0) {
      const filteredStats = generateWeeklyStats(entries);
      setChartData(transformWeeklyStats(filteredStats));
    } else if (apiData) {
      setChartData(transformWeeklyStats(apiData));
    } else {
      setChartData([]);
    }
  }, [entries, dateRange, apiData]);
  
  if (isLoading && !entries && chartData.length === 0) {
    return (
      <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200">
        <CardHeader>
          <CardTitle>Weekly Office Visits</CardTitle>
          <CardDescription>
            Your RTO compliance (target: 3 days per week)
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="h-[350px] w-full flex items-center justify-center">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error && !entries && chartData.length === 0) {
    return (
      <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200">
        <CardHeader>
          <CardTitle>Weekly Office Visits</CardTitle>
          <CardDescription>
            Your RTO compliance (target: 3 days per week)
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="h-[350px] w-full flex items-center justify-center flex-col">
            <p className="text-destructive">Failed to load chart data</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If we have no data even after all fallbacks, show a message
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200">
        <CardHeader>
          <CardTitle>Weekly Office Visits</CardTitle>
          <CardDescription>
            Your RTO compliance (target: 3 days per week)
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="h-[350px] w-full flex items-center justify-center flex-col">
            <p className="text-muted-foreground">No data available for the selected period</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200 overflow-hidden">
      <CardHeader>
        <CardTitle>Weekly Office Visits</CardTitle>
        <CardDescription>
          Your RTO compliance (target: 3 days per week)
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 10, right: 20, left: 10, bottom: 50 }}
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
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ 
                  paddingTop: 20,
                  bottom: 0,
                  fontSize: '12px'
                }}
              />
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
                fill="var(--color-office, #10b981)" 
                radius={0} 
                maxBarSize={50} 
                name="Office Days"
              />
              
              <Bar 
                dataKey="displaySickDays" 
                stackId="a"
                fill="var(--color-sick, #f59e0b)" 
                radius={0} 
                maxBarSize={50} 
                name="Sick Days"
              />
              
              <Bar 
                dataKey="displayPtoDays" 
                stackId="a"
                fill="var(--color-pto, #3b82f6)" 
                radius={0} 
                maxBarSize={50} 
                name="PTO Days"
              />
              
              <Bar 
                dataKey="displayEventDays" 
                stackId="a"
                fill="var(--color-event, #8b5cf6)" 
                radius={0} 
                maxBarSize={50} 
                name="Events"
              />
              
              <Bar 
                dataKey="displayHolidayDays" 
                stackId="a"
                fill="var(--color-holiday, #ec4899)" 
                radius={[4, 4, 0, 0]} 
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
