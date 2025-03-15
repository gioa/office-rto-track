
import { useState, useEffect } from "react";
import { Entry, WeeklyStats } from "@/lib/types";
import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { generateWeeklyStats } from "@/lib/data/statsGenerator";
import { currentUser } from "@/lib/data/currentUser";
import { transformWeeklyStats } from "../utils";

interface UseChartDataProps {
  entries?: Entry[];
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const useChartData = ({ entries, dateRange }: UseChartDataProps) => {
  const { data: apiData, isLoading, error } = useWeeklyStats(10);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    const userEntries = entries ? entries.filter(entry => 
      entry.userId === currentUser.id || entry.userId === currentUser.email
    ) : [];
    
    if (userEntries && userEntries.length > 0) {
      const filteredStats = generateWeeklyStats(userEntries);
      setChartData(transformWeeklyStats(filteredStats));
    } else if (apiData) {
      // Filter by currentUser.id if userId exists in the data, otherwise use all data
      // This prevents errors when the API data doesn't include userId
      const userApiData = apiData.filter(stat => 
        // If stat has userId property, filter by it, otherwise include all stats
        stat.userId ? (stat.userId === currentUser.id) : true
      );
      setChartData(transformWeeklyStats(userApiData));
    } else {
      setChartData([]);
    }
  }, [entries, dateRange, apiData]);

  return {
    chartData,
    isLoading,
    error
  };
};
