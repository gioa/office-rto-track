
import { Calendar } from "lucide-react";
import StatsCard from "./StatsCard";
import { Entry } from "@/lib/types";
import { countEntriesByType } from "@/lib/utils/entryFilters";
import { useEffect, useState } from "react";

interface TimeOffCardProps {
  entries: Entry[];
}

const TimeOffCard = ({ entries }: TimeOffCardProps) => {
  const [sickDays, setSickDays] = useState(0);
  const [ptoDays, setPtoDays] = useState(0);

  useEffect(() => {
    // Calculate metrics for sick and PTO days
    const totalSickDays = countEntriesByType(entries, 'sick');
    const totalPTO = countEntriesByType(entries, 'pto');
    
    setSickDays(totalSickDays);
    setPtoDays(totalPTO);
  }, [entries]);

  return (
    <StatsCard
      title="Time Off"
      value={sickDays + ptoDays}
      description={`${sickDays} sick, ${ptoDays} PTO days`}
      icon={Calendar}
    />
  );
};

export default TimeOffCard;
