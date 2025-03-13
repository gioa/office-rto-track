
import { isSameDay, isSameMonth, format } from "date-fns";
import { CircleCheck } from "lucide-react";
import { Entry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getEntriesForDay, getFirstEntryType, formatEntryType } from "./utils";

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  selectedDate: Date;
  entries: Entry[];
  setSelectedDate: (date: Date) => void;
}

const CalendarDay = ({ 
  day, 
  currentMonth, 
  selectedDate, 
  entries, 
  setSelectedDate 
}: CalendarDayProps) => {
  const dayEntries = getEntriesForDay(entries, day);
  const dayNumber = format(day, 'd');
  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
  const hasEntry = dayEntries.length > 0;
  
  const entryType = getFirstEntryType(entries, day);
  
  const getDateClasses = (day: Date) => {
    const isToday = isSameDay(day, new Date());
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    
    return cn(
      "calendar-day w-full h-12 sm:h-16 p-1 relative",
      isToday && "calendar-day-today",
      isSelected && "calendar-day-active",
      !isCurrentMonth && "calendar-day-disabled",
      isWeekend && "text-muted-foreground"
    );
  };
  
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setSelectedDate(day)}
          className={getDateClasses(day)}
          disabled={!isSameMonth(day, currentMonth)}
        >
          <span className="absolute top-1 right-2 text-xs">{dayNumber}</span>
          
          {hasEntry && !isWeekend && (
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
          )}
        </button>
      </TooltipTrigger>
      
      <TooltipContent align="center" className="p-0 w-64">
        {dayEntries.length > 0 ? (
          <div className="p-2">
            <p className="text-sm font-medium mb-1">{format(day, 'EEEE, MMMM d, yyyy')}</p>
            <div className="space-y-1">
              {dayEntries.map((entry, idx) => (
                <div key={idx} className="flex items-center text-xs">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "mr-2 w-20 justify-center",
                      entry.type === 'office-visit' && "bg-green-500/10 text-green-600 border-green-200",
                      entry.type === 'sick' && "bg-amber-500/10 text-amber-600 border-amber-200",
                      entry.type === 'pto' && "bg-blue-500/10 text-blue-600 border-blue-200",
                      (entry.type === 'event' || entry.type === 'holiday') && "bg-purple-500/10 text-purple-600 border-purple-200",
                    )}
                  >
                    {formatEntryType(entry.type)}
                  </Badge>
                  <span>{entry.note || 'No details'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-2">
            <p className="text-sm font-medium">{format(day, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-xs text-muted-foreground">No entries for this day</p>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default CalendarDay;
