
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Entry } from "@/lib/types";
import { formatEntryType } from "./utils";
import { cn } from "@/lib/utils";
import EntryFormDialog from "@/components/EntryForm/EntryFormDialog";
import DeleteEntryButton from "./DeleteEntryButton";

interface CalendarDayContentProps {
  day: Date;
  entries: Entry[];
  dayIsWeekend: boolean;
  isPlannedDay: boolean;
  plannedDays: any[];
  handleDialogOpenChange: (open: boolean) => void;
  handleTooltipContentClick: (e: React.MouseEvent) => void;
}

const CalendarDayContent = ({
  day,
  entries,
  dayIsWeekend,
  isPlannedDay,
  plannedDays,
  handleDialogOpenChange,
  handleTooltipContentClick
}: CalendarDayContentProps) => {
  // Check if we have entries
  const hasEntries = entries.length > 0 && !dayIsWeekend;
  
  // Check if the entry is an office visit which can't be deleted
  const isOfficeVisit = hasEntries && entries[0]?.type === 'office-visit';
  
  // Check if we have a user entry (sick, pto, event, holiday) that can be deleted
  const isDeletableEntry = hasEntries && !isOfficeVisit;
  
  if (hasEntries) {
    return (
      <div className="p-2">
        <p className="text-sm font-medium mb-1">{format(day, 'EEEE, MMMM d, yyyy')}</p>
        <div className="space-y-1">
          {entries.map((entry, idx) => (
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
          ) : isDeletableEntry && entries[0] ? (
            <DeleteEntryButton 
              entry={entries[0]} 
              onOpenChange={handleDialogOpenChange} 
            />
          ) : (
            <EntryFormDialog 
              date={day} 
              buttonVariant="outline" 
              buttonSize="sm" 
              fullWidth
              onOpenChange={handleDialogOpenChange}
            >
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Entry
              </Button>
            </EntryFormDialog>
          )}
        </div>
      </div>
    );
  } else if (isPlannedDay && !dayIsWeekend) {
    return (
      <div className="p-2">
        <p className="text-sm font-medium">{format(day, 'EEEE, MMMM d, yyyy')}</p>
        <p className="text-xs text-blue-600">Planned office day</p>
        {plannedDays.filter(pd => pd.weekday === day.getDay()).map((pd, idx) => (
          <div key={idx} className="text-xs text-muted-foreground mt-1">
            {pd.userName && pd.userName !== "You" && `Also: ${pd.userName}`}
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border">
          <EntryFormDialog 
            date={day} 
            buttonVariant="outline" 
            buttonSize="sm" 
            fullWidth
            onOpenChange={handleDialogOpenChange}
          >
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add Entry
            </Button>
          </EntryFormDialog>
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-2">
        <p className="text-sm font-medium">{format(day, 'EEEE, MMMM d, yyyy')}</p>
        <p className="text-xs text-muted-foreground">
          {dayIsWeekend ? "Weekend day" : "No entries for this day"}
        </p>
        {!dayIsWeekend && (
          <div className="mt-2 pt-2 border-t border-border">
            <EntryFormDialog 
              date={day} 
              buttonVariant="outline" 
              buttonSize="sm" 
              fullWidth
              onOpenChange={handleDialogOpenChange}
            >
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Entry
              </Button>
            </EntryFormDialog>
          </div>
        )}
      </div>
    );
  }
};

export default CalendarDayContent;
