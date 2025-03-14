
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/Dashboard/FilterBar";
import Stats from "@/components/Dashboard/Stats";
import VisitChart from "@/components/Dashboard/VisitChart";
import MonthView from "@/components/Calendar/MonthView";
import EntryFormDialog from "@/components/EntryForm/EntryFormDialog";
import LogTable from "@/components/Dashboard/LogTable";
import PlannedDaysManager from "@/components/PlannedDays/PlannedDaysManager";
import { mockEntries } from "@/lib/mockData";
import { DateRange, FilterOptions, Entry, PlannedDay } from "@/lib/types";
import { subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFilteredEntries, getEntriesForDate } from "@/lib/utils/entryFilters";

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
  
  // Set up selected date for calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Set up planned days
  const [plannedDays, setPlannedDays] = useState<PlannedDay[]>([]);
  
  // Filtered entries based on filters
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>(mockEntries);
  
  // Selected entries for the calendar view
  const [selectedEntries, setSelectedEntries] = useState<Entry[]>([]);
  
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
  
  // Update selected entries when selected date or filtered entries change
  useEffect(() => {
    setSelectedEntries(getEntriesForDate(filteredEntries, selectedDate));
  }, [selectedDate, filteredEntries]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <main className="flex-1">
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main dashboard content - left 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-4">
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
              
              <Stats entries={filteredEntries} dateRange={dateRange} />
              
              {/* Pass the filtered entries to the chart */}
              <VisitChart entries={filteredEntries} dateRange={dateRange} />
              
              {/* Add Log Table below the chart */}
              <LogTable entries={filteredEntries} />
            </div>
            
            {/* Right sidebar with calendar and planned days - right 1/3 */}
            <div className="lg:col-span-1 space-y-6">
              {/* Calendar Card */}
              <Card className="glass subtle-shadow overflow-hidden">
                <CardContent className="p-0">
                  <MonthView 
                    entries={filteredEntries} 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    plannedDays={plannedDays}
                  />
                </CardContent>
              </Card>
              
              {/* Planned Days Card */}
              <Card className="glass subtle-shadow overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">In-Office Plan</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <PlannedDaysManager onDaysChange={setPlannedDays} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
