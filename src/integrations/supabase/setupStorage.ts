
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
      console.warn('journal_files bucket not found. It should have been created by SQL migration.');
    } else {
      console.log('journal_files bucket exists');
    }
    
    // Check for mood_jars bucket
    const moodJarBucketExists = buckets?.some(bucket => bucket.id === 'mood_jars');
    if (!moodJarBucketExists) {
      console.warn('mood_jars bucket not found. It should have been created by SQL migration.');
    } else {
      console.log('mood_jars bucket exists');
    }
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}
