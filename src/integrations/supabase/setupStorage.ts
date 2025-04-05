
import { supabase } from './client';

// This function sets up the Supabase storage bucket for journal files
export async function setupJournalStorage() {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking storage buckets:', listError);
      return;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'journal_files');
    
    if (!bucketExists) {
      // Create the journal_files bucket
      const { error: createError } = await supabase.storage.createBucket('journal_files', {
        public: false, // Files are not public by default
      });
      
      if (createError) {
        console.error('Error creating journal_files bucket:', createError);
        return;
      }
      
      console.log('Created journal_files bucket successfully');
      
      // Set up bucket policies
      const { error: policyError } = await supabase.storage.from('journal_files').createSignedUrls(
        ['dummy-path'],
        60
      );
      
      if (policyError && !policyError.message.includes('The resource was not found')) {
        console.error('Error setting up bucket policies:', policyError);
      }
    }
  } catch (error) {
    console.error('Error setting up journal storage:', error);
  }
}
