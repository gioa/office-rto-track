
export type EntryType = 'office-visit' | 'sick' | 'pto' | 'event' | 'holiday';

export interface Entry {
  id: string;
  date: Date;
  type: EntryType;
  note?: string;
  userId: string; // For actual user identification in a real app
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  isAdmin: boolean;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface FilterOptions {
  dateRange: DateRange;
  includeSick: boolean;
  includePto: boolean;
  includeEvents: boolean;
}

export interface WeeklyStats {
  weekOf: Date;
  daysInOffice: number;
  totalWorkDays: number;
  percentage: number;
}
