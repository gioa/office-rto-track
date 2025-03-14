
/**
 * API service for fetching weekly statistics data
 */
import { WeeklyStats } from "@/lib/types";
import { mockWeeklyStats } from "@/lib/mockData";

/**
 * Fetches weekly stats data with fallback to mock data
 */
export const fetchWeeklyStats = async (weeks: number = 10): Promise<WeeklyStats[]> => {
  try {
    // In a real application, we would fetch from an API
    // For now, we'll simulate an API call but use mock data
    
    // For demo purposes, we'll just use our mock data directly
    // No real API call is made to avoid CORS and network issues
    
    // Uncomment this code when you have a real API endpoint
    /*
    const response = await fetch('https://your-real-api-endpoint.com/stats', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return formatApiResponse(data);
    */
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return mockWeeklyStats;
    
  } catch (error) {
    console.error("Error fetching data:", error);
    // Always fall back to mock data
    return mockWeeklyStats;
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
  return mockWeeklyStats; // Fallback to mock data
};
