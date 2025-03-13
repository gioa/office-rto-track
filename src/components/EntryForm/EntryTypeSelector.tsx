
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { FormValues } from "./EntryFormSchema";

interface EntryTypeSelectorProps {
  control: Control<FormValues>;
  onTypeChange: (value: string) => void;
}

const EntryTypeSelector = ({ control, onTypeChange }: EntryTypeSelectorProps) => {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Entry Type</FormLabel>
          <Select onValueChange={(value) => onTypeChange(value)} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select entry type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="office-visit">Office Visit</SelectItem>
              <SelectItem value="sick">Sick Day</SelectItem>
              <SelectItem value="pto">PTO</SelectItem>
              <SelectItem value="event">Company Event</SelectItem>
              <SelectItem value="holiday">Holiday</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EntryTypeSelector;
