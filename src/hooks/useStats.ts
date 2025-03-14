
/**
 * Hook for working with statistics data
 */
import { useQuery } from '@tanstack/react-query';
import { WeeklyStats } from '@/lib/types';
import * as localStorageService from '@/services/localStorageService';

// Query key for stats
const STATS_QUERY_KEY = 'weekly-stats';

export const useStats = () => {
  // Query for getting weekly stats
  const { data: weeklyStats = [], isLoading, error } = useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: localStorageService.getWeeklyStats,
  });
  
  return {
    weeklyStats,
    isLoading,
    error,
  };
};
