
import { useState, useEffect } from "react";
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

interface LogTableProps {
  entries: Entry[];
}

const LogTable = ({ entries }: LogTableProps) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  
  // Reset pagination when entries change
  useEffect(() => {
    setPage(0);
  }, [entries]);
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get entries for current page
  const paginatedEntries = sortedEntries.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );
  
  // Get day of week
  const getDayOfWeek = (date: Date): string => {
    return format(new Date(date), 'EEEE');
  };
  
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

  return (
    <Card className="glass subtle-shadow animate-slide-up animation-delay-300">
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
              {paginatedEntries.length > 0 ? (
                paginatedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{getDayOfWeek(entry.date)}</TableCell>
                    <TableCell>{entry.userId === currentUser.id ? currentUser.email : 'company@example.com'}</TableCell>
                    <TableCell>{entry.type === 'office-visit' ? 
                      (entry.id.includes('sf') ? 'SF' : 
                       entry.id.includes('ny') ? 'NYC' : 'MTV') : 
                      'N/A'}</TableCell>
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
        
        {/* Pagination controls */}
        {sortedEntries.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {sortedEntries.length > 0 ? page * itemsPerPage + 1 : 0} to {Math.min((page + 1) * itemsPerPage, sortedEntries.length)} of {sortedEntries.length} entries
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-2 py-1 text-sm border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={(page + 1) * itemsPerPage >= sortedEntries.length}
                className="px-2 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogTable;
