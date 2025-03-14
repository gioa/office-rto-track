
/**
 * Data service for the application
 * 
 * This service provides methods for working with data.
 * Now connected to Supabase database.
 */

import { PlannedDay, UserPlannedDays } from "@/lib/types";
import * as localStorageService from "./localStorage";

// Re-export data methods from localStorage service
// These now connect to Supabase instead of actual localStorage

// Badge entries API
export const getBadgeEntries = localStorageService.getBadgeEntries;
export const getBadgeEntriesByEmail = localStorageService.getBadgeEntriesByEmail;
export const addBadgeEntry = localStorageService.addBadgeEntry;

// User entries API
export const getUserEntries = localStorageService.getUserEntries;
export const getUserEntriesByEmail = localStorageService.getUserEntriesByEmail;
export const addUserEntry = localStorageService.addUserEntry;

// Entry deletion API
export const deleteEntry = localStorageService.deleteEntry;

// User planned days API
export const getUserPlannedDays = localStorageService.getUserPlannedDays;
export const getUserPlannedDaysByUserId = localStorageService.getUserPlannedDaysByUserId;
export const getUserPlannedDaysByEmail = localStorageService.getUserPlannedDaysByEmail;
export const saveUserPlannedDays = localStorageService.saveUserPlannedDays;

// Get all entries (combined badge and user entries)
export const getAllEntries = localStorageService.getAllEntries;

// Utility to convert from our data model to PlannedDay[] for UI components
export const convertToPlannedDays = (plans: UserPlannedDays[]): PlannedDay[] => {
  const result: PlannedDay[] = [];
  
  plans.forEach(plan => {
    plan.plannedDays.forEach(weekday => {
      result.push({
        userId: plan.userId,
        userName: plan.email.split('@')[0], // Simple name extraction from email
        weekday,
        department: 'General' // Default department
      });
    });
  });
  
  return result;
};
