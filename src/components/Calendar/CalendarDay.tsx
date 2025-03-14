
import { isSameDay, isSameMonth, format, isAfter, isToday } from "date-fns";
import { CircleCheck, Plus, Trash2 } from "lucide-react";
import { Entry, PlannedDay } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EntryFormDialog from "@/components/EntryForm/EntryFormDialog";
import { getEntriesForDay, getFirstEntryType, formatEntryType, isWeekend } from "./utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useEntries } from "@/hooks/entries";

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
  const { addEntry } = useEntries();
  
  // Force empty entries array for weekend days
  const filteredEntries = dayIsWeekend ? [] : getEntriesForDay(entries, day);
  
  // Always have no entries for weekends
  const hasEntry = dayIsWeekend ? false : filteredEntries.length > 0;
  
  const dayNumber = format(day, 'd');
  
  // Ensure no entry type is reported for weekends
  const entryType = dayIsWeekend ? null : getFirstEntryType(entries, day);
  
  // Check if this day is a planned office day - never on weekends
  const isPlannedDay = !dayIsWeekend && isAfter(day, new Date()) && 
    plannedDays.some(pd => pd.weekday === day.getDay());
  
  // Check if the entry is an office visit which can't be deleted
  const isOfficeVisit = entryType === 'office-visit';
  
  // Check if we have a user entry (sick, pto, event, holiday) that can be deleted
  const isDeletableEntry = hasEntry && !isOfficeVisit;
  
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
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setSelectedDate(day)}
          className={getDateClasses(day)}
          disabled={!isSameMonth(day, currentMonth)}
        >
          <span className="absolute top-1 right-2 text-xs">{dayNumber}</span>
          
          {/* Only show checkmarks for weekdays with entries - NEVER for weekends */}
          {hasEntry && !dayIsWeekend && (
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
          
          {/* Never show planned checkmarks on weekends */}
          {isPlannedDay && !hasEntry && !dayIsWeekend && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <CircleCheck className="h-5 w-5 text-blue-300/50 opacity-70" />
            </div>
          )}
        </button>
      </TooltipTrigger>
      
      <TooltipContent align="center" className="p-0 w-64" side="top" onClick={handleTooltipContentClick}>
        {filteredEntries.length > 0 && !dayIsWeekend ? (
          <div className="p-2">
            <p className="text-sm font-medium mb-1">{format(day, 'EEEE, MMMM d, yyyy')}</p>
            <div className="space-y-1">
              {filteredEntries.map((entry, idx) => (
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
              {/* Show different buttons based on entry type */}
              {isOfficeVisit ? (
                <p className="text-xs text-muted-foreground text-center">Office visit entries cannot be modified</p>
              ) : isDeletableEntry && filteredEntries[0] ? (
                <DeleteEntryButton entry={filteredEntries[0]} />
              ) : (
                <EntryFormDialog date={day} buttonVariant="outline" buttonSize="sm" fullWidth>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Entry
                  </Button>
                </EntryFormDialog>
              )}
            </div>
          </div>
        ) : isPlannedDay && !dayIsWeekend ? (
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
            <p className="text-xs text-muted-foreground">
              {dayIsWeekend ? "Weekend day" : "No entries for this day"}
            </p>
            {!dayIsWeekend && (
              <div className="mt-2 pt-2 border-t border-border">
                <EntryFormDialog date={day} buttonVariant="outline" buttonSize="sm" fullWidth>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Entry
                  </Button>
                </EntryFormDialog>
              </div>
            )}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

// Delete Entry Button Component
const DeleteEntryButton = ({ entry }: { entry: Entry }) => {
  const { deleteEntry } = useEntries();
  
  const handleDelete = async () => {
    await deleteEntry.mutateAsync(entry.id);
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-xs text-destructive hover:text-destructive">
          <Trash2 className="h-3 w-3 mr-1" />
          Delete Entry
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Entry</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {formatEntryType(entry.type).toLowerCase()} entry? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CalendarDay;
