
import { supabase } from '@/integrations/supabase/client';

// Get signed URL for media files
export const getSignedUrl = async (
  path: string, 
  fileType: 'audio' | 'drawing' = 'drawing'
): Promise<string> => {
  if (!path) {
    console.error('Invalid path provided to getSignedUrl');
    return '';
  }
  
  try {
    // Determine which bucket to use based on path or explicit fileType
    const bucketName = path.includes('audio') || fileType === 'audio' 
      ? 'audio_files' 
      : 'drawing_files';
    
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

// Upload a file
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
