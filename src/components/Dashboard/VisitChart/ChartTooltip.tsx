
import { TooltipProps } from "recharts";
import { EnhancedWeeklyStats } from "./utils";
import { format } from "date-fns";

const ChartTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
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

export default ChartTooltip;
