
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { PlannedDay } from "@/lib/types";
import WeekdaySelector from "./WeekdaySelector";
import PeoplePlanner from "./PeoplePlanner";
import { UserCheck, Users, Save } from "lucide-react";

interface PlannedDaysManagerProps {
  onDaysChange: (plannedDays: PlannedDay[]) => void;
}

const PlannedDaysManager = ({ onDaysChange }: PlannedDaysManagerProps) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]); // Default to Mon, Wed, Fri
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otherPlannedDays, setOtherPlannedDays] = useState<PlannedDay[]>([]);
  
  // Initialize planned days on component mount
  useEffect(() => {
    const currentUserDays = selectedDays.map(day => ({
      userId: "current-user",
      userName: "You",
      weekday: day
    }));
    
    onDaysChange(currentUserDays);
  }, []);
  
  const handleSavePlannedDays = () => {
    setIsSubmitting(true);
    
    // Convert selected days to PlannedDay objects for the current user
    const plannedDays = selectedDays.map(day => ({
      userId: "current-user", 
      userName: "You",
      weekday: day
    }));
    
    // Simulate API call
    setTimeout(() => {
      onDaysChange(plannedDays);
      setIsSubmitting(false);
      toast({
        title: "Planned days updated",
        description: "Your planned office days have been saved.",
      });
    }, 600);
  };
  
  const handleShowOtherPersonDays = (plannedDays: PlannedDay[]) => {
    setOtherPlannedDays(plannedDays);
    
    // Add these days to the calendar view
    const currentUserDays = selectedDays.map(day => ({
      userId: "current-user",
      userName: "You",
      weekday: day
    }));
    
    onDaysChange([...currentUserDays, ...plannedDays]);
    
    toast({
      title: `Showing ${plannedDays[0]?.userName}'s schedule`,
      description: "The calendar now shows their planned office days.",
    });
  };

  return (
    <Card className="bg-card shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <Tabs defaultValue="my-days">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="my-days" className="flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              My Days
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              People
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-days" className="p-4">
            <WeekdaySelector 
              selectedDays={selectedDays} 
              onChange={setSelectedDays}
              disabled={isSubmitting}
            />
            
            <Button 
              onClick={handleSavePlannedDays} 
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Planned Days
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="people" className="p-4">
            <PeoplePlanner onShowPersonDays={handleShowOtherPersonDays} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlannedDaysManager;
