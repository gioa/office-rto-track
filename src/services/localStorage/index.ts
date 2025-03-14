
/**
 * Main entry point for localStorage services
 * Re-exports all services for easy importing
 */

// Re-export config
export * from './config';

// Re-export initialization function
export { initializeStorage } from './initialize';

// Re-export badge entries operations
export * from './badgeEntries';

// Re-export user entries operations
export * from './userEntries';

// Re-export planned days operations
export * from './plannedDays';

// Re-export combined entries operations
export * from './entries';
