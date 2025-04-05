
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import JournalTypeSelector from '@/components/journal/JournalTypeSelector';
import TextJournal from '@/components/journal/TextJournal';
import AudioJournal from '@/components/journal/AudioJournal';
import DrawingJournal from '@/components/journal/DrawingJournal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type JournalType = 'text' | 'audio' | 'drawing';

const JournalEntry = () => {
  const [journalType, setJournalType] = useState<JournalType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [drawingBlob, setDrawingBlob] = useState<Blob | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveJournal = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to save journal entries",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please provide a title for your journal entry",
      });
      return;
    }
    
    // For text entries, content is required
    if (journalType === 'text' && !content.trim()) {
      toast({
        variant: "destructive",
        title: "Content required",
        description: "Please write something in your journal entry",
      });
      return;
    }
    
    // For audio entries, blob is required
    if (journalType === 'audio' && !audioBlob) {
      toast({
        variant: "destructive",
        title: "Audio required",
        description: "Please record audio for your journal entry",
      });
      return;
    }
    
    // For drawing entries, blob is required
    if (journalType === 'drawing' && !drawingBlob) {
      toast({
        variant: "destructive",
        title: "Drawing required",
        description: "Please create a drawing for your journal entry",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Handle file upload if needed
      let audioPath = null;
      let drawingPath = null;
      
      if (journalType === 'audio' && audioBlob) {
        const timestamp = Date.now();
        const fileName = `audio_${user.id}_${timestamp}.webm`;
        const { error: uploadError } = await supabase.storage
          .from('journal_files')
          .upload(fileName, audioBlob);
          
        if (uploadError) throw uploadError;
        audioPath = fileName;
      }
      
      if (journalType === 'drawing' && drawingBlob) {
        const timestamp = Date.now();
        const fileName = `drawing_${user.id}_${timestamp}.png`;
        const { error: uploadError } = await supabase.storage
          .from('journal_files')
          .upload(fileName, drawingBlob);
          
        if (uploadError) throw uploadError;
        drawingPath = fileName;
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

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Create New Journal Entry</h1>
            
            <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg">
              <JournalTypeSelector 
                selectedType={journalType} 
                onTypeChange={setJournalType} 
              />
              
              <div className="mb-8">
                {journalType === 'text' && (
                  <TextJournal
                    onContentChange={setContent}
                    onTitleChange={setTitle}
                    title={title}
                    content={content}
                  />
                )}
                
                {journalType === 'audio' && (
                  <AudioJournal
                    onAudioChange={setAudioBlob}
                    onTitleChange={setTitle}
                    title={title}
                  />
                )}
                
                {journalType === 'drawing' && (
                  <DrawingJournal
                    onDrawingChange={setDrawingBlob}
                    onTitleChange={setTitle}
                    title={title}
                  />
                )}
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleSaveJournal}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-white px-8 py-6 text-lg flex items-center gap-3"
                >
                  <Save className="h-5 w-5" />
                  {isSaving ? 'Saving...' : 'Save Journal Entry'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default JournalEntry;
