
import { setupJournalStorage } from './setupStorage';

// Initialize Supabase integrations
export async function initSupabase() {
  // Setup journal storage bucket
  await setupJournalStorage();
}
