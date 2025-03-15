
import { CircleCheck, Ticket } from "lucide-react";
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
    // For office visits from user entries, always use the Ticket icon
    // and assume all manually added office visits are temp badges
    const Icon = entryType === 'office-visit' ? Ticket : CircleCheck;
    
    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <Icon 
          className={cn(
            "h-5 w-5",
            entryType === 'office-visit' && "text-teal-500", // Change all office visits to teal
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
