
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend, ResponsiveContainer } from "recharts";
import ChartTooltip from "../ChartTooltip";

interface BarChartComponentProps {
  chartData: any[];
}

const BarChartComponent = ({ chartData }: BarChartComponentProps) => {
  return (
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
  );
};

export default BarChartComponent;
