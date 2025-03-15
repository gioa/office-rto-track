
export type EntryType = 'office-visit' | 'sick' | 'pto' | 'event' | 'holiday';

export interface Entry {
  id: string;
  date: Date;
  type: EntryType;
  note?: string;
  userId: string; // For actual user identification in a real app
  officeLocation?: string; // Added office location property
  isTempBadge?: boolean; // Indicates if it's a temp badge or actual badge swipe
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
  includeHolidays: boolean;
}

export interface WeeklyStats {
  weekOf: Date;
  daysInOffice: number;
  totalWorkDays: number;
  percentage: number;
  sickDays?: number;
  ptoDays?: number;
  eventDays?: number;
  holidayDays?: number;
  userId?: string; // Added userId property to support filtering by user
}

export interface PlannedDay {
  userId: string;
  userName: string;
  weekday: number; // 0 for Sunday, 1 for Monday, etc.
  department?: string;
}

// New interfaces for our data model

export interface BadgeEntry {
  id: string;
  email: string;
  date: Date;
  dayOfWeek: number; // 0-6 representing Sunday-Saturday
  officeLocation?: string;
  checkinTime?: Date;
  checkoutTime?: Date;
}

export interface UserEntry {
  id: string;
  email: string;
  date: Date;
  dayOfWeek: number; // 0-6 representing Sunday-Saturday
  type: EntryType; // Using the existing EntryType for consistency
  note?: string;
  isTempBadge?: boolean; // New field to distinguish manually entered office visits
}

export interface UserPlannedDays {
  id: string;
  userId: string;
  email: string;
  plannedDays: number[]; // Array of weekday numbers (0-6)
  effectiveFrom?: Date; // Optional start date for this plan
  effectiveTo?: Date; // Optional end date for this plan
}
