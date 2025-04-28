
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a unique filename for Power of Hi files with the proper folder structure
 * Each user will have their own folder
 */
export const generatePowerOfHiFilename = (userId: string, section: string, type: 'drawing' | 'audio'): string => {
  const timestamp = Date.now();
  const extension = type === 'drawing' ? 'png' : 'webm';
  // Create a path that follows the pattern: userId/section_timestamp.extension
  return `${userId}/${section}_${timestamp}.${extension}`;
};

/**
 * Get a signed URL for accessing Power of Hi files
 */
export const getSignedUrl = async (path: string, type: 'drawing' | 'audio'): Promise<string> => {
  try {
    console.log(`Requesting signed URL for path: ${path}`);
    
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid storage path provided');
    }
    
    const bucket = type === 'drawing' ? 'power_of_hi_drawings' : 'power_of_hi_audio';
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1 hour expiration

    if (error) {
      console.error('Supabase error getting signed URL:', error);
      throw error;
    }
    
    if (!data || !data.signedUrl) {
      throw new Error('Failed to generate signed URL');
    }
    
    console.log(`Successfully generated signed URL with length: ${data.signedUrl.length}`);
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};

/**
 * Upload a file to Supabase storage with signed URL
 */
export const uploadPowerOfHiFile = async (
  userId: string, 
  section: string, 
  fileBlob: Blob,
  type: 'drawing' | 'audio'
): Promise<{ path: string }> => {
  try {
    const fileName = generatePowerOfHiFilename(userId, section, type);
    console.log(`Uploading ${type} file: ${fileName}`);
    
    const bucket = type === 'drawing' ? 'power_of_hi_drawings' : 'power_of_hi_audio';
    const contentType = type === 'drawing' ? 'image/png' : 'audio/webm';
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, fileBlob, {
        contentType,
        upsert: true
      });
      
    if (error) {
      console.error(`Error uploading ${type} file:`, error);
      throw error;
    }
    
    if (!data?.path) {
      throw new Error(`Failed to get path after uploading ${type} file`);
    }
    
    return {
      path: data.path
    };
  } catch (error) {
    console.error(`Error in uploadPowerOfHiFile (${type}):`, error);
    throw error;
  }
};
