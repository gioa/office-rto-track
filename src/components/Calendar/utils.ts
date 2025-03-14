
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

// Helper to consistently determine if a date is a weekend
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

export const getEntriesForDay = (entries: Entry[], day: Date) => {
  // For weekend days, always return empty array
  if (isWeekend(day)) {
    return [];
  }
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return isSameDay(entryDate, day);
  });
};

export const getFirstEntryType = (entries: Entry[], day: Date) => {
  // For weekend days, always return null
  if (isWeekend(day)) {
    return null;
  }
  
  const dayEntries = getEntriesForDay(entries, day);
  return dayEntries.length > 0 ? dayEntries[0].type : null;
};

export const hasEntryType = (entries: Entry[], day: Date, type: Entry['type']) => {
  // For weekend days, always return false
  if (isWeekend(day)) {
    return false;
  }
  
  return entries.some(entry => {
    const entryDate = new Date(entry.date);
    return isSameDay(entryDate, day) && entry.type === type;
  });
};
