
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EntryFormSchema";
import EntryTypeSelector from "./EntryTypeSelector";
import EntryDateSelector from "./EntryDateSelector";
import EntryNoteField from "./EntryNoteField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CompactEntryFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
  selectedType: string;
  handleTypeChange: (value: string) => void;
  addAnother: boolean;
  setAddAnother: (value: boolean) => void;
}

const CompactEntryForm = ({
  form,
  onSubmit,
  isSubmitting,
  selectedType,
  handleTypeChange,
  addAnother,
  setAddAnother,
}: CompactEntryFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EntryDateSelector 
          control={form.control} 
          selectedType={selectedType} 
        />
        
        <EntryTypeSelector 
          control={form.control} 
          onTypeChange={handleTypeChange} 
        />
        
        <EntryNoteField 
          control={form.control} 
          compact={true} 
        />
        
        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="addAnother" 
            checked={addAnother}
            onCheckedChange={(checked) => setAddAnother(checked === true)}
          />
          <Label 
            htmlFor="addAnother" 
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Add another entry
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </form>
    </Form>
  );
};

export default CompactEntryForm;
