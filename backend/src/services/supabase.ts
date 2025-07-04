import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { Database } from '../types/database';

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const supabaseAdmin = createClient<Database>(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
); 