
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
    <div className="space-y-2">
      <p className="text-sm font-medium mb-2">Select your planned office days:</p>
      <div className="flex gap-2 justify-between">
        {weekdays.map((day) => (
          <div 
            key={day.id} 
            className={cn(
              "flex flex-col items-center justify-center rounded-md border p-2 w-12 h-12 transition-colors",
              selectedDays.includes(day.id) ? "border-primary/50 bg-primary/5" : "border-input",
              disabled && "opacity-50"
            )}
            title={day.fullName}
          >
            <span className="text-sm font-medium mb-1">{day.name}</span>
            <Checkbox
              id={`day-${day.id}`}
              checked={selectedDays.includes(day.id)}
              onCheckedChange={() => handleDayToggle(day.id)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekdaySelector;
