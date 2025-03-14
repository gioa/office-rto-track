/**
 * API service for fetching weekly statistics data
 */
import { WeeklyStats } from "@/lib/types";
import { getWeeklyStats } from "./localStorage/entries";

/**
 * Fetches weekly stats data with fallback to local data
 */
export const fetchWeeklyStats = async (weeks: number = 10): Promise<WeeklyStats[]> => {
  try {
    // Now using Supabase via our data layer
    return await getWeeklyStats();
  } catch (error) {
    console.error("Error fetching stats data:", error);
    // Fall back to empty array in case of error
    return [];
  }
};

/**
 * Transforms API response to match the WeeklyStats interface - no longer needed
 * as we're working directly with our data model now
 */
const formatApiResponse = (data: any): WeeklyStats[] => {
  // Keep for backward compatibility
  if (Array.isArray(data) && data.length > 0 && 'weekOf' in data[0]) {
    return data;
  }
  
  if (data.results && Array.isArray(data.results)) {
    return data.results.map((item: any) => ({
      weekOf: new Date(item.week_start_date || item.weekOf),
      daysInOffice: Number(item.days_in_office || item.daysInOffice || 0),
      totalWorkDays: Number(item.total_work_days || item.totalWorkDays || 5),
      percentage: Number(item.attendance_percentage || item.percentage || 0),
    }));
  }
  
  console.error("Unable to process API response format", data);
  return []; // Return empty array instead of falling back
};
