
import { useState } from 'react';
import { DateRange } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Check, 
  Thermometer,
  Plane,
  Flag,
  CalendarDays
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subMonths, subYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  includeSick: boolean;
  setIncludeSick: (include: boolean) => void;
  includePto: boolean;
  setIncludePto: (include: boolean) => void;
  includeEvents: boolean;
  setIncludeEvents: (include: boolean) => void;
  includeHolidays?: boolean;
  setIncludeHolidays?: (include: boolean) => void;
}

const FilterBar = ({
  dateRange,
  setDateRange,
  includeSick,
  setIncludeSick,
  includePto,
  setIncludePto,
  includeEvents,
  setIncludeEvents,
  includeHolidays = true,
  setIncludeHolidays = () => {}
}: FilterBarProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get the formatted date range string
  const dateRangeText = dateRange.from && dateRange.to
    ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    : 'Select date range';

  // Preset date range handlers
  const handlePresetChange = (value: string) => {
    const now = new Date();
    let from: Date;
    
    switch (value) {
      case "1m":
        from = subMonths(now, 1);
        break;
      case "3m":
        from = subMonths(now, 3);
        break;
      case "6m":
        from = subMonths(now, 6);
        break;
      case "1y":
        from = subYears(now, 1);
        break;
      default:
        return;
    }
    
    setDateRange({ from, to: now });
    setIsCalendarOpen(false);
  };
  
  // Check if any filters are active
  const hasActiveFilters = !includeSick || !includePto || !includeEvents || !includeHolidays;
  
  // Handle toggling all filters
  const toggleAllFilters = (value: boolean) => {
    setIncludeSick(value);
    setIncludePto(value);
    setIncludeEvents(value);
    setIncludeHolidays(value);
  };
  
  return (
    <div className="space-y-4 mb-6 animate-slide-up">
      {/* Combined Date Range and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-full sm:flex-1",
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
              }}
              numberOfMonths={2}
              className="p-3"
            />
            <div className="flex items-center p-3 border-t">
              <div className="flex gap-2 mx-auto">
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("1m")}>1M</Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("3m")}>3M</Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("6m")}>6M</Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetChange("1y")}>1Y</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto relative"
            >
              <Filter className="mr-2 h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Show entry types:</h4>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-sick" 
                    checked={includeSick} 
                    onCheckedChange={(checked) => setIncludeSick(checked === true)}
                  />
                  <Label htmlFor="include-sick" className="flex items-center gap-2 cursor-pointer">
                    <Thermometer className="h-3.5 w-3.5" />
                    <span>Sick Days</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-pto" 
                    checked={includePto} 
                    onCheckedChange={(checked) => setIncludePto(checked === true)}
                  />
                  <Label htmlFor="include-pto" className="flex items-center gap-2 cursor-pointer">
                    <Plane className="h-3.5 w-3.5" />
                    <span>PTO</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-events" 
                    checked={includeEvents} 
                    onCheckedChange={(checked) => setIncludeEvents(checked === true)}
                  />
                  <Label htmlFor="include-events" className="flex items-center gap-2 cursor-pointer">
                    <Flag className="h-3.5 w-3.5" />
                    <span>Company Events</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-holidays" 
                    checked={includeHolidays} 
                    onCheckedChange={(checked) => setIncludeHolidays?.(checked === true)}
                  />
                  <Label htmlFor="include-holidays" className="flex items-center gap-2 cursor-pointer">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Holidays</span>
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleAllFilters(true)}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleAllFilters(false)}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>
          <div className="flex flex-wrap gap-2">
            {!includeSick && (
              <Badge variant="secondary">No Sick Days</Badge>
            )}
            {!includePto && (
              <Badge variant="secondary">No PTO</Badge>
            )}
            {!includeEvents && (
              <Badge variant="secondary">No Events</Badge>
            )}
            {!includeHolidays && (
              <Badge variant="secondary">No Holidays</Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
