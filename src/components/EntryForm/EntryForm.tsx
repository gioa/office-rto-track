
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
import { currentUser } from "@/lib/data/currentUser";

interface EntryFormProps {
  compact?: boolean;
  initialDate?: Date;
  onSubmitComplete?: (keepOpen: boolean) => void;
  addEntry?: UseMutationResult<any, Error, { type: string; date: Date; note?: string; officeLocation?: string; isTempBadge?: boolean }, unknown>;
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
      // Default office location based on user or random selection
      const officeLocations = ['San Francisco', 'New York', 'Mountain View'];
      const defaultOffice = officeLocations[Math.floor(Math.random() * officeLocations.length)];
      
      if (addEntry) {
        await addEntry.mutateAsync({ 
          type: values.type, 
          date: values.date, 
          note: values.note,
          officeLocation: values.type === 'office-visit' ? defaultOffice : undefined,
          isTempBadge: values.type === 'office-visit' ? true : undefined
        });
      }
      
      toast({
        title: "Entry added successfully",
        description: (
          <div className="mt-2 w-[340px] rounded-md p-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>
                {format(values.date, "MMMM d, yyyy")} - {formatEntryType(values.type)}
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
      
      if (onSubmitComplete) {
        onSubmitComplete(addAnother);
      }
      
      if (addAnother || !compact) {
        form.reset({
          date: initialDate || new Date(),
          type: values.type,
          note: "",
        });
      }
      
      if (!compact && !addAnother) {
        navigate("/");
      }
    }
  };

  const handleTypeChange = (value: string) => {
    form.setValue("type", value as any);
    setSelectedType(value);
    // No date modification needed as we only use single date selection now
  };

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
