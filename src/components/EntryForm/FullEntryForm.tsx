
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EntryFormSchema";
import EntryTypeSelector from "./EntryTypeSelector";
import EntryDateSelector from "./EntryDateSelector";
import EntryNoteField from "./EntryNoteField";
import { useNavigate } from "react-router-dom";

interface FullEntryFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
  selectedType: string;
  handleTypeChange: (value: string) => void;
}

const FullEntryForm = ({
  form,
  onSubmit,
  isSubmitting,
  selectedType,
  handleTypeChange,
}: FullEntryFormProps) => {
  const navigate = useNavigate();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        />
        
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
