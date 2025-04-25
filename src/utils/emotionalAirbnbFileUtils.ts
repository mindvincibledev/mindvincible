
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a unique filename for emotional airbnb drawings
 */
export const generateEmotionalAirbnbFilename = (userId: string, section: string): string => {
  const timestamp = Date.now();
  return `${userId}/${section}_${timestamp}.png`;
};

/**
 * Get a signed URL for accessing emotional airbnb drawings
 */
export const getSignedUrl = async (path: string): Promise<string> => {
  try {
    console.log(`Requesting signed URL for path: ${path}`);
    
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid storage path provided');
    }
    
    const { data, error } = await supabase
      .storage
      .from('emotional_airbnb_drawings')
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
export const refreshSignedUrlIfNeeded = async (path: string, currentUrl: string): Promise<string> => {
  try {
    if (!currentUrl) {
      return await getSignedUrl(path);
    }
    
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const expiryString = urlParams.get('token');
    
    if (!expiryString || Date.now() > (parseInt(expiryString) - 300000)) { // Refresh if less than 5 mins left
      return await getSignedUrl(path);
    }
    
    return currentUrl;
  } catch (error) {
    console.error('Error refreshing signed URL:', error);
    return currentUrl || await getSignedUrl(path);
  }
};
