
import { CalendarIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { FormValues } from "./EntryFormSchema";
import { DateRange } from "@/lib/types";

interface EntryDateSelectorProps {
  control: Control<FormValues>;
  selectedType: string;
}

const EntryDateSelector = ({ control, selectedType }: EntryDateSelectorProps) => {
  const isPtoOrEvent = selectedType === "pto" || selectedType === "event";
  
  // Display selected date or date range
  const formatSelectedDate = (value: Date | DateRange) => {
    if (value instanceof Date) {
      return format(value, "MMMM d, yyyy");
    } else if ('from' in value && value.from) {
      return value.to 
        ? `${format(value.from, "MMM d")} - ${format(value.to, "MMM d, yyyy")}`
        : format(value.from, "MMMM d, yyyy");
    }
    return "Select date";
  };

  // Prevent events from bubbling up to parent components
  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date{isPtoOrEvent ? " Range" : ""}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {field.value ? formatSelectedDate(field.value) : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start" onClick={handleCalendarClick}>
              {isPtoOrEvent ? (
                // Range selector for PTO and events
                <Calendar
                  mode="range"
                  selected={field.value as DateRange}
                  onSelect={field.onChange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  weekStartsOn={0} // Explicitly set to Sunday
                />
              ) : (
                // Single date selector for other entry types
                <Calendar
                  mode="single"
                  selected={field.value as Date}
                  onSelect={field.onChange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  weekStartsOn={0} // Explicitly set to Sunday
                  // For office visits and sick days, we only allow weekdays
                  disabled={(date) => 
                    (selectedType === "office-visit" || selectedType === "sick") ? 
                      date.getDay() === 0 || date.getDay() === 6 : false
                  }
                />
              )}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EntryDateSelector;
