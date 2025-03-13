
import { useQuery } from "@tanstack/react-query";
import { fetchWeeklyStats } from "@/services/statsApi";
import { WeeklyStats } from "@/lib/types";

/**
 * Custom hook for fetching weekly stats data
 * @param weeks Number of weeks of data to fetch
 */
export const useWeeklyStats = (weeks: number = 10) => {
  return useQuery<WeeklyStats[], Error>({
    queryKey: ["weeklyStats", weeks],
    queryFn: () => fetchWeeklyStats(weeks),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refresh data when user focuses window
  });
};
