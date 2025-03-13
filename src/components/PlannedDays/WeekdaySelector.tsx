
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface WeekdaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  disabled?: boolean;
}

const WeekdaySelector = ({ selectedDays, onChange, disabled = false }: WeekdaySelectorProps) => {
  const weekdays = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
  ];

  const handleDayToggle = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium mb-2">Select your planned office days:</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {weekdays.map((day) => (
          <div 
            key={day.id} 
            className={cn(
              "flex items-center space-x-2 rounded-md border p-2 transition-colors",
              selectedDays.includes(day.id) ? "border-primary/50 bg-primary/5" : "border-input",
              disabled && "opacity-50"
            )}
          >
            <Checkbox
              id={`day-${day.id}`}
              checked={selectedDays.includes(day.id)}
              onCheckedChange={() => handleDayToggle(day.id)}
              disabled={disabled}
            />
            <Label htmlFor={`day-${day.id}`} className="cursor-pointer">
              {day.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekdaySelector;
