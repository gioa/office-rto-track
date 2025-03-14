
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
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedEntries, setPaginatedEntries] = useState<Entry[]>([]);
  const itemsPerPage = 5;
  
  // Sort and filter entries
  const processedEntries = entries
    .filter(entry => {
      const dayOfWeek = new Date(entry.date).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6; // Filter out weekends
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalPages = Math.ceil(processedEntries.length / itemsPerPage);
  
  // Reset to page 1 when entries change
  useEffect(() => {
    setCurrentPage(1);
  }, [entries]);
  
  // Update paginated entries when page or entries change
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedEntries(processedEntries.slice(startIndex, endIndex));
  }, [processedEntries, currentPage]);
  
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

  // Page navigation handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const range = [];
    const maxPagesToShow = 3;
    
    if (totalPages <= maxPagesToShow) {
      // If there are only a few pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Always show current page
      range.push(currentPage);
      
      // Add page before current if possible
      if (currentPage > 1) {
        range.unshift(currentPage - 1);
      }
      
      // Add page after current if possible
      if (currentPage < totalPages) {
        range.push(currentPage + 1);
      }
      
      // Fill in any remaining slots
      while (range.length < maxPagesToShow && range.length < totalPages) {
        if (range[0] > 1) {
          range.unshift(range[0] - 1);
        } else if (range[range.length - 1] < totalPages) {
          range.push(range[range.length - 1] + 1);
        } else {
          break;
        }
      }
    }
    
    return range;
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
        {processedEntries.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {processedEntries.length > 0 ? 
                `${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, processedEntries.length)}` : 0} of {processedEntries.length} entries
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={goToPreviousPage}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      onClick={() => goToPage(pageNum)}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={goToNextPage}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
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
