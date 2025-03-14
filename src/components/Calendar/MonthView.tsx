
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Entry, PlannedDay } from "@/lib/types";
import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import CalendarLegend from "./CalendarLegend";
import EntryFormDialog from "@/components/EntryForm/EntryFormDialog";
import { isWeekend } from "./utils";
import { currentUser } from "@/lib/data/currentUser";

interface MonthViewProps {
  entries: Entry[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  plannedDays?: PlannedDay[];
}

const MonthView = ({
  entries,
  selectedDate,
  setSelectedDate,
  plannedDays = []
}: MonthViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  
  // Generate days for the calendar view, ensuring we start from the first day of the week
  // containing the first of the month, ensuring correct alignment
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }), // Explicitly use Sunday (0) as start
    end: lastDayOfMonth
  });
  
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToday = () => setCurrentMonth(new Date());
  
  // Define dayNames with Sunday first to match the weekStartsOn=0 setting
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Filter entries to only show the current user's entries
  const userEntries = entries.filter(entry => 
    entry.userId === currentUser.id || entry.userId === currentUser.email
  );

  // Filter entries to remove any on weekend days
  const filteredEntries = userEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return !isWeekend(entryDate);
  });

  // Filter planned days to only show the current user's planned days
  const userPlannedDays = plannedDays.filter(day => 
    day.userId === currentUser.id
  );

  // Get the planned weekdays as an array to use for styling
  const getPlannedDaysModifier = () => {
    const today = new Date();
    const futureDates: Record<string, Date> = {};

    // Create a map of planned days in the future
    // For each day in the current month, check if it's a planned office day
    daysInMonth.forEach(day => {
      if (day.getTime() > today.getTime() && // Only future dates
          !isWeekend(day) &&                 // Never include weekend days 
          userPlannedDays.some(pd => pd.weekday === day.getDay())) { // Is a planned day
        futureDates[format(day, 'yyyy-MM-dd')] = day;
      }
    });
    return futureDates;
  };
  
  return (
    <Card className="glass subtle-shadow animate-slide-up animation-delay-100">
      <CalendarHeader currentMonth={currentMonth} previousMonth={previousMonth} nextMonth={nextMonth} goToday={goToday} />
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => <div key={day} className="text-center text-xs font-medium py-1">
              {day}
            </div>)}
          
          {daysInMonth.map((day, i) => (
            <CalendarDay 
              key={i} 
              day={day} 
              currentMonth={currentMonth} 
              selectedDate={selectedDate} 
              entries={filteredEntries} 
              plannedDays={userPlannedDays} 
              setSelectedDate={setSelectedDate} 
            />
          ))}
        </div>
        
        <CalendarLegend />
        
        {/* Add Entry button below the legends */}
        <div className="mt-4 flex justify-center">
          <EntryFormDialog buttonVariant="outline" buttonSize="sm" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthView;
