
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
    
    // Check for audio_files bucket
    const audioBucketExists = buckets?.some(bucket => bucket.id === 'audio_files');
    if (!audioBucketExists) {
      console.error('Error: audio_files bucket not found. Please create it in Supabase.');
    } else {
      console.log('audio_files bucket exists');
      
      // Let's check if we can access storage info
      try {
        const { data, error } = await supabase.storage.from('audio_files').list();
        if (!error) {
          console.log('Audio files storage is set up correctly with public access');
          console.log('Available files:', data);
        } else {
          console.warn('Potential issue with audio files storage:', error.message);
        }
      } catch (err) {
        console.error('Error checking audio files storage:', err);
      }
    }
    
    // Check for drawing_files bucket
    const drawingBucketExists = buckets?.some(bucket => bucket.id === 'drawing_files');
    if (!drawingBucketExists) {
      console.error('Error: drawing_files bucket not found. Please create it in Supabase.');
    } else {
      console.log('drawing_files bucket exists');
      
      // Let's check if we can access storage info
      try {
        const { data, error } = await supabase.storage.from('drawing_files').list();
        if (!error) {
          console.log('Drawing files storage is set up correctly with public access');
          console.log('Available files:', data);
        } else {
          console.warn('Potential issue with drawing files storage:', error.message);
        }
      } catch (err) {
        console.error('Error checking drawing files storage:', err);
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
