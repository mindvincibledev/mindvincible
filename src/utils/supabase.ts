
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Profile = {
  id: string;
  username: string | null;
  created_at: string;
  email: string;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: string;
  value: number;
  tags: string[];
  notes: string | null;
  created_at: string;
};
