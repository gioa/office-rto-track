
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PlannedDay } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Building, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Sample mock data for demo purposes
const mockPeople = [
  { userId: "user1", userName: "Alice Johnson", department: "Engineering", days: [1, 3, 5] },
  { userId: "user2", userName: "Bob Smith", department: "Design", days: [2, 4] },
  { userId: "user3", userName: "Charlie Brown", department: "Marketing", days: [1, 2, 5] },
  { userId: "user4", userName: "David Lee", department: "Product", days: [1, 3] },
  { userId: "user5", userName: "Eva Green", department: "Engineering", days: [2, 5] },
  { userId: "user6", userName: "Frank Hill", department: "HR", days: [1, 4] },
];

interface PeoplePlannerProps {
  onShowPersonDays: (plannedDays: PlannedDay[]) => void;
}

const PeoplePlanner = ({ onShowPersonDays }: PeoplePlannerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsLoading(true);
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleShowPersonDays = (person: typeof mockPeople[0]) => {
    // Convert the days array to PlannedDay objects
    const plannedDays = person.days.map(day => ({
      userId: person.userId,
      userName: person.userName,
      weekday: day,
      department: person.department
    }));
    
    onShowPersonDays(plannedDays);
  };
  
  // Filter people by search term
  const filteredPeople = mockPeople.filter(
    person => 
      person.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search colleagues..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[240px] rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPeople.length > 0 ? (
          <div className="p-2">
            {filteredPeople.map((person) => (
              <button
                key={person.userId}
                onClick={() => handleShowPersonDays(person)}
                className="flex items-start p-2 w-full text-left rounded-md hover:bg-accent transition-colors"
              >
                <div className="mr-3 mt-1 bg-primary/10 p-1.5 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{person.userName}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Building className="h-3 w-3 mr-1" />
                    <span>{person.department}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {person.days.map((day) => (
                      <span
                        key={day}
                        className="text-xs px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary"
                      >
                        {getDayLabel(day)}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground text-sm">No results found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// Helper to get short day labels
const getDayLabel = (day: number): string => {
  switch (day) {
    case 1: return "Mon";
    case 2: return "Tue";
    case 3: return "Wed";
    case 4: return "Thu";
    case 5: return "Fri";
    default: return "";
  }
};

export default PeoplePlanner;
