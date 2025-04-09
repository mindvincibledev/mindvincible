
import { setupJournalStorage } from './setupStorage';

// Initialize Supabase integrations
export async function initSupabase() {
  console.log('Initializing Supabase integrations...');
  
  // Setup storage buckets (audio files, drawing files, and mood jars)
  await setupJournalStorage();
  
  console.log('Supabase initialization complete');
}
