
/**
 * API service for fetching weekly statistics data
 */
import { WeeklyStats } from "@/lib/types";
import { getWeeklyStats } from "./localStorageService";

/**
 * Fetches weekly stats data with fallback to local data
 */
export const fetchWeeklyStats = async (weeks: number = 10): Promise<WeeklyStats[]> => {
  try {
    // In a real application, we would fetch from an API
    // const response = await fetch('https://your-real-api-endpoint.com/stats');
    // if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    // const data = await response.json();
    // return formatApiResponse(data);
    
    // For now, get data from local storage
    return getWeeklyStats();
    
  } catch (error) {
    console.error("Error fetching stats data:", error);
    // Fall back to local data
    return getWeeklyStats();
  }
};

/**
 * Transforms API response to match the WeeklyStats interface
 */
const formatApiResponse = (data: any): WeeklyStats[] => {
  // Handle API response format when you have a real API
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
  return getWeeklyStats(); // Fallback to local data
};
