
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { FormValues } from "./EntryFormSchema";

interface EntryNoteFieldProps {
  control: Control<FormValues>;
  compact?: boolean;
}

const EntryNoteField = ({ control, compact = false }: EntryNoteFieldProps) => {
  return (
    <FormField
      control={control}
      name="note"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes (Optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Add any additional details..."
              className={`resize-none ${compact ? "h-20" : ""}`}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EntryNoteField;
