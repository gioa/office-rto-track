
/**
 * API service for fetching weekly statistics data
 */

import { WeeklyStats } from "@/lib/types";

// Base URL for your API - replace with your actual API URL
const API_BASE_URL = "https://api.example.com";

/**
 * Fetches weekly stats from the API
 * @param weeks Number of weeks of data to fetch
 * @returns Promise with the weekly stats data
 */
export const fetchWeeklyStats = async (weeks: number = 10): Promise<WeeklyStats[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/weekly-stats?weeks=${weeks}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weekly stats: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    // For now, fall back to the mock data if API fails
    // In production, you might want to handle this differently
    const { mockWeeklyStats } = await import("@/lib/mockData");
    return mockWeeklyStats;
  }
};
