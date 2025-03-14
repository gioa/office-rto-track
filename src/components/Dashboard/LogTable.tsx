
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface LogTableProps {
  entries: Entry[];
}

const LogTable = ({ entries }: LogTableProps) => {
  const [page, setPage] = useState(0);
  const [paginatedEntries, setPaginatedEntries] = useState<Entry[]>([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  
  // Reset pagination when entries change
  useEffect(() => {
    setPage(0);
  }, [entries]);
  
  // Update paginated entries when page or entries change
  useEffect(() => {
    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get entries for current page
    const newPaginatedEntries = sortedEntries.slice(
      page * itemsPerPage,
      (page + 1) * itemsPerPage
    );
    
    setPaginatedEntries(newPaginatedEntries);
  }, [entries, page]);
  
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

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(p => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(p => p - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
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
                    <TableCell>{entry.type === 'office-visit' || entry.type === 'event' ? 
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
        {entries.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {entries.length > 0 ? page * itemsPerPage + 1 : 0} to {Math.min((page + 1) * itemsPerPage, entries.length)} of {entries.length} entries
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePrevPage();
                    }} 
                    className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => {
                  // Calculate page numbers to show (current page and neighbors)
                  // For totalPages > 3, we need to adjust which pages are shown
                  let pageNum = i;
                  
                  // If we have more than 3 pages and we're not at the start:
                  if (totalPages > 3 && page > 0) {
                    // Start from current page - 1, unless we're at the last pages
                    if (page >= totalPages - 1) {
                      pageNum = totalPages - 3 + i;  // Show last 3 pages
                    } else {
                      pageNum = page - 1 + i;  // Show current page and neighbors
                    }
                  }
                  
                  // Ensure pageNum is within valid range
                  pageNum = Math.max(0, Math.min(pageNum, totalPages - 1));
                  
                  const isActive = pageNum === page;
                  
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageClick(pageNum);
                        }}
                        isActive={isActive}
                      >
                        {pageNum + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextPage();
                    }}
                    className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogTable;
