
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ChartEmpty = () => {
  return (
    <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200">
      <CardHeader>
        <CardTitle>Weekly Office Visits</CardTitle>
        <CardDescription>
          Your RTO compliance (target: 3 days per week)
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[350px] w-full flex items-center justify-center flex-col">
          <p className="text-muted-foreground">No data available for the selected period</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartEmpty;
