
import { Entry } from "@/lib/types";
import { Table } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TableHeader from "./TableHeader";
import TableContent from "./TableContent";

interface LogTableProps {
  entries: Entry[];
}

const LogTable = ({ entries }: LogTableProps) => {
  // Sort and filter entries to exclude weekends
  const processedEntries = entries
    .filter(entry => {
      const dayOfWeek = new Date(entry.date).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6; // Filter out weekends
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="glass subtle-shadow animate-slide-up animation-delay-300">
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="w-full">
            <Table>
              <TableHeader />
              <TableContent entries={processedEntries} />
            </Table>
          </div>
        </ScrollArea>
        
        {processedEntries.length > 0 && (
          <div className="text-sm text-muted-foreground mt-4">
            Showing {processedEntries.length} entries
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogTable;
