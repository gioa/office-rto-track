
/**
 * Supabase operations for badge entries
 */
import { BadgeEntry } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { initializeStorage } from "./initialize";

// Badge entries methods
export const getBadgeEntries = async (): Promise<BadgeEntry[]> => {
  initializeStorage();
  
  // Use the Employee_Office_Utilization table instead of badge_entries
  const { data, error } = await supabase
    .from('Employee_Office_Utilization')
    .select('*');
    
  if (error) {
    console.error('Error fetching badge entries:', error);
    return [];
  }
  
  return (data || []).map(entry => ({
    id: entry.Email + '-' + entry.Date, // Create a composite ID since the table doesn't have an id field
    email: entry.Email,
    date: new Date(entry.Date),
    dayOfWeek: entry['Day of Week'] ? parseInt(entry['Day of Week']) : new Date(entry.Date).getDay(),
    officeLocation: entry['Checked-In Office'] || undefined,
    checkinTime: undefined, // These fields aren't in the new table
    checkoutTime: undefined
  }));
};

export const getBadgeEntriesByEmail = async (email: string): Promise<BadgeEntry[]> => {
  const { data, error } = await supabase
    .from('Employee_Office_Utilization')
    .select('*')
    .eq('Email', email);
    
  if (error) {
    console.error('Error fetching badge entries by email:', error);
    return [];
  }
  
  return (data || []).map(entry => ({
    id: entry.Email + '-' + entry.Date,
    email: entry.Email,
    date: new Date(entry.Date),
    dayOfWeek: entry['Day of Week'] ? parseInt(entry['Day of Week']) : new Date(entry.Date).getDay(),
    officeLocation: entry['Checked-In Office'] || undefined,
    checkinTime: undefined,
    checkoutTime: undefined
  }));
};

export const addBadgeEntry = async (entry: Omit<BadgeEntry, 'id'>): Promise<BadgeEntry> => {
  const { data, error } = await supabase
    .from('Employee_Office_Utilization')
    .insert({
      Email: entry.email,
      Date: entry.date.toISOString().split('T')[0], // Just use the date part
      'Checked-In Office': entry.officeLocation,
      'Day of Week': entry.dayOfWeek.toString()
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding badge entry:', error);
    throw new Error(`Failed to add badge entry: ${error.message}`);
  }
  
  return {
    id: data.Email + '-' + data.Date,
    email: data.Email,
    date: new Date(data.Date),
    dayOfWeek: data['Day of Week'] ? parseInt(data['Day of Week']) : new Date(data.Date).getDay(),
    officeLocation: data['Checked-In Office'] || undefined,
    checkinTime: undefined,
    checkoutTime: undefined
  };
};
