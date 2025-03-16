
/**
 * Hook for working with entries for a specific date
 */
import { useState, useEffect } from 'react';
import { Entry } from '@/lib/types';
import { useEntries } from './useEntries';
import { isWeekend } from '@/components/Calendar/utils';
import { currentUser } from '@/lib/data/currentUser';
import { isSameDay } from 'date-fns';

export const useEntriesForDate = (date: Date) => {
  const { entries, isLoading, error } = useEntries();
  const [entriesForDate, setEntriesForDate] = useState<Entry[]>([]);
  
  useEffect(() => {
    if (!isLoading && entries.length > 0) {
      // Skip completely if date is a weekend - always return empty array
      if (isWeekend(date)) {
        setEntriesForDate([]);
        return;
      }
      
      // Remove time component from the input date to avoid timezone issues
      const normalizedDate = new Date(date.toDateString());
      
      // Filter entries for the selected date and current user
      // Using isSameDay to reliably compare dates regardless of time or timezone
      const filtered = entries.filter(entry => {
        // Create a new Date object without time information to avoid timezone issues
        const entryDate = new Date(new Date(entry.date).toDateString());
        return (
          (entry.userId === currentUser.id || entry.userId === currentUser.email) &&
          isSameDay(entryDate, normalizedDate)
        );
      });
      
      setEntriesForDate(filtered);
    } else {
      // If loading or no entries, set to empty array
      setEntriesForDate([]);
    }
  }, [entries, date, isLoading]);
  
  return {
    entriesForDate,
    isLoading,
    error,
  };
};
