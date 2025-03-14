
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface WeekdaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  disabled?: boolean;
}

const WeekdaySelector = ({ selectedDays, onChange, disabled = false }: WeekdaySelectorProps) => {
  // Only show weekdays (Mon-Fri) - no weekends
  const weekdays = [
    { id: 1, name: "M", fullName: "Monday" },
    { id: 2, name: "T", fullName: "Tuesday" },
    { id: 3, name: "W", fullName: "Wednesday" },
    { id: 4, name: "T", fullName: "Thursday" },
    { id: 5, name: "F", fullName: "Friday" },
  ];

  const handleDayToggle = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium mb-1">Repeat on</p>
      <div className="flex gap-3 justify-between">
        {weekdays.map((day) => (
          <button
            key={day.id}
            type="button"
            onClick={() => handleDayToggle(day.id)}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center rounded-full w-12 h-12 text-base font-medium transition-colors",
              selectedDays.includes(day.id) 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/80 text-foreground hover:bg-secondary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            title={day.fullName}
            aria-label={`Select ${day.fullName}`}
            aria-pressed={selectedDays.includes(day.id)}
          >
            {day.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeekdaySelector;
