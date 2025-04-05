
import { setupJournalStorage } from './setupStorage';

// Initialize Supabase integrations
export async function initSupabase() {
  console.log('Initializing Supabase integrations...');
  
  // Setup storage buckets (journal files and mood jars)
  await setupJournalStorage();
  
  console.log('Supabase initialization complete');
}
