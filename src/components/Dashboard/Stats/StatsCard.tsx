
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: React.ReactNode;
  icon: LucideIcon;
  children?: React.ReactNode;
}

const StatsCard = ({ title, value, description, icon: Icon, children }: StatsCardProps) => {
  return (
    <Card className="glass subtle-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
        {children}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
