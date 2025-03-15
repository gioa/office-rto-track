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
      const date = typeof values.date === 'object' && 'from' in values.date 
        ? values.date.from 
        : values.date as Date;
      
      // Default office location based on user or random selection
      const officeLocations = ['San Francisco', 'New York', 'Mountain View'];
      const defaultOffice = officeLocations[Math.floor(Math.random() * officeLocations.length)];
      
      if (typeof values.date === 'object' && 'from' in values.date && values.date.to && addEntry) {
        const startDate = new Date(values.date.from);
        const endDate = new Date(values.date.to);
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dayOfWeek = d.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;
          
          await addEntry.mutateAsync({ 
            type: values.type, 
            date: new Date(d), 
            note: values.note,
            officeLocation: values.type === 'office-visit' ? defaultOffice : undefined,
            isTempBadge: values.type === 'office-visit' ? true : undefined
          });
        }
      } else if (addEntry) {
        await addEntry.mutateAsync({ 
          type: values.type, 
          date, 
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
    
    // Get current date value from form
    const currentDate = form.getValues("date");
    
    // Only transform the date structure if the type is changing between single/range types
    // and preserve the current date selection
    if ((value === "pto" || value === "event") && 
        !(typeof currentDate === 'object' && 'from' in currentDate)) {
      // Convert single date to date range
      form.setValue("date", { 
        from: typeof currentDate === 'object' ? new Date(currentDate as Date) : new Date(), 
        to: undefined 
      });
    } else if (value !== "pto" && value !== "event" && 
              typeof currentDate === 'object' && 'from' in currentDate) {
      // Convert date range to single date, using 'from' date as the value
      form.setValue("date", new Date(currentDate.from));
    }
    // Otherwise keep the current date value
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
