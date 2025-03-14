
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
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface LogTableProps {
  entries: Entry[];
}

const LogTable = ({ entries }: LogTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Sort and filter entries to exclude weekends
  const processedEntries = entries
    .filter(entry => {
      const dayOfWeek = new Date(entry.date).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6; // Filter out weekends
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalPages = Math.ceil(processedEntries.length / itemsPerPage);
  
  // Get current page entries
  const getCurrentPageEntries = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, processedEntries.length);
    return processedEntries.slice(startIndex, endIndex);
  };
  
  // Reset to page 1 when entries change
  useEffect(() => {
    setCurrentPage(1);
  }, [entries]);
  
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
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // If we have a smaller number of pages, show them all
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }
    
    // Add first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={1 === currentPage}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add ellipsis if current page is far from the first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // Add ellipsis if current page is far from the last page
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  const currentEntries = getCurrentPageEntries();

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
              {currentEntries.length > 0 ? (
                currentEntries.map((entry) => (
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
        
        {/* Improved pagination controls */}
        {processedEntries.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {currentEntries.length > 0 ? 
                `${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, processedEntries.length)}` : 0} of {processedEntries.length} entries
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    aria-disabled={currentPage >= totalPages}
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
