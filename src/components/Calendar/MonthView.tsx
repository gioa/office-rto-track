
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Entry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface MonthViewProps {
  entries: Entry[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const MonthView = ({ entries, selectedDate, setSelectedDate }: MonthViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get days in current month
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  // Navigation
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToday = () => setCurrentMonth(new Date());
  
  // Get day of week names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Get entries for a specific date
  const getEntriesForDay = (day: Date) => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return isSameDay(entryDate, day);
    });
  };
  
  // Get the first entry type (for the indicator)
  const getFirstEntryType = (day: Date) => {
    const dayEntries = getEntriesForDay(day);
    return dayEntries.length > 0 ? dayEntries[0].type : null;
  };
  
  // Check if a day has an entry of a specific type
  const hasEntryType = (day: Date, type: Entry['type']) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return isSameDay(entryDate, day) && entry.type === type;
    });
  };
  
  // Get class for date cell
  const getDateClasses = (day: Date) => {
    const isToday = isSameDay(day, new Date());
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    
    const type = getFirstEntryType(day);
    
    return cn(
      "calendar-day w-full h-12 sm:h-16 p-1 relative",
      isToday && "calendar-day-today",
      isSelected && "calendar-day-active",
      !isCurrentMonth && "calendar-day-disabled",
      isWeekend && "text-muted-foreground",
      hasEntryType(day, 'office-visit') && "calendar-day-office-visit",
      hasEntryType(day, 'sick') && "calendar-day-sick",
      hasEntryType(day, 'pto') && "calendar-day-pto",
      (hasEntryType(day, 'event') || hasEntryType(day, 'holiday')) && "calendar-day-event"
    );
  };
  
  return (
    <Card className="glass subtle-shadow animate-slide-up animation-delay-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={previousMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToday} className="h-8">
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-center font-medium text-base mt-2">
          {format(currentMonth, 'MMMM yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium py-1">
              {day}
            </div>
          ))}
          
          {daysInMonth.map((day, i) => {
            const dayEntries = getEntriesForDay(day);
            const dayNumber = format(day, 'd');
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            
            return (
              <Tooltip key={i} delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={getDateClasses(day)}
                    disabled={!isSameMonth(day, currentMonth)}
                  >
                    <span className="absolute top-1 right-2 text-xs">{dayNumber}</span>
                    
                    {dayEntries.length > 0 && !isWeekend && (
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        {hasEntryType(day, 'office-visit') && (
                          <Check className="h-3 w-3 text-green-500" />
                        )}
                        {hasEntryType(day, 'sick') && (
                          <X className="h-3 w-3 text-amber-500" />
                        )}
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
          })}
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            <span className="text-xs">Office Visit</span>
          </div>
          <div className="flex items-center gap-1">
            <X className="h-3 w-3 text-amber-500" />
            <span className="text-xs">Sick Day</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-blue-500" />
            <span className="text-xs">PTO</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-purple-500" />
            <span className="text-xs">Event</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper to format entry types for display
const formatEntryType = (type: Entry['type']): string => {
  switch (type) {
    case 'office-visit': return 'Office';
    case 'sick': return 'Sick';
    case 'pto': return 'PTO';
    case 'event': return 'Event';
    case 'holiday': return 'Holiday';
    default: return type;
  }
};

export default MonthView;
