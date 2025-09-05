
/**
 * Supabase operations for planned days
 */
import { UserPlannedDays } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { initializeStorage } from "./initialize";

// User planned days methods
export const getUserPlannedDays = async (): Promise<UserPlannedDays[]> => {
  initializeStorage();
  
  const { data, error } = await (supabase as any)
    .from('user_planned_days')
    .select('*');
    
  if (error) {
    console.error('Error fetching user planned days:', error);
    return [];
  }
  
  return (data || []).map(plan => ({
    id: plan.id,
    userId: plan.user_id,
    email: plan.email,
    plannedDays: plan.planned_days,
    effectiveFrom: plan.effective_from ? new Date(plan.effective_from) : undefined,
    effectiveTo: plan.effective_to ? new Date(plan.effective_to) : undefined
  }));
};

export const getUserPlannedDaysByUserId = async (userId: string): Promise<UserPlannedDays | undefined> => {
  const { data, error } = await (supabase as any)
    .from('user_planned_days')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching user planned days by user ID:', error);
    return undefined;
  }
  
  if (!data) return undefined;
  
  return {
    id: data.id,
    userId: data.user_id,
    email: data.email,
    plannedDays: data.planned_days,
    effectiveFrom: data.effective_from ? new Date(data.effective_from) : undefined,
    effectiveTo: data.effective_to ? new Date(data.effective_to) : undefined
  };
};

export const getUserPlannedDaysByEmail = async (email: string): Promise<UserPlannedDays | undefined> => {
  const { data, error } = await (supabase as any)
    .from('user_planned_days')
    .select('*')
    .eq('email', email)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching user planned days by email:', error);
    return undefined;
  }
  
  if (!data) return undefined;
  
  return {
    id: data.id,
    userId: data.user_id,
    email: data.email,
    plannedDays: data.planned_days,
    effectiveFrom: data.effective_from ? new Date(data.effective_from) : undefined,
    effectiveTo: data.effective_to ? new Date(data.effective_to) : undefined
  };
};

export const saveUserPlannedDays = async (
  userId: string, 
  email: string, 
  plannedDays: number[],
  effectiveFrom?: Date,
  effectiveTo?: Date
): Promise<UserPlannedDays> => {
  // Check if there's an existing plan for this user
  const existingPlan = await getUserPlannedDaysByUserId(userId);
  
  if (existingPlan) {
    // Update existing plan
    const { data, error } = await (supabase as any)
      .from('user_planned_days')
      .update({
        planned_days: plannedDays,
        effective_from: effectiveFrom?.toISOString(),
        effective_to: effectiveTo?.toISOString()
      })
      .eq('id', existingPlan.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user planned days:', error);
      throw new Error(`Failed to update planned days: ${error.message}`);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      email: data.email,
      plannedDays: data.planned_days,
      effectiveFrom: data.effective_from ? new Date(data.effective_from) : undefined,
      effectiveTo: data.effective_to ? new Date(data.effective_to) : undefined
    };
  } else {
    // Create new plan
    const { data, error } = await (supabase as any)
      .from('user_planned_days')
      .insert({
        user_id: userId,
        email,
        planned_days: plannedDays,
        effective_from: effectiveFrom?.toISOString(),
        effective_to: effectiveTo?.toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating user planned days:', error);
      throw new Error(`Failed to create planned days: ${error.message}`);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      email: data.email,
      plannedDays: data.planned_days,
      effectiveFrom: data.effective_from ? new Date(data.effective_from) : undefined,
      effectiveTo: data.effective_to ? new Date(data.effective_to) : undefined
    };
  }
};
