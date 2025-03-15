
/**
 * Hook for working with entries for a specific date
 */
import { useState, useEffect } from 'react';
import { Entry } from '@/lib/types';
import { useEntries } from './useEntries';
import { isWeekend } from '@/components/Calendar/utils';
import { currentUser } from '@/lib/data/currentUser';

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
      
      // Filter entries for the selected date and current user
      const filtered = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
          (entry.userId === currentUser.id || entry.userId === currentUser.email) &&
          entryDate.getDate() === date.getDate() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getFullYear() === date.getFullYear()
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
