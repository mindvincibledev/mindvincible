
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const uploadPowerOfHiFile = async (
  userId: string,
  file: File,
  fileType: 'who' | 'howItWent' | 'feeling'
): Promise<string | null> => {
  if (!file || !userId) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${fileType}-${uuidv4()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('simple_hi_images')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true
    });

  if (uploadError) {
    console.error(`Error uploading ${fileType} file:`, uploadError);
    throw uploadError;
  }

  // Return file path - we'll generate signed URLs when needed
  return fileName;
};

export const getPowerOfHiFileUrl = async (filePath: string): Promise<string | null> => {
  if (!filePath) return null;

  const { data } = await supabase.storage
    .from('simple_hi_images')
    .createSignedUrl(filePath, 3600); // URL expires in 1 hour

  return data?.signedUrl || null;
};

export const deletePowerOfHiFile = async (filePath: string): Promise<void> => {
  if (!filePath) return;

  const { error } = await supabase.storage
    .from('simple_hi_images')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
