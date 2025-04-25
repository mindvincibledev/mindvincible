
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a unique filename for grounding files with the proper folder structure
 * Each user will have their own folder
 */
export const generateGroundingFilename = (userId: string, section: string, type: 'drawing' | 'audio'): string => {
  const timestamp = Date.now();
  const extension = type === 'drawing' ? 'png' : 'webm';
  // Create a path that follows the pattern: userId/section_timestamp.extension
  return `${userId}/${section}_${timestamp}.${extension}`;
};

/**
 * Get a signed URL for accessing grounding files
 */
export const getSignedUrl = async (path: string, type: 'drawing' | 'audio'): Promise<string> => {
  try {
    console.log(`Requesting signed URL for path: ${path}`);
    
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid storage path provided');
    }
    
    const bucket = type === 'drawing' ? 'grounding_drawings' : 'grounding_audio';
    
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
    return '/placeholder.svg';
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
    
    // Check if URL has a token parameter which indicates it's a signed URL
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const expiryString = urlParams.get('token');
    
    // If no token or expiry time is less than 5 minutes away, refresh the URL
    if (!expiryString || Date.now() > (parseInt(expiryString) - 300000)) { // Refresh if less than 5 mins left
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
export const uploadGroundingFile = async (
  userId: string, 
  section: string, 
  fileBlob: Blob,
  type: 'drawing' | 'audio'
): Promise<{ path: string, url: string } | null> => {
  try {
    const fileName = generateGroundingFilename(userId, section, type);
    const bucket = type === 'drawing' ? 'grounding_drawings' : 'grounding_audio';
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
    console.error(`Error in uploadGroundingFile (${type}):`, error);
    return null;
  }
};
