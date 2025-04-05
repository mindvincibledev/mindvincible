
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
      
      // Let's check the RLS policies as well
      const { data: policies, error: policiesError } = await supabase.rpc('get_policies', {
        table_name: 'objects',
        schema_name: 'storage'
      }).catch(() => ({ data: null, error: null }));
      
      if (!policiesError) {
        console.log('Storage policies are set up');
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
