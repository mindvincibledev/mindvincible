
import { supabase } from '@/integrations/supabase/client';

/**
 * Get a signed URL for accessing journal files (audio or drawing)
 */
export const getSignedUrl = async (path: string, bucket: 'audio_files' | 'drawing_files'): Promise<string> => {
  try {
    console.log(`Requesting signed URL for path: ${path} in bucket: ${bucket}`);
    
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid storage path provided');
    }
    
    // Check if path already includes user ID, if not prepend it
    const pathSegments = path.split('/');
    if (pathSegments.length === 1) {
      console.warn('Path does not include user ID structure, this may cause permissions issues');
    }
    
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
    
    console.log(`Successfully generated signed URL for file in ${bucket}`);
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error; // Re-throw to let component handle the error
  }
};

/**
 * Refreshes a signed URL if it's expired or about to expire
 */
export const refreshSignedUrlIfNeeded = async (
  path: string, 
  currentUrl: string,
  bucket: 'audio_files' | 'drawing_files'
): Promise<string> => {
  try {
    if (!currentUrl) {
      return await getSignedUrl(path, bucket);
    }
    
    // Check if URL has parameters which indicate it's a signed URL
    try {
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const expiryString = urlParams.get('token');
      
      if (!expiryString || Date.now() > (parseInt(expiryString) - 300000)) { // Refresh if less than 5 mins left
        return await getSignedUrl(path, bucket);
      }
      
      return currentUrl;
    } catch (e) {
      // If URL parsing fails, try to get a new signed URL
      return await getSignedUrl(path, bucket);
    }
  } catch (error) {
    console.error('Error refreshing signed URL:', error);
    throw error; // Re-throw to let component handle the error
  }
};

/**
 * Generate a unique filename for journal files
 */
export const generateJournalFilename = (userId: string, type: 'audio' | 'drawing'): string => {
  const timestamp = Date.now();
  const extension = type === 'audio' ? 'webm' : 'png';
  return `${userId}/${type}_${timestamp}.${extension}`;
};
