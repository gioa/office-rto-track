
/**
 * Hook for working with entries data
 */
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { Entry, DateRange, FilterOptions } from '@/lib/types';
import { getFilteredEntries } from '@/lib/utils/entryFilters';
import * as localStorageService from '@/services/localStorageService';

// Query key for entries
const ENTRIES_QUERY_KEY = 'entries';

// Hook for getting all entries
export const useEntries = (filterOptions?: FilterOptions) => {
  const queryClient = useQueryClient();
  
  // Query for getting entries
  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: [ENTRIES_QUERY_KEY],
    queryFn: localStorageService.getAllEntries,
  });
  
  // Filter entries if filter options are provided
  const filteredEntries = filterOptions 
    ? getFilteredEntries(entries, filterOptions)
    : entries;
  
  // Mutation for adding a new entry
  const addEntry = useMutation({
    mutationFn: ({ type, date, note }: { type: Entry['type'], date: Date, note?: string }) => {
      if (type === 'office-visit') {
        return localStorageService.addBadgeEntry({
          email: 'user@example.com', // In a real app, get from auth context
          date,
          dayOfWeek: date.getDay(),
          officeLocation: 'Default Office',
        });
      } else {
        return localStorageService.addUserEntry({
          email: 'user@example.com', // In a real app, get from auth context
          date,
          dayOfWeek: date.getDay(),
          type,
          note,
        });
      }
    },
    onSuccess: () => {
      // Invalidate and refetch entries
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      toast({
        title: 'Entry added successfully',
        description: 'Your entry has been added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding entry',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
  
  return {
    entries: filteredEntries,
    isLoading,
    error,
    addEntry,
  };
};

// Hook for getting entries for a specific date
export const useEntriesForDate = (date: Date) => {
  const { entries, isLoading, error } = useEntries();
  const [entriesForDate, setEntriesForDate] = useState<Entry[]>([]);
  
  useEffect(() => {
    if (!isLoading && entries.length > 0) {
      // Filter entries for the selected date
      const filtered = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getDate() === date.getDate() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getFullYear() === date.getFullYear()
        );
      });
      setEntriesForDate(filtered);
    }
  }, [entries, date, isLoading]);
  
  return {
    entriesForDate,
    isLoading,
    error,
  };
};
