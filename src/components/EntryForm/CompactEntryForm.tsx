
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EntryFormSchema";
import EntryTypeSelector from "./EntryTypeSelector";
import EntryDateSelector from "./EntryDateSelector";
import EntryNoteField from "./EntryNoteField";

interface CompactEntryFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
  selectedType: string;
  handleTypeChange: (value: string) => void;
}

const CompactEntryForm = ({
  form,
  onSubmit,
  isSubmitting,
  selectedType,
  handleTypeChange,
}: CompactEntryFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EntryTypeSelector 
          control={form.control} 
          onTypeChange={handleTypeChange} 
        />
        
        <EntryDateSelector 
          control={form.control} 
          selectedType={selectedType} 
        />
        
        <EntryNoteField 
          control={form.control} 
          compact={true} 
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </form>
    </Form>
  );
};

export default CompactEntryForm;
