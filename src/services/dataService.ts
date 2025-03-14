
/**
 * Data service for the application
 * 
 * This service provides methods for working with data.
 * Currently, it uses the localStorage implementation,
 * but in a real app, it would be replaced with API calls.
 */

import { BadgeEntry, Entry, PlannedDay, UserEntry, UserPlannedDays } from "@/lib/types";
import * as localStorageService from "./localStorageService";

// Re-export data methods from localStorage service
// In a real app, these would make API calls instead

// Badge entries API
export const getBadgeEntries = localStorageService.getBadgeEntries;
export const getBadgeEntriesByEmail = localStorageService.getBadgeEntriesByEmail;
export const addBadgeEntry = localStorageService.addBadgeEntry;

// User entries API
export const getUserEntries = localStorageService.getUserEntries;
export const getUserEntriesByEmail = localStorageService.getUserEntriesByEmail;
export const addUserEntry = localStorageService.addUserEntry;

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
