
import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to your project's URL and anon key from Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not provided');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type MoodEntry = {
  id: string;
  user_id: string;
  mood: string;
  value: number;
  tags: string[];
  notes: string;
  created_at: string;
};
