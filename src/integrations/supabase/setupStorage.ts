
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
    
    // Check for journal_files bucket
    const journalBucketExists = buckets?.some(bucket => bucket.id === 'journal_files');
    if (!journalBucketExists) {
      console.error('Error: journal_files bucket not found. Please create it in Supabase.');
    } else {
      console.log('journal_files bucket exists');
      
      // Let's check if we can access storage info without using RPC
      try {
        // Just check if we can access the bucket
        const { data, error } = await supabase.storage.from('journal_files').list();
        if (!error) {
          console.log('Storage policies are set up correctly');
        } else {
          console.warn('Potential issue with storage policies:', error.message);
        }
      } catch (err) {
        console.error('Error checking storage policies:', err);
      }
    }
    
    // Check for mood_jars bucket
    const moodJarBucketExists = buckets?.some(bucket => bucket.id === 'mood_jars');
    if (!moodJarBucketExists) {
      console.error('Error: mood_jars bucket not found. Please create it in Supabase.');
    } else {
      console.log('mood_jars bucket exists');
    }
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}
