
import { Entry, EntryType } from "@/lib/types";

/**
 * Format entry type for display
 */
export const formatEntryType = (type: EntryType): string => {
  switch (type) {
    case 'office-visit': return 'Office Visit';
    case 'sick': return 'Sick Day';
    case 'pto': return 'PTO';
    case 'event': return 'Company Event';
    case 'holiday': return 'Holiday';
    default: return type;
  }
};

/**
 * Get office location from entry
 */
export const getOfficeLocation = (entry: Entry): string => {
  if (entry.type !== 'office-visit' && entry.type !== 'event') {
    return 'N/A';
  }
  
  // Use the officeLocation property if it exists
  if (entry.officeLocation) {
    return entry.officeLocation;
  }
  
  // Fallback to extracting from ID for backward compatibility
  const id = entry.id;
  if (id.includes('sf')) return 'SF';
  if (id.includes('ny')) return 'NYC';
  if (id.includes('mtv')) return 'MTV';
  
  // For entries that don't have location info
  return 'Unknown';
};
