
import { supabase } from './client';

// This function sets up the Supabase storage buckets for the application
export async function setupJournalStorage() {
  try {
    // Check if the buckets already exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking storage buckets:', listError);
      return;
    }
    
    // Setup journal_files bucket if it doesn't exist
    const journalBucketExists = buckets?.some(bucket => bucket.name === 'journal_files');
    
    if (!journalBucketExists) {
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
    
    // Setup mood_jars bucket if it doesn't exist
    const moodJarBucketExists = buckets?.some(bucket => bucket.name === 'mood_jars');
    
    if (!moodJarBucketExists) {
      // Create the mood_jars bucket
      const { error: createError } = await supabase.storage.createBucket('mood_jars', {
        public: true, // Jar images can be public
      });
      
      if (createError) {
        console.error('Error creating mood_jars bucket:', createError);
        return;
      }
      
      console.log('Created mood_jars bucket successfully');
    }
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}
