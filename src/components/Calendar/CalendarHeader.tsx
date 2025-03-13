
import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarHeaderProps {
  currentMonth: Date;
  previousMonth: () => void;
  nextMonth: () => void;
  goToday: () => void;
}

const CalendarHeader = ({ 
  currentMonth, 
  previousMonth, 
  nextMonth, 
  goToday 
}: CalendarHeaderProps) => {
  return (
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
  );
};

export default CalendarHeader;
