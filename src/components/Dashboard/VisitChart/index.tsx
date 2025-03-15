
import { Entry } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartData } from "./hooks/useChartData";
import ChartSkeleton from "./components/ChartSkeleton";
import ChartError from "./components/ChartError";
import ChartEmpty from "./components/ChartEmpty";
import BarChartComponent from "./components/BarChartComponent";

interface VisitChartProps {
  entries?: Entry[];
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const VisitChart = ({ entries, dateRange }: VisitChartProps) => {
  const { chartData, isLoading, error } = useChartData({ entries, dateRange });
  
  if (isLoading && !entries && chartData.length === 0) {
    return <ChartSkeleton />;
  }
  
  if (error && !entries && chartData.length === 0) {
    return <ChartError />;
  }
  
  if (!chartData || chartData.length === 0) {
    return <ChartEmpty />;
  }
  
  return (
    <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200 overflow-hidden">
      <CardHeader>
        <CardTitle>Weekly Office Visits</CardTitle>
        <CardDescription>
          Your RTO compliance (target: 3 days per week)
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <BarChartComponent chartData={chartData} />
      </CardContent>
    </Card>
  );
};

export default VisitChart;
