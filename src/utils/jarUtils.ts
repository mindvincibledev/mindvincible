
import { supabase } from '@/integrations/supabase/client';

/**
 * Converts canvas content to a base64-encoded PNG image
 * @param canvas The canvas element
 * @returns Promise that resolves to a Blob of the canvas image
 */
export const getBase64FromCanvas = (canvas: HTMLCanvasElement | null): Promise<Blob | null> => {
  if (!canvas) return Promise.resolve(null);
  
  // Convert canvas to blob
  return new Promise<Blob | null>(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, 'image/png', 0.95);
  });
};

/**
 * Helper function to generate a unique filename for jar images
 * @param userId The user's ID for the folder path
 */
export const generateJarFilename = (userId: string): string => {
  return `${userId}/jar_${Date.now()}.png`;
};

/**
 * Get a signed URL for a mood jar image
 * @param path The storage path of the image
 * @returns Promise that resolves to a signed URL
 */
export const getSignedUrl = async (path: string): Promise<string> => {
  try {
    console.log(`Requesting signed URL for path: ${path}`);
    
    // Validate the path to ensure it's valid before requesting a signed URL
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid storage path provided');
    }
    
    const { data, error } = await supabase
      .storage
      .from('mood_jars')
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
    // Return a fallback or placeholder instead of throwing
    return '/placeholder.svg';
  }
};

/**
 * Refreshes a signed URL if it's expired or about to expire
 * @param path The storage path of the image
 * @param currentUrl The current signed URL
 * @returns Promise that resolves to a new signed URL
 */
export const refreshSignedUrlIfNeeded = async (path: string, currentUrl: string): Promise<string> => {
  try {
    // If no current URL, generate a new one
    if (!currentUrl) {
      return await getSignedUrl(path);
    }
    
    // Parse the expiration time from the URL
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const expiryString = urlParams.get('token');
    
    // If we can't determine expiry or it's close to expiring, get a new URL
    if (!expiryString || Date.now() > (parseInt(expiryString) - 300000)) { // Refresh if less than 5 mins left
      return await getSignedUrl(path);
    }
    
    // URL is still valid
    return currentUrl;
  } catch (error) {
    console.error('Error refreshing signed URL:', error);
    return currentUrl || await getSignedUrl(path);
  }
};
