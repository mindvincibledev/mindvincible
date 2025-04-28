
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a unique filename for emotional airbnb drawings with the proper folder structure
 * The folder structure must match our RLS policy: userId/section_timestamp.png
 */
export const generateEmotionalAirbnbFilename = (userId: string, section: string): string => {
  const timestamp = Date.now();
  // Create a path that follows the pattern: userId/section_timestamp.png
  // This ensures the RLS policy will work correctly
  return `${userId}/${section}_${timestamp}.png`;
};

/**
 * Get a signed URL for accessing emotional airbnb drawings
 */
export const getSignedUrl = async (path: string): Promise<string> => {
  try {
    console.log(`Requesting signed URL for emotional airbnb path: ${path}`);
    
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid storage path provided');
    }
    
    // Check if path includes full URL and extract just the filename if needed
    let cleanPath = path;
    if (path.includes('http') && path.includes('/object/')) {
      cleanPath = path.split('/').pop() || path;
      console.log(`Extracted filename from URL: ${cleanPath}`);
    }
    
    // Check if path already includes user ID, if not we have a problem
    const pathSegments = cleanPath.split('/');
    if (pathSegments.length === 1) {
      console.warn('Path does not include user ID structure, this may cause permissions issues');
    }
    
    // Try to get the signed URL
    const { data, error } = await supabase
      .storage
      .from('emotional_airbnb_drawings')
      .createSignedUrl(cleanPath, 3600); // 1 hour expiration

    if (error) {
      console.error('Supabase error getting signed URL:', error);
      throw error;
    }
    
    if (!data || !data.signedUrl) {
      throw new Error('Failed to generate signed URL');
    }
    
    console.log(`Successfully generated signed URL for emotional airbnb drawing`);
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error; // Re-throw to let component handle the error
  }
};

/**
 * Refreshes a signed URL if it's expired or about to expire
 */
export const refreshSignedUrlIfNeeded = async (path: string, currentUrl: string): Promise<string> => {
  try {
    if (!currentUrl) {
      return await getSignedUrl(path);
    }
    
    try {
      const urlParams = new URLSearchParams(new URL(currentUrl).search);
      const expiryString = urlParams.get('token');
      
      if (!expiryString || Date.now() > (parseInt(expiryString) - 300000)) { // Refresh if less than 5 mins left
        return await getSignedUrl(path);
      }
      
      return currentUrl;
    } catch (e) {
      // If URL parsing fails, try to get a new signed URL
      return await getSignedUrl(path);
    }
  } catch (error) {
    console.error('Error refreshing signed URL:', error);
    throw error; // Re-throw to let component handle the error
  }
};

/**
 * Upload a file to Supabase storage with signed URL
 */
export const uploadEmotionalAirbnbDrawing = async (
  userId: string, 
  section: string, 
  fileBlob: Blob
): Promise<{ path: string, url: string }> => {
  try {
    const fileName = generateEmotionalAirbnbFilename(userId, section);
    console.log(`Uploading emotional airbnb drawing: ${fileName}`);
    
    const { data, error } = await supabase
      .storage
      .from('emotional_airbnb_drawings')
      .upload(fileName, fileBlob, {
        contentType: 'image/png',
        upsert: true
      });
      
    if (error) {
      console.error('Error uploading drawing:', error);
      throw error;
    }
    
    if (!data?.path) {
      throw new Error('Failed to get path after uploading drawing');
    }
    
    // Generate a signed URL for the uploaded file
    const signedUrl = await getSignedUrl(data.path);
    
    return {
      path: data.path,
      url: signedUrl
    };
  } catch (error) {
    console.error('Error in uploadEmotionalAirbnbDrawing:', error);
    throw error;
  }
};
