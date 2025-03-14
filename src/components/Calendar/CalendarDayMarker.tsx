
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDayMarkerProps {
  hasEntry: boolean;
  dayIsWeekend: boolean;
  entryType: string | null;
  isPlannedDay: boolean;
}

const CalendarDayMarker = ({ 
  hasEntry, 
  dayIsWeekend, 
  entryType, 
  isPlannedDay 
}: CalendarDayMarkerProps) => {
  if (hasEntry && !dayIsWeekend) {
    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <CircleCheck 
          className={cn(
            "h-5 w-5",
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
        <CircleCheck className="h-5 w-5 text-blue-300/50 opacity-70" />
      </div>
    );
  }
  
  return null;
};

export default CalendarDayMarker;
