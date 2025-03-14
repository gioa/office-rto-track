
/**
 * API service for fetching weekly statistics data from external data sources
 * (Snowflake, Databricks, etc.)
 */

import { WeeklyStats } from "@/lib/types";

// Simple configuration object - update these with your actual values
const API_CONFIG = {
  baseUrl: "https://your-api-gateway.example.com",
  endpoint: "/weekly-stats",
  apiKey: "your-api-key-here", // Replace with your actual API key
};

/**
 * Fetches weekly stats from the external data source (Snowflake/Databricks)
 * @param weeks Number of weeks of data to fetch
 * @returns Promise with the weekly stats data
 */
export const fetchWeeklyStats = async (weeks: number = 10): Promise<WeeklyStats[]> => {
  try {
    // Build request URL and headers
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoint}?weeks=${weeks}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-api-key": API_CONFIG.apiKey,
    };
    
    // Make the API request
    const response = await fetch(url, { method: "GET", headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return formatApiResponse(data);
    
  } catch (error) {
    console.error("Error fetching data:", error);
    
    // Fallback to mock data during development
    const { mockWeeklyStats } = await import("@/lib/mockData");
    return mockWeeklyStats;
  }
};

/**
 * Transforms API response to match the WeeklyStats interface
 */
const formatApiResponse = (data: any): WeeklyStats[] => {
  // If data is already in the correct format
  if (Array.isArray(data) && data.length > 0 && 'weekOf' in data[0]) {
    return data;
  }
  
  // Handle Snowflake/Databricks response format
  if (data.results && Array.isArray(data.results)) {
    return data.results.map((item: any) => ({
      weekOf: new Date(item.week_start_date || item.weekOf),
      daysInOffice: Number(item.days_in_office || item.daysInOffice || 0),
      totalWorkDays: Number(item.total_work_days || item.totalWorkDays || 5),
      percentage: Number(item.attendance_percentage || item.percentage || 0),
    }));
  }
  
  console.error("Unable to process API response format", data);
  return [];
};
