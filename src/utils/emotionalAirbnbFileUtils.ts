
import { supabase } from '@/integrations/supabase/client';

// Standardized function to get signed URLs for media files
export const getSignedUrl = async (path: string): Promise<string> => {
  if (!path) {
    console.error('Invalid path provided to getSignedUrl');
    return '';
  }

  try {
    // Determine which bucket to use based on path
    const bucketName = path.includes('audio') ? 'audio_files' : 'drawing_files';
    
    // Handle full paths or just filenames
    const filePath = path.includes('/') ? path.split('/').pop() || path : path;
    
    // Ensure we work with paths that might already include the bucket name
    const cleanPath = filePath.replace(`${bucketName}/`, '');
    
    console.log(`Getting signed URL for ${bucketName}/${cleanPath}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(cleanPath, 3600); // 1 hour expiration
    
    if (error) {
      console.error(`Error getting signed URL for ${bucketName}/${cleanPath}:`, error);
      return '';
    }
    
    if (!data?.signedUrl) {
      console.error(`No signed URL returned for ${bucketName}/${cleanPath}`);
      return '';
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    return '';
  }
};

// Upload a file to the appropriate bucket and return the path
export const uploadFile = async (
  file: File | Blob,
  userId: string,
  fileType: 'drawing' | 'audio'
): Promise<string | null> => {
  try {
    const bucketName = fileType === 'audio' ? 'audio_files' : 'drawing_files';
    const extension = fileType === 'audio' ? '.webm' : '.png';
    const filePath = `${userId}/${fileType}_${Date.now()}${extension}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);
    
    if (error) {
      console.error(`Error uploading ${fileType} file:`, error);
      return null;
    }
    
    return data?.path || null;
  } catch (error) {
    console.error(`Error in uploadFile (${fileType}):`, error);
    return null;
  }
};

// Generate a standardized filename for emotional airbnb files
export const generateEmotionalAirbnbFilename = (
  userId: string,
  section: string
): string => {
  // Create a structured filename with userId, section type, and timestamp
  return `${userId}/${section}_${Date.now()}.png`;
};
