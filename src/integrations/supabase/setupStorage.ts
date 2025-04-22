
import { supabase } from './client';

export async function setupJournalStorage() {
  try {
    // Check if audio_files bucket exists
    const { data: audioBuckets, error: audioCheckError } = await supabase.storage.listBuckets();
    
    if (audioCheckError) {
      console.error('Error checking audio bucket:', audioCheckError);
      return;
    }

    const audioFilesBucketExists = audioBuckets.some(bucket => bucket.name === 'audio_files');
    
    if (!audioFilesBucketExists) {
      console.log('Creating audio_files bucket...');
      const { error: audioCreateError } = await supabase.storage.createBucket('audio_files', {
        public: true, // Allow public access to files
        fileSizeLimit: 52428800, // 50MB file size limit
      });
      
      if (audioCreateError) {
        console.error('Error creating audio_files bucket:', audioCreateError);
        throw new Error('audio_files bucket not found. Please create it in Supabase.');
      }
      
      console.log('audio_files bucket created successfully');
    }

    // Check if drawing_files bucket exists
    const drawingFilesBucketExists = audioBuckets.some(bucket => bucket.name === 'drawing_files');
    
    if (!drawingFilesBucketExists) {
      console.log('Creating drawing_files bucket...');
      const { error: drawingCreateError } = await supabase.storage.createBucket('drawing_files', {
        public: true, // Allow public access to files
        fileSizeLimit: 52428800, // 50MB file size limit
      });
      
      if (drawingCreateError) {
        console.error('Error creating drawing_files bucket:', drawingCreateError);
        throw new Error('drawing_files bucket not found. Please create it in Supabase.');
      }
      
      console.log('drawing_files bucket created successfully');
    }

    // Check if mood_jars bucket exists
    const moodJarsBucketExists = audioBuckets.some(bucket => bucket.name === 'mood_jars');
    
    if (!moodJarsBucketExists) {
      console.log('Creating mood_jars bucket...');
      const { error: moodCreateError } = await supabase.storage.createBucket('mood_jars', {
        public: true, // Allow public access to files
        fileSizeLimit: 52428800, // 50MB file size limit
      });
      
      if (moodCreateError) {
        console.error('Error creating mood_jars bucket:', moodCreateError);
        throw new Error('mood_jars bucket not found. Please create it in Supabase.');
      }
      
      console.log('mood_jars bucket created successfully');
    }

    console.log('All storage buckets are set up correctly');
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
    throw error;
  }
}
