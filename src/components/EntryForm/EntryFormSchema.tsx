
import { z } from "zod";
import { DateRange } from "@/lib/types";

export const formSchema = z.object({
  date: z.union([
    z.date({
      required_error: "Please select a date.",
    }),
    z.object({
      from: z.date(),
      to: z.date().optional(),
    }).transform((data): DateRange => ({
      from: data.from,
      to: data.to || undefined
    })),
  ]),
  type: z.enum(["office-visit", "sick", "pto", "event", "holiday"], {
    required_error: "Please select an entry type.",
  }),
  note: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

// Helper to format entry types for display
export const formatEntryType = (type: string): string => {
  switch (type) {
    case 'office-visit': return 'Office Visit (Temp Badge)'; // Updated to always show temp badge label
    case 'sick': return 'Sick Day';
    case 'pto': return 'PTO';
    case 'event': return 'Company Event';
    case 'holiday': return 'Holiday';
    default: return type;
  }
};
