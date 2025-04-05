
import { setupJournalStorage } from './setupStorage';

// Initialize Supabase integrations
export async function initSupabase() {
  // Setup storage buckets (journal files and mood jars)
  await setupJournalStorage();
}
