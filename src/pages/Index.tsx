
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FilterBar from "@/components/Dashboard/FilterBar";
import Stats from "@/components/Dashboard/Stats";
import VisitChart from "@/components/Dashboard/VisitChart";
import { mockEntries, mockWeeklyStats, getFilteredEntries } from "@/lib/mockData";
import { DateRange, FilterOptions } from "@/lib/types";
import { addMonths, subMonths } from "date-fns";

const Index = () => {
  // Set up initial date range (last 3 months)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });
  
  // Set up filters
  const [includeSick, setIncludeSick] = useState(true);
  const [includePto, setIncludePto] = useState(true);
  const [includeEvents, setIncludeEvents] = useState(true);
  
  // Filtered entries based on filters
  const [filteredEntries, setFilteredEntries] = useState(mockEntries);
  
  // Update filtered entries when filters change
  useEffect(() => {
    const newFilteredEntries = getFilteredEntries(mockEntries, {
      dateRange,
      includeSick,
      includePto,
      includeEvents,
    });
    
    setFilteredEntries(newFilteredEntries);
  }, [dateRange, includeSick, includePto, includeEvents]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pl-16 md:pl-56 pr-0">
          <div className="container py-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight animate-slide-down">Dashboard</h2>
              <p className="text-muted-foreground animate-slide-down animation-delay-100">
                Track and manage your Return-to-Office attendance
              </p>
            </div>
            
            <FilterBar 
              dateRange={dateRange}
              setDateRange={setDateRange}
              includeSick={includeSick}
              setIncludeSick={setIncludeSick}
              includePto={includePto}
              setIncludePto={setIncludePto}
              includeEvents={includeEvents}
              setIncludeEvents={setIncludeEvents}
            />
            
            <div className="space-y-6">
              <Stats entries={filteredEntries} dateRange={dateRange} />
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <VisitChart data={mockWeeklyStats} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
