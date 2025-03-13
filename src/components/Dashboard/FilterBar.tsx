
import { useState } from 'react';
import { DateRange } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterBarProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  includeSick: boolean;
  setIncludeSick: (include: boolean) => void;
  includePto: boolean;
  setIncludePto: (include: boolean) => void;
  includeEvents: boolean;
  setIncludeEvents: (include: boolean) => void;
}

const FilterBar = ({
  dateRange,
  setDateRange,
  includeSick,
  setIncludeSick,
  includePto,
  setIncludePto,
  includeEvents,
  setIncludeEvents
}: FilterBarProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get the formatted date range string
  const dateRangeText = dateRange.from && dateRange.to
    ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    : 'Select date range';
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6 animate-slide-up">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-full sm:w-auto",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRangeText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) => {
              setDateRange({ from: range?.from, to: range?.to });
              if (range?.to) {
                setTimeout(() => setIsCalendarOpen(false), 300);
              }
            }}
            numberOfMonths={2}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Filters</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="start">
          <div className="space-y-4">
            <h4 className="font-medium mb-2">Include in calculations:</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-sick" 
                checked={includeSick} 
                onCheckedChange={(checked) => setIncludeSick(checked === true)}
              />
              <Label htmlFor="include-sick" className="flex-1 cursor-pointer">
                Sick Days
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-pto" 
                checked={includePto} 
                onCheckedChange={(checked) => setIncludePto(checked === true)}
              />
              <Label htmlFor="include-pto" className="flex-1 cursor-pointer">
                PTO
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-events" 
                checked={includeEvents} 
                onCheckedChange={(checked) => setIncludeEvents(checked === true)}
              />
              <Label htmlFor="include-events" className="flex-1 cursor-pointer">
                Company Events
              </Label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterBar;
