
/**
 * Storage initialization with mock data if empty
 */
import { STORAGE_INITIALIZED_KEY } from "./config";

// This function now just ensures backward compatibility with localStorage
export const initializeStorage = (): void => {
  // We're using Supabase now, so this is just a no-op function
  // for backward compatibility
  if (!localStorage.getItem(STORAGE_INITIALIZED_KEY)) {
    localStorage.setItem(STORAGE_INITIALIZED_KEY, 'true');
  }
};
