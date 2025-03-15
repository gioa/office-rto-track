
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDayMarkerProps {
  hasEntry: boolean;
  dayIsWeekend: boolean;
  entryType: string | null;
  isPlannedDay: boolean;
  isTempBadge?: boolean;
}

const CalendarDayMarker = ({ 
  hasEntry, 
  dayIsWeekend, 
  entryType, 
  isPlannedDay,
  isTempBadge
}: CalendarDayMarkerProps) => {
  if (hasEntry && !dayIsWeekend) {
    // Always use CircleCheck icon for all entry types
    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <CircleCheck 
          className={cn(
            "h-5 w-5",
            entryType === 'office-visit' && "text-teal-500", // Keep teal color for office visits
            entryType === 'sick' && "text-amber-500",
            entryType === 'pto' && "text-blue-500",
            entryType === 'event' && "text-purple-500", // Purple for company events
            entryType === 'holiday' && "text-pink-500" // Pink for holidays
          )} 
        />
      </div>
    );
  }
  
  if (isPlannedDay && !hasEntry && !dayIsWeekend) {
    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <CircleCheck className="h-5 w-5 text-blue-300/50 opacity-70" />
      </div>
    );
  }
  
  return null;
};

export default CalendarDayMarker;
