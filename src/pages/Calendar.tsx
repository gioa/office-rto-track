
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MonthView from "@/components/Calendar/MonthView";
import { mockEntries, getEntriesForDate } from "@/lib/mockData";
import { Entry } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/data/currentUser";

const CalendarPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Filter entries to only show the current user's entries
  const userEntries = mockEntries.filter(entry => 
    entry.userId === currentUser.id || entry.userId === currentUser.email
  );
  
  const selectedEntries = getEntriesForDate(userEntries, selectedDate);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pl-16 md:pl-56 pr-0">
          <div className="container py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight animate-slide-down">Calendar</h2>
                <p className="text-muted-foreground animate-slide-down animation-delay-100">
                  View and manage your office attendance
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/add-entry')}
                className="animate-fade-in"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MonthView 
                  entries={userEntries} 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
              
              <div className="lg:col-span-1">
                <Card className="glass subtle-shadow sticky top-24 animate-slide-left animation-delay-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {format(selectedDate, "MMMM d, yyyy")}
                    </CardTitle>
                    <CardDescription>
                      {format(selectedDate, "EEEE")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedEntries.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Entries</h4>
                        <div className="space-y-2">
                          {selectedEntries.map((entry: Entry, index: number) => (
                            <div key={index} className="flex items-start p-2 rounded-md bg-background/50">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "mr-2 w-20 justify-center",
                                  entry.type === 'office-visit' && "bg-green-500/10 text-green-600 border-green-200",
                                  entry.type === 'sick' && "bg-amber-500/10 text-amber-600 border-amber-200",
                                  entry.type === 'pto' && "bg-blue-500/10 text-blue-600 border-blue-200",
                                  (entry.type === 'event' || entry.type === 'holiday') && "bg-purple-500/10 text-purple-600 border-purple-200",
                                )}
                              >
                                {formatEntryType(entry.type)}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-sm">
                                  {entry.note || 'No additional details'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No entries for this day</p>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/add-entry')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Entry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper to format entry types for display
const formatEntryType = (type: Entry['type']): string => {
  switch (type) {
    case 'office-visit': return 'Office';
    case 'sick': return 'Sick';
    case 'pto': return 'PTO';
    case 'event': return 'Event';
    case 'holiday': return 'Holiday';
    default: return type;
  }
};

export default CalendarPage;
