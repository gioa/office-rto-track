
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { PlannedDay } from "@/lib/types";
import WeekdaySelector from "./WeekdaySelector";
import PeoplePlanner from "./PeoplePlanner";
import { UserCheck, Users, Save } from "lucide-react";
import { saveUserPlannedDays, getUserPlannedDaysByUserId, convertToPlannedDays } from "@/services/dataService";
import { currentUser } from "@/lib/data/currentUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PlannedDaysManagerProps {
  onDaysChange: (plannedDays: PlannedDay[]) => void;
}

const PlannedDaysManager = ({ onDaysChange }: PlannedDaysManagerProps) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]); // Start with no days selected
  const [otherPlannedDays, setOtherPlannedDays] = useState<PlannedDay[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const queryClient = useQueryClient();
  
  // Get user's planned days
  const { data: userPlan, isLoading } = useQuery({
    queryKey: ['plannedDays', currentUser.id],
    queryFn: () => getUserPlannedDaysByUserId(currentUser.id),
  });
  
  // Mutation for saving planned days
  const savePlannedDaysMutation = useMutation({
    mutationFn: (days: number[]) => saveUserPlannedDays(
      currentUser.id,
      currentUser.email,
      days
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannedDays'] });
      setIsDirty(false);
      toast({
        title: "Planned days updated",
        description: "Your planned office days have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving planned days",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Initialize planned days on component mount or when userPlan changes
  useEffect(() => {
    if (userPlan) {
      setSelectedDays(userPlan.plannedDays);
      
      // Convert to PlannedDay[] format for the calendar
      const plannedDays = userPlan.plannedDays.map(day => ({
        userId: currentUser.id,
        userName: "You",
        weekday: day
      }));
      
      onDaysChange(plannedDays);
    }
  }, [userPlan, onDaysChange]);
  
  const handleSavePlannedDays = () => {
    // Save planned days to our data model
    savePlannedDaysMutation.mutate(selectedDays);
    
    // Convert selected days to PlannedDay objects for the current user
    const plannedDays = selectedDays.map(day => ({
      userId: currentUser.id, 
      userName: "You",
      weekday: day
    }));
    
    // Update the calendar with the new planned days
    onDaysChange([...plannedDays, ...otherPlannedDays]);
  };
  
  const handleDaysChange = (days: number[]) => {
    setSelectedDays(days);
    setIsDirty(true);
  };
  
  const handleShowOtherPersonDays = (plannedDays: PlannedDay[]) => {
    setOtherPlannedDays(plannedDays);
    
    // Add these days to the calendar view
    const currentUserDays = selectedDays.map(day => ({
      userId: currentUser.id,
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
    <Card className="bg-card shadow-sm overflow-hidden border-0">
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
              onChange={handleDaysChange}
              disabled={savePlannedDaysMutation.isPending || isLoading}
            />
            
            <Button 
              onClick={handleSavePlannedDays} 
              className="w-full mt-4"
              disabled={savePlannedDaysMutation.isPending || isLoading}
              variant={isDirty ? "default" : "secondary"}
            >
              {savePlannedDaysMutation.isPending ? (
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
