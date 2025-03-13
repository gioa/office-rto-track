
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/Dashboard/FilterBar";
import Stats from "@/components/Dashboard/Stats";
import VisitChart from "@/components/Dashboard/VisitChart";
import MonthView from "@/components/Calendar/MonthView";
import EntryForm from "@/components/EntryForm/EntryForm";
import LogTable from "@/components/Dashboard/LogTable";
import PlannedDaysManager from "@/components/PlannedDays/PlannedDaysManager";
import { mockEntries, mockWeeklyStats, getFilteredEntries, getEntriesForDate } from "@/lib/mockData";
import { DateRange, FilterOptions, Entry, PlannedDay } from "@/lib/types";
import { subMonths } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Calendar as CalendarIcon } from "lucide-react";

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
  const selectedEntries = getEntriesForDate(mockEntries, selectedDate);
  
  // Set up planned days
  const [plannedDays, setPlannedDays] = useState<PlannedDay[]>([]);
  
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
              <VisitChart data={mockWeeklyStats} />
              
              {/* Add Log Table below the chart */}
              <LogTable entries={filteredEntries} />
            </div>
            
            {/* Right sidebar with tabs for Calendar, Add Entry, and Planned Days - right 1/3 */}
            <div className="lg:col-span-1">
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="calendar" className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Calendar</span>
                  </TabsTrigger>
                  <TabsTrigger value="add-entry" className="flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Add Entry</span>
                  </TabsTrigger>
                  <TabsTrigger value="planned" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Plan</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendar" className="mt-4">
                  <Card className="glass subtle-shadow overflow-hidden">
                    <CardContent className="p-0">
                      <MonthView 
                        entries={mockEntries} 
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        plannedDays={plannedDays}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="add-entry" className="mt-4">
                  <Card className="glass subtle-shadow overflow-hidden">
                    <CardContent className="p-4">
                      <EntryForm compact={true} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="planned" className="mt-4">
                  <PlannedDaysManager onDaysChange={setPlannedDays} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
