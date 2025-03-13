
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Entry, PlannedDay } from "@/lib/types";
import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import CalendarLegend from "./CalendarLegend";

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
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToday = () => setCurrentMonth(new Date());
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <Card className="glass subtle-shadow animate-slide-up animation-delay-100">
      <CalendarHeader 
        currentMonth={currentMonth}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
        goToday={goToday}
      />
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium py-1">
              {day}
            </div>
          ))}
          
          {daysInMonth.map((day, i) => (
            <CalendarDay 
              key={i}
              day={day}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              entries={entries}
              plannedDays={plannedDays}
              setSelectedDate={setSelectedDate}
            />
          ))}
        </div>
        
        <CalendarLegend />
      </CardContent>
    </Card>
  );
};

export default MonthView;
