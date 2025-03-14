
import { Building } from "lucide-react";
import StatsCard from "./StatsCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OfficeLocation {
  name: string;
  count: number;
}

const TopOfficesCard = () => {
  const [topOffices, setTopOffices] = useState<OfficeLocation[]>([]);

  // Calculate top office locations from badge entries
  useEffect(() => {
    const fetchTopOffices = async () => {
      try {
        // Get all badge entries from Supabase - excluding weekends
        const { data, error } = await supabase
          .from('badge_entries')
          .select('office_location')
          .not('office_location', 'is', null)
          .filter('day_of_week', 'neq', 0)  // Exclude Sunday
          .filter('day_of_week', 'neq', 6);  // Exclude Saturday
        
        if (error) throw error;
        
        // Create a map to count occurrences of each office
        const officeMap = new Map<string, number>();
        
        // Process results
        if (data && Array.isArray(data)) {
          data.forEach(entry => {
            if (entry.office_location) {
              const location = entry.office_location;
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
          table: 'badge_entries'
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
  }, []);

  // Format the description text instead of using JSX elements
  const descriptionText = topOffices.map(office => 
    `${office.name}: ${office.count}`
  ).join(', ');

  return (
    <StatsCard
      title="Top Offices"
      value={topOffices[0]?.name || "N/A"}
      description={descriptionText}
      icon={Building}
    />
  );
};

export default TopOfficesCard;
