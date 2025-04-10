
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { JournalEntry } from '@/types/journal';

type JournalType = 'text' | 'audio' | 'drawing';

interface UseJournalSaveProps {
  journalType: JournalType;
  title: string;
  content: string;
  audioBlob: Blob | null;
  drawingBlob: Blob | null;
}

export function useJournalSave() {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateJournalEntry = (
    journalType: JournalType,
    title: string,
    content: string,
    audioBlob: Blob | null,
    drawingBlob: Blob | null
  ): boolean => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to save journal entries",
      });
      return false;
    }
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please provide a title for your journal entry",
      });
      return false;
    }
    
    // For text entries, content is required
    if (journalType === 'text' && !content.trim()) {
      toast({
        variant: "destructive",
        title: "Content required",
        description: "Please write something in your journal entry",
      });
      return false;
    }
    
    // For audio entries, blob is required
    if (journalType === 'audio' && !audioBlob) {
      toast({
        variant: "destructive",
        title: "Audio required",
        description: "Please record audio for your journal entry",
      });
      return false;
    }
    
    // For drawing entries, blob is required
    if (journalType === 'drawing' && !drawingBlob) {
      toast({
        variant: "destructive",
        title: "Drawing required",
        description: "Please create a drawing for your journal entry",
      });
      return false;
    }

    return true;
  };

  const saveJournal = async ({
    journalType,
    title,
    content,
    audioBlob,
    drawingBlob,
  }: UseJournalSaveProps) => {
    if (!validateJournalEntry(journalType, title, content, audioBlob, drawingBlob)) {
      return;
    }

    setIsSaving(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Starting journal save process with user ID:", user.id);
      
      // Handle file upload if needed
      let audioPath = null;
      let drawingPath = null;
      
      if (journalType === 'audio' && audioBlob) {
        const timestamp = Date.now();
        const fileName = `audio_${timestamp}.webm`;
        
        // No need for user-specific folder since RLS is disabled
        console.log(`Uploading audio file: ${fileName}`);
        
        // Upload audio file to the audio_files bucket
        const { error: uploadError, data } = await supabase.storage
          .from('audio_files')
          .upload(fileName, audioBlob, {
            contentType: 'audio/webm',
            upsert: true
          });
          
        if (uploadError) {
          console.error('Error uploading audio:', uploadError);
          throw new Error(`Failed to upload audio: ${uploadError.message}`);
        }
        
        // Get the public URL for the uploaded file
        const { data: audioUrl } = supabase.storage
          .from('audio_files')
          .getPublicUrl(fileName);
          
        audioPath = audioUrl.publicUrl;
        console.log('Audio uploaded successfully, URL:', audioPath);
      }
      
      if (journalType === 'drawing' && drawingBlob) {
        const timestamp = Date.now();
        const fileName = `drawing_${timestamp}.png`;
        
        // No need for user-specific folder since RLS is disabled
        console.log(`Uploading drawing file: ${fileName}`);
        
        // Upload drawing file to the drawing_files bucket
        const { error: uploadError } = await supabase.storage
          .from('drawing_files')
          .upload(fileName, drawingBlob, {
            contentType: 'image/png',
            upsert: true
          });
          
        if (uploadError) {
          console.error('Error uploading drawing:', uploadError);
          throw new Error(`Failed to upload drawing: ${uploadError.message}`);
        }
        
        // Get the public URL for the uploaded file
        const { data: drawingUrl } = supabase.storage
          .from('drawing_files')
          .getPublicUrl(fileName);
        
        drawingPath = drawingUrl.publicUrl;
        console.log('Drawing uploaded successfully, URL:', drawingPath);
      }
      
      console.log("About to insert journal entry with user_id:", user.id);
      
      // Insert journal entry - RLS is disabled so no need for special permissions
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: journalType === 'text' ? content.trim() : null,
          audio_path: audioPath,
          drawing_path: drawingPath,
          entry_type: journalType,
        } as JournalEntry)
        .select();
        
      if (error) {
        console.error('Error inserting journal entry:', error);
        throw error;
      }
      
      toast({
        title: "Journal saved!",
        description: "Your journal entry has been saved successfully",
      });
      
      // Navigate to home page instead of journal
      navigate('/home');
    } catch (error: any) {
      console.error('Error saving journal:', error);
      toast({
        variant: "destructive",
        title: "Error saving journal",
        description: error.message || "There was an error saving your journal entry",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveJournal,
    isSaving
  };
}
