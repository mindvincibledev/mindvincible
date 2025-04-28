
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
    console.log(`Requesting signed URL for Power of Hi path: ${path}, type: ${type}`);
    
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid storage path provided');
    }
    
    // Make sure the path has the correct structure (userId/filename.ext)
    let finalPath = path;
    
    // If path doesn't have a slash but we know it should, log an error
    if (!finalPath.includes('/')) {
      console.error('Path does not include user ID structure:', finalPath);
      throw new Error('Invalid path format: missing user ID structure');
    }
    
    // Select the appropriate bucket based on the file type
    const bucket = type === 'audio' ? 'power_of_hi_audio' : 'power_of_hi_drawings';
    
    console.log(`Using bucket: ${bucket} for path: ${finalPath}`);
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(finalPath, 3600); // 1 hour expiration

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
    
    try {
      // Check if URL has token parameter which indicates it's a signed URL
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const token = urlParams.get('token');
      
      // If no token or URL is close to expiring (within 5 minutes), refresh
      if (!token || Date.now() > parseInt(token) - 300000) {
        return await getSignedUrl(path, type);
      }
      
      return currentUrl;
    } catch (e) {
      // If URL parsing fails, try to get a new signed URL
      return await getSignedUrl(path, type);
    }
  } catch (error) {
    console.error('Error refreshing signed URL:', error);
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
