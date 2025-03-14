import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { formSchema, FormValues, formatEntryType } from "./EntryFormSchema";
import CompactEntryForm from "./CompactEntryForm";
import FullEntryForm from "./FullEntryForm";
import { UseMutationResult } from "@tanstack/react-query";

interface EntryFormProps {
  compact?: boolean;
  initialDate?: Date;
  onSubmitComplete?: (keepOpen: boolean) => void;
  addEntry?: UseMutationResult<any, Error, { type: string; date: Date; note?: string }, unknown>;
}

const EntryForm = ({ 
  compact = false, 
  initialDate, 
  onSubmitComplete,
  addEntry 
}: EntryFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("office-visit");
  const [addAnother, setAddAnother] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialDate || new Date(),
      type: "office-visit",
      note: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Handle the different date formats (single date or date range)
      const date = typeof values.date === 'object' && 'from' in values.date 
        ? values.date.from 
        : values.date as Date;
      
      // If it's a date range and we have the addEntry mutation
      if (typeof values.date === 'object' && 'from' in values.date && values.date.to && addEntry) {
        // Create an entry for each day in the range
        const startDate = new Date(values.date.from);
        const endDate = new Date(values.date.to);
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          // Skip weekends
          const dayOfWeek = d.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;
          
          // Use the addEntry mutation from useEntries hook
          await addEntry.mutateAsync({ 
            type: values.type, 
            date: new Date(d), 
            note: values.note 
          });
        }
      } else if (addEntry) {
        // Single day entry using the addEntry mutation
        await addEntry.mutateAsync({ 
          type: values.type, 
          date, 
          note: values.note 
        });
      }
      
      // Show success message
      toast({
        title: "Entry added successfully",
        description: (
          <div className="mt-2 w-[340px] rounded-md p-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>
                {typeof values.date === 'object' && 'from' in values.date 
                  ? `${format(values.date.from, "MMMM d, yyyy")} ${values.date.to ? `- ${format(values.date.to, "MMMM d, yyyy")}` : ''}`
                  : format(values.date as Date, "MMMM d, yyyy")} - {formatEntryType(values.type)}
              </span>
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Error adding entry",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      
      // Keep modal open if adding another entry, otherwise close it
      if (onSubmitComplete) {
        onSubmitComplete(addAnother);
      }
      
      // Reset form if we're adding another entry or if we're in standalone mode
      if (addAnother || !compact) {
        form.reset({
          date: initialDate || new Date(),
          type: values.type, // Maintain the same type for convenience
          note: "",
        });
      }
      
      // In compact mode (sidebar), don't navigate away if not adding another
      // Only navigate away if we're in the full form mode and not adding another
      if (!compact && !addAnother) {
        navigate("/");
      }
    }
  };

  const handleTypeChange = (value: string) => {
    form.setValue("type", value as any);
    setSelectedType(value);
    
    // Reset the date field when switching between single and range modes
    if (value === "pto" || value === "event") {
      form.setValue("date", { from: new Date(), to: undefined });
    } else {
      form.setValue("date", new Date());
    }
  };

  // If compact, render a simplified form directly
  if (compact) {
    return (
      <CompactEntryForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        selectedType={selectedType}
        handleTypeChange={handleTypeChange}
        addAnother={addAnother}
        setAddAnother={setAddAnother}
      />
    );
  }

  // Full form with card wrapper for the standalone page
  return (
    <Card className="glass subtle-shadow max-w-xl w-full mx-auto mt-8 animate-scale-in">
      <CardHeader>
        <CardTitle>Add New Entry</CardTitle>
        <CardDescription>
          Record a new office visit, sick day, PTO, or company event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FullEntryForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          selectedType={selectedType}
          handleTypeChange={handleTypeChange}
          addAnother={addAnother}
          setAddAnother={setAddAnother}
        />
      </CardContent>
    </Card>
  );
};

export default EntryForm;
