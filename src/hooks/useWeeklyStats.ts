
import { useQuery } from "@tanstack/react-query";
import { fetchWeeklyStats } from "@/services/statsApi";
import { WeeklyStats } from "@/lib/types";

/**
 * Hook for fetching weekly stats data
 */
export const useWeeklyStats = (weeks: number = 10) => {
  return useQuery<WeeklyStats[], Error>({
    queryKey: ["weeklyStats", weeks],
    queryFn: () => fetchWeeklyStats(weeks),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
