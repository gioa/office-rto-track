
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EntryFormSchema";
import EntryTypeSelector from "./EntryTypeSelector";
import EntryDateSelector from "./EntryDateSelector";
import EntryNoteField from "./EntryNoteField";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FullEntryFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
  selectedType: string;
  handleTypeChange: (value: string) => void;
  addAnother: boolean;
  setAddAnother: (value: boolean) => void;
}

const FullEntryForm = ({
  form,
  onSubmit,
  isSubmitting,
  selectedType,
  handleTypeChange,
  addAnother,
  setAddAnother,
}: FullEntryFormProps) => {
  const navigate = useNavigate();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FullEntryForm;
