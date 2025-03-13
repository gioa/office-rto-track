
import { Entry } from "@/lib/types";
import { isSameDay } from "date-fns";

export const formatEntryType = (type: Entry['type']): string => {
  switch (type) {
    case 'office-visit': return 'Office';
    case 'sick': return 'Sick';
    case 'pto': return 'PTO';
    case 'event': return 'Event';
    case 'holiday': return 'Holiday';
    default: return type;
  }
};

export const getEntriesForDay = (entries: Entry[], day: Date) => {
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return isSameDay(entryDate, day);
  });
};

export const getFirstEntryType = (entries: Entry[], day: Date) => {
  const dayEntries = getEntriesForDay(entries, day);
  return dayEntries.length > 0 ? dayEntries[0].type : null;
};

export const hasEntryType = (entries: Entry[], day: Date, type: Entry['type']) => {
  return entries.some(entry => {
    const entryDate = new Date(entry.date);
    return isSameDay(entryDate, day) && entry.type === type;
  });
};
