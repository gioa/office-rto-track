
/**
 * Supabase operations for user entries
 */
import { UserEntry, EntryType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { initializeStorage } from "./initialize";

// User entries methods
export const getUserEntries = async (): Promise<UserEntry[]> => {
  initializeStorage();
  
  const { data, error } = await supabase
    .from('user_entries')
    .select('*');
    
  if (error) {
    console.error('Error fetching user entries:', error);
    return [];
  }
  
  return (data || []).map(entry => ({
    id: entry.id,
    email: entry.email,
    date: new Date(entry.date),
    dayOfWeek: entry.day_of_week,
    type: entry.type as EntryType, // Cast to EntryType
    note: entry.note
  }));
};

export const getUserEntriesByEmail = async (email: string): Promise<UserEntry[]> => {
  const { data, error } = await supabase
    .from('user_entries')
    .select('*')
    .eq('email', email);
    
  if (error) {
    console.error('Error fetching user entries by email:', error);
    return [];
  }
  
  return (data || []).map(entry => ({
    id: entry.id,
    email: entry.email,
    date: new Date(entry.date),
    dayOfWeek: entry.day_of_week,
    type: entry.type as EntryType, // Cast to EntryType
    note: entry.note
  }));
};

export const addUserEntry = async (entry: Omit<UserEntry, 'id'>): Promise<UserEntry> => {
  const { data, error } = await supabase
    .from('user_entries')
    .insert({
      email: entry.email,
      date: entry.date.toISOString(),
      day_of_week: entry.dayOfWeek,
      type: entry.type, // This is already EntryType from the parameter
      note: entry.note
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding user entry:', error);
    throw new Error(`Failed to add user entry: ${error.message}`);
  }
  
  return {
    id: data.id,
    email: data.email,
    date: new Date(data.date),
    dayOfWeek: data.day_of_week,
    type: data.type as EntryType, // Cast to EntryType
    note: data.note
  };
};
