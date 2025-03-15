
import { isSameDay, isSameMonth, format, isAfter, isToday } from "date-fns";
import { Entry, PlannedDay } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getEntriesForDay, getFirstEntryType, isWeekend } from "./utils";
import { useState } from "react";
import CalendarDayContent from "./CalendarDayContent";
import CalendarDayMarker from "./CalendarDayMarker";

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
  // Use the consistent isWeekend helper
  const dayIsWeekend = isWeekend(day);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Force empty entries array for weekend days
  const filteredEntries = dayIsWeekend ? [] : getEntriesForDay(entries, day);
  
  // Always have no entries for weekends
  const hasEntry = dayIsWeekend ? false : filteredEntries.length > 0;
  
  const dayNumber = format(day, 'd');
  
  // Ensure no entry type is reported for weekends
  const entryType = dayIsWeekend ? null : getFirstEntryType(entries, day);

  // Check if this is a temp badge entry
  const firstEntry = filteredEntries[0];
  const isTempBadge = firstEntry?.type === 'office-visit' && firstEntry?.isTempBadge;
  
  // Check if this day is a planned office day - never on weekends
  const isPlannedDay = !dayIsWeekend && isAfter(day, new Date()) && 
    plannedDays.some(pd => pd.weekday === day.getDay());
  
  // Handle modal state changes
  const handleDialogOpenChange = (open: boolean) => {
    setModalOpen(open);
    // Only close the tooltip when the modal is opened
    if (open) {
      setTooltipOpen(false);
    }
  };
  
  // Handle tooltip state, considering modal state
  const handleTooltipOpenChange = (open: boolean) => {
    // If a modal is open, don't allow the tooltip to be opened
    if (modalOpen && open) {
      return;
    }
    setTooltipOpen(open);
  };
  
  const getDateClasses = (day: Date) => {
    const isCurrentToday = isToday(day);
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, currentMonth);
    
    return cn(
      "calendar-day w-full h-12 sm:h-16 p-1 relative",
      isCurrentToday && "calendar-day-today",
      isSelected && "calendar-day-active",
      !isCurrentMonth && "calendar-day-disabled",
      dayIsWeekend && "text-muted-foreground",
      isPlannedDay && "planned"
    );
  };
  
  // Handler to stop propagation for tooltip content
  const handleTooltipContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Tooltip 
      delayDuration={300} 
      open={tooltipOpen}
      onOpenChange={handleTooltipOpenChange}
    >
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => {
            setSelectedDate(day);
            setTooltipOpen(true);
          }}
          className={getDateClasses(day)}
          disabled={!isSameMonth(day, currentMonth)}
        >
          <span className="absolute top-1 right-2 text-xs">{dayNumber}</span>
          
          <CalendarDayMarker 
            hasEntry={hasEntry}
            dayIsWeekend={dayIsWeekend}
            entryType={entryType}
            isPlannedDay={isPlannedDay}
            isTempBadge={isTempBadge}
          />
        </button>
      </TooltipTrigger>
      
      <TooltipContent 
        align="center" 
        className="p-0 w-64 tooltip-content" 
        side="top" 
        onClick={handleTooltipContentClick}
      >
        <CalendarDayContent 
          day={day}
          entries={filteredEntries}
          dayIsWeekend={dayIsWeekend}
          isPlannedDay={isPlannedDay}
          plannedDays={plannedDays}
          handleDialogOpenChange={handleDialogOpenChange}
          handleTooltipContentClick={handleTooltipContentClick}
        />
      </TooltipContent>
    </Tooltip>
  );
};

export default CalendarDay;
