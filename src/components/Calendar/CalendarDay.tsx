
import { isSameDay, isSameMonth, format, isAfter, isToday } from "date-fns";
import { CircleCheck, Plus } from "lucide-react";
import { Entry, PlannedDay } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EntryFormDialog from "@/components/EntryForm/EntryFormDialog";
import { getEntriesForDay, getFirstEntryType, formatEntryType } from "./utils";

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  selectedDate: Date;
  entries: Entry[];
  plannedDays?: PlannedDay[];
  setSelectedDate: (date: Date) => void;
}

const CalendarDay = ({ 
  day, 
  currentMonth, 
  selectedDate, 
  entries, 
  plannedDays = [],
  setSelectedDate 
}: CalendarDayProps) => {
  const dayEntries = getEntriesForDay(entries, day);
  const dayNumber = format(day, 'd');
  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
  const hasEntry = dayEntries.length > 0;
  
  const entryType = getFirstEntryType(entries, day);
  
  // Check if this day is a planned office day
  const isPlannedDay = !isWeekend && isAfter(day, new Date()) && 
    plannedDays.some(pd => pd.weekday === day.getDay());
  
  const getDateClasses = (day: Date) => {
    const isCurrentToday = isToday(day);
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isWeekendDay = day.getDay() === 0 || day.getDay() === 6;
    
    return cn(
      "calendar-day w-full h-12 sm:h-16 p-1 relative",
      isCurrentToday && "calendar-day-today",
      isSelected && "calendar-day-active",
      !isCurrentMonth && "calendar-day-disabled",
      isWeekendDay && "text-muted-foreground",
      isPlannedDay && "planned" // Changed from day-planned to planned
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
          
          {isPlannedDay && !hasEntry && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <CircleCheck className="h-5 w-5 text-blue-300/50 opacity-70" />
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
            <div className="mt-2 pt-2 border-t border-border">
              <EntryFormDialog date={day} buttonVariant="outline" buttonSize="sm" fullWidth>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Entry
                </Button>
              </EntryFormDialog>
            </div>
          </div>
        ) : isPlannedDay ? (
          <div className="p-2">
            <p className="text-sm font-medium">{format(day, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-xs text-blue-600">Planned office day</p>
            {plannedDays.filter(pd => pd.weekday === day.getDay()).map((pd, idx) => (
              <div key={idx} className="text-xs text-muted-foreground mt-1">
                {pd.userName && pd.userName !== "You" && `Also: ${pd.userName}`}
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <EntryFormDialog date={day} buttonVariant="outline" buttonSize="sm" fullWidth>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Entry
                </Button>
              </EntryFormDialog>
            </div>
          </div>
        ) : (
          <div className="p-2">
            <p className="text-sm font-medium">{format(day, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-xs text-muted-foreground">No entries for this day</p>
            <div className="mt-2 pt-2 border-t border-border">
              <EntryFormDialog date={day} buttonVariant="outline" buttonSize="sm" fullWidth>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Entry
                </Button>
              </EntryFormDialog>
            </div>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default CalendarDay;
