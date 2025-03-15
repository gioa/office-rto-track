
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ChartSkeleton = () => {
  return (
    <Card className="col-span-4 glass subtle-shadow animate-slide-up animation-delay-200">
      <CardHeader>
        <CardTitle>Weekly Office Visits</CardTitle>
        <CardDescription>
          Your RTO compliance (target: 3 days per week)
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[350px] w-full flex items-center justify-center">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartSkeleton;
