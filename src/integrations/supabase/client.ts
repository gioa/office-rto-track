
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Import environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rqbnzelwspzyvrwhhoah.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYm56ZWx3c3B6eXZyd2hob2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MzE5NjUsImV4cCI6MjA1NzUwNzk2NX0.jK_CgvdXLRkC7-6zP4Z8s8628zb1mfzTg3AiUU9tuA4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Create the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
