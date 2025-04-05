import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

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

      // Handle file upload if needed
      let audioPath = null;
      let drawingPath = null;
      
      if (journalType === 'audio' && audioBlob) {
        const timestamp = Date.now();
        const fileName = `audio_${timestamp}.webm`;
        
        // Upload audio file using the updated approach
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('journal_files')
          .upload(`${user.id}/${fileName}`, audioBlob, {
            contentType: 'audio/webm',
            upsert: true
          });
          
        if (uploadError) {
          console.error('Error uploading audio:', uploadError);
          throw new Error(`Failed to upload audio: ${uploadError.message}`);
        }
        
        audioPath = `${user.id}/${fileName}`;
        console.log('Audio uploaded successfully:', uploadData);
      }
      
      if (journalType === 'drawing' && drawingBlob) {
        const timestamp = Date.now();
        const fileName = `drawing_${timestamp}.png`;
        
        // Upload drawing file using the updated approach
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('journal_files')
          .upload(`${user.id}/${fileName}`, drawingBlob, {
            contentType: 'image/png',
            upsert: true
          });
          
        if (uploadError) {
          console.error('Error uploading drawing:', uploadError);
          throw new Error(`Failed to upload drawing: ${uploadError.message}`);
        }
        
        drawingPath = `${user.id}/${fileName}`;
        console.log('Drawing uploaded successfully:', uploadData);
      }
      
      // Insert journal entry
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: journalType === 'text' ? content.trim() : null,
          audio_path: audioPath,
          drawing_path: drawingPath,
          entry_type: journalType,
        });
        
      if (error) throw error;
      
      toast({
        title: "Journal saved!",
        description: "Your journal entry has been saved successfully",
      });
      
      navigate('/journal');
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
