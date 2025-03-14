
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { isToday } from "date-fns";

interface CalendarDayMarkerProps {
  hasEntry: boolean;
  dayIsWeekend: boolean;
  entryType: string | null;
  isPlannedDay: boolean;
  day: Date;
}

const CalendarDayMarker = ({ 
  hasEntry, 
  dayIsWeekend, 
  entryType, 
  isPlannedDay,
  day
}: CalendarDayMarkerProps) => {
  const isTodayDate = isToday(day);
  
  if (hasEntry && !dayIsWeekend) {
    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <CircleCheck 
          className={cn(
            "h-5 w-5",
            isTodayDate && "ring-2 ring-white ring-offset-1 rounded-full",
            entryType === 'office-visit' && "text-green-500",
            entryType === 'sick' && "text-amber-500",
            entryType === 'pto' && "text-blue-500",
            (entryType === 'event' || entryType === 'holiday') && "text-purple-500"
          )} 
        />
      </div>
    );
  }
  
  if (isPlannedDay && !hasEntry && !dayIsWeekend) {
    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <CircleCheck 
          className={cn(
            "h-5 w-5 text-blue-300/50 opacity-70",
            isTodayDate && "ring-2 ring-white ring-offset-1 rounded-full"
          )} 
        />
      </div>
    );
  }
  
  return null;
};

export default CalendarDayMarker;
