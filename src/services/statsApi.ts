
/**
 * API service for fetching weekly statistics data from external data sources
 * (Snowflake, Databricks, etc.)
 */

import { WeeklyStats } from "@/lib/types";

// Configuration for your API - update these values for your environment
// Ideally these would come from environment variables in a production setting
const API_CONFIG = {
  // Base URL for your API gateway or serverless function that connects to Snowflake/Databricks
  BASE_URL: "https://your-api-gateway.example.com",
  
  // Endpoints
  ENDPOINTS: {
    WEEKLY_STATS: "/weekly-stats",
  },
  
  // Authentication - if your API requires authentication
  // For example, you might need an API key or token
  AUTH: {
    API_KEY: "your-api-key-here", // Replace with your actual API key or use env variables
    HEADER_NAME: "x-api-key", // The header name for your API key
  }
};

/**
 * Fetches weekly stats from the external data source via API
 * @param weeks Number of weeks of data to fetch
 * @returns Promise with the weekly stats data
 */
export const fetchWeeklyStats = async (weeks: number = 10): Promise<WeeklyStats[]> => {
  try {
    // Construct request URL with query parameters
    const url = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEEKLY_STATS}`);
    url.searchParams.append("weeks", weeks.toString());
    
    // Prepare headers if authentication is required
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    // Add authentication if configured
    if (API_CONFIG.AUTH.API_KEY) {
      headers[API_CONFIG.AUTH.HEADER_NAME] = API_CONFIG.AUTH.API_KEY;
    }
    
    // Make the API request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weekly stats: ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // If your API returns data in a different format than WeeklyStats[],
    // you would transform it here to match your application's expected format
    return transformResponseToWeeklyStats(data);
    
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    
    // For development or as a fallback, use mock data
    // In production, you might want to handle this differently
    const { mockWeeklyStats } = await import("@/lib/mockData");
    return mockWeeklyStats;
  }
};

/**
 * Transforms API response to match the WeeklyStats interface
 * Modify this function based on your actual API response format
 */
const transformResponseToWeeklyStats = (data: any): WeeklyStats[] => {
  // If your API already returns data in the expected format, just return it
  if (Array.isArray(data) && data.length > 0 && 'weekOf' in data[0]) {
    return data;
  }
  
  // Example transformation for a hypothetical Snowflake API response
  // where data might be nested under a 'results' property
  if (data.results && Array.isArray(data.results)) {
    return data.results.map((item: any) => ({
      weekOf: new Date(item.week_start_date || item.weekOf),
      daysInOffice: Number(item.days_in_office || item.daysInOffice || 0),
      totalWorkDays: Number(item.total_work_days || item.totalWorkDays || 5),
      percentage: Number(item.attendance_percentage || item.percentage || 0),
    }));
  }
  
  // If no transformation matches, return empty array
  console.error("Unable to transform API response to WeeklyStats format", data);
  return [];
};
