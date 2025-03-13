
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DateRange } from "@/lib/types";

const formSchema = z.object({
  date: z.union([
    z.date({
      required_error: "Please select a date.",
    }),
    z.object({
      from: z.date(),
      to: z.date().optional(),
    }),
  ]),
  type: z.enum(["office-visit", "sick", "pto", "event", "holiday"], {
    required_error: "Please select an entry type.",
  }),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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

  // Custom calendar component that adapts based on entry type
  const DateSelector = ({ field }: any) => {
    const isPtoOrEvent = selectedType === "pto" || selectedType === "event";
    
    return (
      <Calendar
        mode={isPtoOrEvent ? "range" : "single"}
        selected={field.value}
        onSelect={field.onChange}
        initialFocus
        className={cn("p-3 pointer-events-auto")}
        // For office visits and sick days, we only allow weekdays
        disabled={selectedType === "office-visit" || selectedType === "sick" ? 
          (date) => date.getDay() === 0 || date.getDay() === 6 : undefined}
      />
    );
  };

  // Display selected date or date range
  const formatSelectedDate = (value: Date | DateRange) => {
    if (value instanceof Date) {
      return format(value, "MMMM d, yyyy");
    } else if ('from' in value && value.from) {
      return value.to 
        ? `${format(value.from, "MMM d")} - ${format(value.to, "MMM d, yyyy")}`
        : format(value.from, "MMMM d, yyyy");
    }
    return "Select date";
  };

  // If compact, render a simplified form directly
  if (compact) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Type</FormLabel>
                <Select onValueChange={(value) => handleTypeChange(value)} defaultValue={field.value}>
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
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date{selectedType === "pto" || selectedType === "event" ? " Range" : ""}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? formatSelectedDate(field.value) : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DateSelector field={field} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional details..."
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </form>
      </Form>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Type</FormLabel>
                  <Select onValueChange={(value) => handleTypeChange(value)} defaultValue={field.value}>
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
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date{selectedType === "pto" || selectedType === "event" ? " Range" : ""}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? formatSelectedDate(field.value) : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DateSelector field={field} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
      </CardContent>
    </Card>
  );
};

// Helper to format entry types for display
const formatEntryType = (type: string): string => {
  switch (type) {
    case 'office-visit': return 'Office Visit';
    case 'sick': return 'Sick Day';
    case 'pto': return 'PTO';
    case 'event': return 'Company Event';
    case 'holiday': return 'Holiday';
    default: return type;
  }
};

export default EntryForm;
