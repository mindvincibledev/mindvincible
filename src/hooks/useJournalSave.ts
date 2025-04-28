
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { JournalEntry } from '@/types/journal';
import { uploadPowerOfHiFile } from '@/utils/powerOfHiFileUtils';

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

      let audioPath = null;
      let drawingPath = null;
      
      // Handle audio file upload
      if (journalType === 'audio' && audioBlob) {
        try {
          const { path: filePath } = await uploadPowerOfHiFile(user.id, 'audio', audioBlob, 'audio');
          audioPath = filePath;
        } catch (error) {
          console.error('Error uploading audio:', error);
          throw new Error('Failed to upload audio file');
        }
      }
      
      // Handle drawing file upload
      if (journalType === 'drawing' && drawingBlob) {
        try {
          const { path: filePath } = await uploadPowerOfHiFile(user.id, 'drawing', drawingBlob, 'drawing');
          drawingPath = filePath;
        } catch (error) {
          console.error('Error uploading drawing:', error);
          throw new Error('Failed to upload drawing file');
        }
      }

      // Insert journal entry to database
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
      
      // Navigate to home page
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
