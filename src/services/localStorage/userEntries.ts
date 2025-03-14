
import { v4 as uuidv4 } from 'uuid';
import { Entry, UserEntry } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

// Get user entries from Supabase
export const getUserEntries = async (): Promise<UserEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('user_entries')
      .select('*');
    
    if (error) {
      throw new Error(`Error getting user entries: ${error.message}`);
    }
    
    // Transform the database fields to match our interface
    return (data || []).map(entry => ({
      id: entry.id,
      email: entry.email,
      date: new Date(entry.date),
      dayOfWeek: entry.day_of_week,
      type: entry.type as UserEntry['type'],
      note: entry.note || undefined
    }));
  } catch (error) {
    console.error('Error getting user entries:', error);
    return [];
  }
};

// Get user entries by email from Supabase
export const getUserEntriesByEmail = async (email: string): Promise<UserEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('user_entries')
      .select('*')
      .eq('email', email);
    
    if (error) {
      throw new Error(`Error getting user entries by email: ${error.message}`);
    }
    
    // Transform the database fields to match our interface
    return (data || []).map(entry => ({
      id: entry.id,
      email: entry.email,
      date: new Date(entry.date),
      dayOfWeek: entry.day_of_week,
      type: entry.type as UserEntry['type'],
      note: entry.note || undefined
    }));
  } catch (error) {
    console.error('Error getting user entries by email:', error);
    return [];
  }
};

// Add a user entry to Supabase
export const addUserEntry = async (entry: Omit<UserEntry, 'id'>): Promise<UserEntry | null> => {
  try {
    const newEntryId = uuidv4();
    
    // Transform our interface to match database fields
    const dbEntry = {
      id: newEntryId,
      email: entry.email,
      date: entry.date.toISOString(),
      day_of_week: entry.dayOfWeek,
      type: entry.type,
      note: entry.note
    };
    
    const { data, error } = await supabase
      .from('user_entries')
      .insert([dbEntry])
      .select('*')
      .single();
    
    if (error) {
      throw new Error(`Error adding user entry: ${error.message}`);
    }
    
    // Transform back to our interface format
    return {
      id: data.id,
      email: data.email,
      date: new Date(data.date),
      dayOfWeek: data.day_of_week,
      type: data.type as UserEntry['type'],
      note: data.note || undefined
    };
  } catch (error) {
    console.error('Error adding user entry:', error);
    return null;
  }
};

// Delete a user entry by ID
export const deleteUserEntry = async (entryId: string): Promise<void> => {
  try {
    // Using Supabase to delete the entry
    const { error } = await supabase
      .from('user_entries')
      .delete()
      .eq('id', entryId);
    
    if (error) {
      throw new Error(`Error deleting user entry: ${error.message}`);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting user entry:', error);
    return Promise.reject(error);
  }
};
