
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/Dashboard/FilterBar";
import Stats from "@/components/Dashboard/Stats";
import VisitChart from "@/components/Dashboard/VisitChart";
import MonthView from "@/components/Calendar/MonthView";
import EntryForm from "@/components/EntryForm/EntryForm";
import { mockEntries, mockWeeklyStats, getFilteredEntries, getEntriesForDate } from "@/lib/mockData";
import { DateRange, FilterOptions, Entry } from "@/lib/types";
import { addMonths, subMonths } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main dashboard content - left 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              <Stats entries={filteredEntries} dateRange={dateRange} />
              <VisitChart data={mockWeeklyStats} />
            </div>
            
            {/* Right sidebar with tabs for Calendar and Add Entry - right 1/3 */}
            <div className="lg:col-span-1">
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="add-entry">Add Entry</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendar" className="mt-4">
                  <Card className="glass subtle-shadow overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Calendar View</CardTitle>
                      <CardDescription>
                        View your office attendance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <MonthView 
                        entries={mockEntries} 
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="add-entry" className="mt-4">
                  <Card className="glass subtle-shadow overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Add New Entry</CardTitle>
                      <CardDescription>
                        Record office visits, sick days or PTO
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EntryForm compact={true} />
                    </CardContent>
                  </Card>
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
