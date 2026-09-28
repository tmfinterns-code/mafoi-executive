import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://wnxttwvfhqpjaqhdaika.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHR0d3ZmaHFwamFxaGRhaWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1Nzg0MTAsImV4cCI6MjEwNjE1NDQxMH0.v8GpITYJ1Xhc--0IqI7G5lkWXuXIB5rRfJWlUA8j5VE';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

/**
 * Checks whether valid Supabase credentials have been configured.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

