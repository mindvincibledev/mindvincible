
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
    const { data, error } = await supabase
      .storage
      .from('mood_jars')
      .createSignedUrl(path, 3600); // 1 hour expiration

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};
