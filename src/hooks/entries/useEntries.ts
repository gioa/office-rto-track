
/**
 * Hook for working with all entries data
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { Entry, FilterOptions } from '@/lib/types';
import { getFilteredEntries } from '@/lib/utils/entryFilters';
import * as dataService from '@/services/dataService';
import { currentUser } from '@/lib/data/currentUser';

// Query key for entries
export const ENTRIES_QUERY_KEY = 'entries';

// Hook for getting all entries
export const useEntries = (filterOptions?: FilterOptions) => {
  const queryClient = useQueryClient();
  
  // Query for getting entries - now async
  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: [ENTRIES_QUERY_KEY],
    queryFn: dataService.getAllEntries,
  });
  
  // Filter entries if filter options are provided
  const filteredEntries = filterOptions 
    ? getFilteredEntries(entries, filterOptions)
    : entries;
  
  // Mutation for adding a new entry
  const addEntry = useMutation({
    mutationFn: async ({ type, date, note, officeLocation }: { 
      type: Entry['type'], 
      date: Date, 
      note?: string,
      officeLocation?: string 
    }) => {
      const userEmail = currentUser.email; // Get current user email
      
      if (type === 'office-visit') {
        // For office visits, create a badge entry
        return dataService.addBadgeEntry({
          email: userEmail,
          date,
          dayOfWeek: date.getDay(),
          officeLocation: officeLocation || 'Default Office',
          checkinTime: new Date(new Date(date).setHours(9, 0, 0, 0)),
          checkoutTime: new Date(new Date(date).setHours(17, 0, 0, 0))
        });
      } else {
        // For other types, create a user entry
        return dataService.addUserEntry({
          email: userEmail,
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
  
  // Mutation for deleting an entry
  const deleteEntry = useMutation({
    mutationFn: async (entryId: string) => {
      // We'll use the entry ID to determine if it's a badge or user entry
      // This is a simplification - in a real app you might want to be more explicit
      return dataService.deleteEntry(entryId);
    },
    onSuccess: () => {
      // Invalidate and refetch entries
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      toast({
        title: 'Entry deleted',
        description: 'The entry has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting entry',
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
    deleteEntry,
  };
};
