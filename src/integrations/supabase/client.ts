
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dsazcyagjgugcprflcid.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzYXpjeWFnamd1Z2NwcmZsY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTg2NjIsImV4cCI6MjA2MjM3NDY2Mn0.hephO3d3DPbQ4vS40GNYIJk_k2e16gNGTvmKQhMPR5s";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
