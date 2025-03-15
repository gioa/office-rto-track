
import { CalendarIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { FormValues } from "./EntryFormSchema";

interface EntryDateSelectorProps {
  control: Control<FormValues>;
  selectedType: string;
}

const EntryDateSelector = ({ control, selectedType }: EntryDateSelectorProps) => {
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
          <FormLabel>Date</FormLabel>
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
                  {field.value ? format(field.value, "MMMM d, yyyy") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start" onClick={handleCalendarClick}>
              <Calendar
                mode="single"
                selected={field.value}
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
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EntryDateSelector;
