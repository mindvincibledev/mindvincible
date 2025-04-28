
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
    console.log(`Requesting signed URL for path: ${path}, type: ${type}`);
    
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid storage path provided');
    }
    
    // Select the appropriate bucket based on the file type
    const bucket = type === 'audio' ? 'power_of_hi_audio' : 'power_of_hi_drawings';
    
    console.log(`Using bucket: ${bucket}`);
    
    // Handle paths that might already include the bucket name
    const cleanPath = path.includes('/') ? path : `${path}`;
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(cleanPath, 3600); // 1 hour expiration

    if (error) {
      console.error('Supabase error getting signed URL:', error);
      throw error;
    }
    
    if (!data || !data.signedUrl) {
      throw new Error('Failed to generate signed URL');
    }
    
    console.log(`Successfully generated signed URL for ${path}`);
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};

/**
 * Refreshes a signed URL if it's expired or about to expire
 */
export const refreshSignedUrlIfNeeded = async (path: string, currentUrl: string, type: 'drawing' | 'audio'): Promise<string> => {
  try {
    if (!currentUrl) {
      return await getSignedUrl(path, type);
    }
    
    // Check if URL has token parameter which indicates it's a signed URL
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const token = urlParams.get('token');
    
    // If no token or URL is close to expiring (within 5 minutes), refresh
    if (!token || Date.now() > parseInt(token) - 300000) {
      return await getSignedUrl(path, type);
    }
    
    return currentUrl;
  } catch (error) {
    console.error('Error refreshing signed URL:', error);
    return currentUrl || await getSignedUrl(path, type);
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
): Promise<{ path: string, url: string }> => {
  try {
    const fileName = generatePowerOfHiFilename(userId, section, type);
    console.log(`Uploading ${type} file: ${fileName}`);
    
    const bucket = type === 'audio' ? 'power_of_hi_audio' : 'power_of_hi_drawings';
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
    
    // Generate a signed URL for the uploaded file
    const signedUrl = await getSignedUrl(data.path, type);
    
    return {
      path: data.path,
      url: signedUrl
    };
  } catch (error) {
    console.error(`Error in uploadPowerOfHiFile (${type}):`, error);
    throw error;
  }
};
