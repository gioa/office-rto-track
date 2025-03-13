
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

interface EntryFormProps {
  compact?: boolean;
}

const EntryForm = ({ compact = false }: EntryFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("office-visit");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      type: "office-visit",
      note: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
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
    
    setIsSubmitting(false);
    form.reset();
    
    // In compact mode (sidebar), don't navigate away, just reset the form
    if (!compact) {
      navigate("/");
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
        />
      </CardContent>
    </Card>
  );
};

export default EntryForm;
