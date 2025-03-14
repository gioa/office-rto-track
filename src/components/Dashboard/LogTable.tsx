
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

  // Get office location from entry ID
  const getOfficeLocation = (entry: Entry): string => {
    if (entry.type !== 'office-visit' && entry.type !== 'event') {
      return 'N/A';
    }
    
    const id = entry.id;
    if (id.includes('sf')) return 'SF';
    if (id.includes('ny')) return 'NYC';
    if (id.includes('mtv')) return 'MTV';
    
    // For new entries that don't have location in ID
    return id.substring(0, 2).toUpperCase();
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      // If 3 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i);
    } else if (page < 1) {
      // If on first page, show first 3
      return [0, 1, 2];
    } else if (page >= totalPages - 2) {
      // If on last 2 pages, show last 3
      return [totalPages - 3, totalPages - 2, totalPages - 1];
    } else {
      // Otherwise show current page and neighbors
      return [page - 1, page, page + 1];
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
                    onClick={() => handlePrevPage()} 
                    className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      onClick={() => setPage(pageNum)}
                      isActive={pageNum === page}
                    >
                      {pageNum + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handleNextPage()}
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
