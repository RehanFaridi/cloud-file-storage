import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[DEBUG] Supabase URL loaded:', supabaseUrl ? 'YES' : 'NO');
console.log('[DEBUG] Supabase Key loaded:', supabaseAnonKey ? 'YES' : 'NO');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[CRITICAL] Missing Supabase environment variables in Vite runtime!');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
