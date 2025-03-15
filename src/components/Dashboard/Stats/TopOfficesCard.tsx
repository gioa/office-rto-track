
import { Building } from "lucide-react";
import StatsCard from "./StatsCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "@/lib/types";
import { currentUser } from "@/lib/data/currentUser";

interface OfficeLocation {
  name: string;
  count: number;
}

interface TopOfficesCardProps {
  dateRange?: DateRange;
}

const TopOfficesCard = ({ dateRange }: TopOfficesCardProps) => {
  const [topOffices, setTopOffices] = useState<OfficeLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate top office locations from badge entries
  useEffect(() => {
    const fetchTopOffices = async () => {
      setIsLoading(true);
      try {
        // Build the query with all filters
        let query = supabase
          .from('Employee_Office_Utilization')
          .select('*')
          .not('Checked-In Office', 'is', null);
        
        // Apply date range filter if provided
        if (dateRange?.from) {
          const fromDate = dateRange.from.toISOString().split('T')[0];
          query = query.gte('Date', fromDate);
        }
        
        if (dateRange?.to) {
          const toDate = dateRange.to.toISOString().split('T')[0];
          query = query.lte('Date', toDate);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Create a map to count occurrences of each office
        const officeMap = new Map<string, number>();
        
        // Process results
        if (data && Array.isArray(data)) {
          data.forEach(entry => {
            if (entry['Checked-In Office']) {
              const location = entry['Checked-In Office'];
              officeMap.set(location, (officeMap.get(location) || 0) + 1);
            }
          });
        }
        
        // Convert map to array and sort by count
        const sortedOffices = Array.from(officeMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);  // Get top 3
        
        setTopOffices(sortedOffices.length > 0 ? sortedOffices : [
          { name: "No Data", count: 0 } 
        ]);
      } catch (error) {
        console.error("Error fetching top offices:", error);
        setTopOffices([{ name: "Error", count: 0 }]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopOffices();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Employee_Office_Utilization'
        },
        () => {
          // Refetch top offices when badge entries change
          fetchTopOffices();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [dateRange]);

  // Format the description text
  const formatDescription = () => {
    if (isLoading) return "Loading...";
    if (topOffices.length === 0) return "No data available";
    
    return topOffices
      .slice(0, 3)
      .map(office => `${office.name}: ${office.count}`)
      .join(', ');
  };

  return (
    <StatsCard
      title="Top Offices"
      value={isLoading ? "Loading..." : (topOffices[0]?.name || "N/A")}
      description={formatDescription()}
      icon={Building}
    />
  );
};

export default TopOfficesCard;
