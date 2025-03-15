
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, isSameDay } from "date-fns";
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
  
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }),
    end: lastDayOfMonth
  });
  
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToday = () => setCurrentMonth(new Date());
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const userEntries = entries.filter(entry => 
    entry.userId === currentUser.id || entry.userId === currentUser.email
  );

  const filteredEntries = userEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return !isWeekend(entryDate);
  });

  const userPlannedDays = plannedDays.filter(day => 
    day.userId === currentUser.id
  );

  const getPlannedDaysModifier = () => {
    const today = new Date();
    const futureDates: Record<string, Date> = {};

    daysInMonth.forEach(day => {
      if (day.getTime() > today.getTime() && 
          !isWeekend(day) && 
          userPlannedDays.some(pd => pd.weekday === day.getDay())) {
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
        
        <div className="mt-4 flex justify-center">
          <EntryFormDialog buttonVariant="outline" buttonSize="sm" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthView;
