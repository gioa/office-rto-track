
/**
 * Supabase operations for badge entries
 */
import { BadgeEntry } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { initializeStorage } from "./initialize";

// Badge entries methods
export const getBadgeEntries = async (): Promise<BadgeEntry[]> => {
  initializeStorage();
  
  const { data, error } = await supabase
    .from('badge_entries')
    .select('*');
    
  if (error) {
    console.error('Error fetching badge entries:', error);
    return [];
  }
  
  return (data || []).map(entry => ({
    id: entry.id,
    email: entry.email,
    date: new Date(entry.date),
    dayOfWeek: entry.day_of_week,
    officeLocation: entry.office_location,
    checkinTime: entry.checkin_time ? new Date(entry.checkin_time) : undefined,
    checkoutTime: entry.checkout_time ? new Date(entry.checkout_time) : undefined
  }));
};

export const getBadgeEntriesByEmail = async (email: string): Promise<BadgeEntry[]> => {
  const { data, error } = await supabase
    .from('badge_entries')
    .select('*')
    .eq('email', email);
    
  if (error) {
    console.error('Error fetching badge entries by email:', error);
    return [];
  }
  
  return (data || []).map(entry => ({
    id: entry.id,
    email: entry.email,
    date: new Date(entry.date),
    dayOfWeek: entry.day_of_week,
    officeLocation: entry.office_location,
    checkinTime: entry.checkin_time ? new Date(entry.checkin_time) : undefined,
    checkoutTime: entry.checkout_time ? new Date(entry.checkout_time) : undefined
  }));
};

export const addBadgeEntry = async (entry: Omit<BadgeEntry, 'id'>): Promise<BadgeEntry> => {
  const { data, error } = await supabase
    .from('badge_entries')
    .insert({
      email: entry.email,
      date: entry.date.toISOString(),
      day_of_week: entry.dayOfWeek,
      office_location: entry.officeLocation,
      checkin_time: entry.checkinTime?.toISOString(),
      checkout_time: entry.checkoutTime?.toISOString()
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding badge entry:', error);
    throw new Error(`Failed to add badge entry: ${error.message}`);
  }
  
  return {
    id: data.id,
    email: data.email,
    date: new Date(data.date),
    dayOfWeek: data.day_of_week,
    officeLocation: data.office_location,
    checkinTime: data.checkin_time ? new Date(data.checkin_time) : undefined,
    checkoutTime: data.checkout_time ? new Date(data.checkout_time) : undefined
  };
};
