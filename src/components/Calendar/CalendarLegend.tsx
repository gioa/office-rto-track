
import { CircleCheck } from "lucide-react";

const CalendarLegend = () => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      <div className="flex items-center gap-1">
        <CircleCheck className="h-4 w-4 text-green-500" />
        <span className="text-xs">Office Visit</span>
      </div>
      <div className="flex items-center gap-1">
        <CircleCheck className="h-4 w-4 text-amber-500" />
        <span className="text-xs">Sick Day</span>
      </div>
      <div className="flex items-center gap-1">
        <CircleCheck className="h-4 w-4 text-blue-500" />
        <span className="text-xs">PTO</span>
      </div>
      <div className="flex items-center gap-1">
        <CircleCheck className="h-4 w-4 text-purple-500" />
        <span className="text-xs">Event</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
