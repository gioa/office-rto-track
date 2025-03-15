
import { useState, useEffect } from "react";
import { Entry, WeeklyStats } from "@/lib/types";
import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { generateWeeklyStats } from "@/lib/data/statsGenerator";
import { currentUser } from "@/lib/data/currentUser";
import { transformWeeklyStats } from "../utils";
import { addWeeks, format, startOfWeek, endOfWeek, eachWeekOfInterval } from "date-fns";

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
      let weeksData: WeeklyStats[] = [];
      
      // If we have a date range, generate stats for all weeks in the range
      if (dateRange?.from && dateRange?.to) {
        // Create a list of all week start dates in the range
        const weekStartDates = eachWeekOfInterval({
          start: dateRange.from,
          end: dateRange.to
        }, { weekStartsOn: 0 });
        
        // Generate weekly stats for the full date range
        weeksData = generateWeeklyStats(userEntries, weekStartDates);
      } else {
        // Default behavior if no date range
        weeksData = generateWeeklyStats(userEntries);
      }
      
      // Transform the stats into chart data
      setChartData(transformWeeklyStats(weeksData, dateRange));
    } else if (apiData) {
      // Filter by currentUser.id if userId exists in the data, otherwise use all data
      // This prevents errors when the API data doesn't include userId
      const userApiData = apiData.filter(stat => 
        // If stat has userId property, filter by it, otherwise include all stats
        stat.userId ? (stat.userId === currentUser.id) : true
      );
      
      setChartData(transformWeeklyStats(userApiData, dateRange));
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
