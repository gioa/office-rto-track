
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterBar from "@/components/Dashboard/FilterBar";
import Stats from "@/components/Dashboard/Stats";
import VisitChart from "@/components/Dashboard/VisitChart";
import MonthView from "@/components/Calendar/MonthView";
import EntryFormDialog from "@/components/EntryForm/EntryFormDialog";
import LogTable from "@/components/Dashboard/LogTable";
import PlannedDaysManager from "@/components/PlannedDays/PlannedDaysManager";
import { DateRange, FilterOptions, Entry, PlannedDay } from "@/lib/types";
import { subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFilteredEntries, getEntriesForDate } from "@/lib/utils/entryFilters";
import { useEntries } from "@/hooks/entries";
import { FadeIn, ScaleIn } from "@/utils/animations";
import { currentUser } from "@/lib/data/currentUser";

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const IndexContent = () => {
  // Set up initial date range (last 3 months)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });
  
  // Set up filters
  const [includeSick, setIncludeSick] = useState(true);
  const [includePto, setIncludePto] = useState(true);
  const [includeEvents, setIncludeEvents] = useState(true);
  const [includeHolidays, setIncludeHolidays] = useState(true);
  
  // Filter options
  const filterOptions: FilterOptions = {
    dateRange,
    includeSick,
    includePto,
    includeEvents,
    includeHolidays,
  };
  
  // Get entries using the hook
  const { entries: allEntries, isLoading } = useEntries(filterOptions);
  
  // Filter entries to only show the current user's entries
  const filteredEntries = allEntries.filter(entry => 
    entry.userId === currentUser.id || entry.userId === currentUser.email
  );
  
  // Set up selected date for calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Set up planned days
  const [plannedDays, setPlannedDays] = useState<PlannedDay[]>([]);
  
  // Selected entries for the calendar view
  const [selectedEntries, setSelectedEntries] = useState<Entry[]>([]);
  
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
              <FadeIn>
                <div className="mb-4">
                  <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                  <p className="text-muted-foreground">
                    Track and manage your Return-to-Office attendance
                  </p>
                </div>
              </FadeIn>
              
              <ScaleIn delay={0.1}>
                <FilterBar 
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  includeSick={includeSick}
                  setIncludeSick={setIncludeSick}
                  includePto={includePto}
                  setIncludePto={setIncludePto}
                  includeEvents={includeEvents}
                  setIncludeEvents={setIncludeEvents}
                  includeHolidays={includeHolidays}
                  setIncludeHolidays={setIncludeHolidays}
                />
              </ScaleIn>
              
              <ScaleIn delay={0.2}>
                <Stats entries={filteredEntries} dateRange={dateRange} />
              </ScaleIn>
              
              <ScaleIn delay={0.3}>
                <VisitChart entries={filteredEntries} dateRange={dateRange} />
              </ScaleIn>
              
              <ScaleIn delay={0.4}>
                <LogTable entries={filteredEntries} />
              </ScaleIn>
            </div>
            
            {/* Right sidebar with calendar and planned days - right 1/3 */}
            <div className="lg:col-span-1 space-y-6">
              <ScaleIn delay={0.2}>
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
              </ScaleIn>
              
              <ScaleIn delay={0.3}>
                {/* Planned Days Card */}
                <Card className="glass subtle-shadow overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">In-Office Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <PlannedDaysManager onDaysChange={setPlannedDays} />
                  </CardContent>
                </Card>
              </ScaleIn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap the app with QueryClientProvider
const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <IndexContent />
    </QueryClientProvider>
  );
};

export default Index;
