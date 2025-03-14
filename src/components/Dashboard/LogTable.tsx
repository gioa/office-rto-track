
import { format } from "date-fns";
import { Entry } from "@/lib/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // Format entry type for display
  const formatEntryType = (type: string): string => {
    switch (type) {
      case 'office-visit': return 'Office Visit';
      case 'sick': return 'Sick Day';
      case 'pto': return 'PTO';
      case 'event': return 'Company Event';
      case 'holiday': return 'Holiday';
      default: return type;
    }
  };

  // Get office location from entry
  const getOfficeLocation = (entry: Entry): string => {
    if (entry.type !== 'office-visit' && entry.type !== 'event') {
      return 'N/A';
    }
    
    // Use the officeLocation property if it exists
    if (entry.officeLocation) {
      return entry.officeLocation;
    }
    
    // Fallback to extracting from ID for backward compatibility
    const id = entry.id;
    if (id.includes('sf')) return 'SF';
    if (id.includes('ny')) return 'NYC';
    if (id.includes('mtv')) return 'MTV';
    
    // For entries that don't have location info
    return 'Unknown';
  };

  return (
    <Card className="glass subtle-shadow animate-slide-up animation-delay-300">
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Office Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedEntries.length > 0 ? (
                  processedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(new Date(entry.date), 'EEEE')}</TableCell>
                      <TableCell>{entry.userId === currentUser.id ? currentUser.email : entry.userId}</TableCell>
                      <TableCell>{getOfficeLocation(entry)}</TableCell>
                      <TableCell>{formatEntryType(entry.type)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{entry.note || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No entries found</TableCell>
                  </TableRow>
                )}
              </TableBody>
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
