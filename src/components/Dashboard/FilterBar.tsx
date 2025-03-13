
import { useState } from 'react';
import { DateRange } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Check, 
  Briefcase,
  Thermometer,
  Plane,
  Flag
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subMonths, subYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';

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
  };
  
  return (
    <div className="space-y-4 mb-6 animate-slide-up">
      {/* Date Range Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <Select onValueChange={handlePresetChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>

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
                  if (range?.to) {
                    setTimeout(() => setIsCalendarOpen(false), 300);
                  }
                }}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto relative"
            >
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filters</span>
              {(!includeSick || !includePto || !includeEvents) && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium mb-2">Include in calculations:</h4>
              
              <ToggleGroup type="multiple" className="flex flex-col gap-2">
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <Checkbox 
                    id="include-sick" 
                    checked={includeSick} 
                    onCheckedChange={(checked) => setIncludeSick(checked === true)}
                  />
                  <Label htmlFor="include-sick" className="flex flex-1 items-center gap-2 cursor-pointer">
                    <Badge variant={includeSick ? "default" : "outline"} className="gap-1">
                      <Thermometer className="h-3 w-3" />
                      <span>Sick</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">Include sick days</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <Checkbox 
                    id="include-pto" 
                    checked={includePto} 
                    onCheckedChange={(checked) => setIncludePto(checked === true)}
                  />
                  <Label htmlFor="include-pto" className="flex flex-1 items-center gap-2 cursor-pointer">
                    <Badge variant={includePto ? "default" : "outline"} className="gap-1">
                      <Plane className="h-3 w-3" />
                      <span>PTO</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">Include PTO</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <Checkbox 
                    id="include-events" 
                    checked={includeEvents} 
                    onCheckedChange={(checked) => setIncludeEvents(checked === true)}
                  />
                  <Label htmlFor="include-events" className="flex flex-1 items-center gap-2 cursor-pointer">
                    <Badge variant={includeEvents ? "default" : "outline"} className="gap-1">
                      <Flag className="h-3 w-3" />
                      <span>Events</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">Include company events</span>
                  </Label>
                </div>
              </ToggleGroup>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIncludeSick(true);
                    setIncludePto(true);
                    setIncludeEvents(true);
                  }}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIncludeSick(false);
                    setIncludePto(false);
                    setIncludeEvents(false);
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {(!includeSick || !includePto || !includeEvents) && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {!includeSick && (
              <Badge variant="secondary" className="gap-1">
                <Thermometer className="h-3 w-3" />
                <span>No Sick Days</span>
              </Badge>
            )}
            {!includePto && (
              <Badge variant="secondary" className="gap-1">
                <Plane className="h-3 w-3" />
                <span>No PTO</span>
              </Badge>
            )}
            {!includeEvents && (
              <Badge variant="secondary" className="gap-1">
                <Flag className="h-3 w-3" />
                <span>No Events</span>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
