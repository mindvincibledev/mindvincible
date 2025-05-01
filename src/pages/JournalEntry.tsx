
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import JournalTypeSelector from '@/components/journal/JournalTypeSelector';
import TextJournal from '@/components/journal/TextJournal';
import AudioJournal from '@/components/journal/AudioJournal';
import DrawingJournal from '@/components/journal/DrawingJournal';
import { useJournalSave } from '@/hooks/useJournalSave';
import VisibilityToggle from '@/components/ui/VisibilityToggle';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

type JournalType = 'text' | 'audio' | 'drawing';

const JournalEntry = () => {
  const [journalType, setJournalType] = useState<JournalType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [drawingBlob, setDrawingBlob] = useState<Blob | null>(null);
  const [visibility, setVisibility] = useState(false); // Changed default to false
  const navigate = useNavigate();
  
  const { saveJournal, isSaving } = useJournalSave();

  const handleSaveJournal = () => {
    saveJournal({
      journalType,
      title,
      content,
      audioBlob,
      drawingBlob,
      visibility
    });
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-24 w-[101%]">
          <div className="max-w-[calc(3xl+10%)] mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 p-8 shadow-lg">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Create New Journal Entry</h2>
                <VisibilityToggle
                  isVisible={visibility}
                  onToggle={setVisibility}
                  description="Make visible to clinicians"
                />
              </div>

              {/* Added mt-16 to create more space between the save button and type selector */}
              <div className="mt-16">
                <JournalTypeSelector 
                  selectedType={journalType} 
                  onTypeChange={setJournalType} 
                />
              </div>
              
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
              
              {/* Add save button back */}
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleSaveJournal}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-black px-8 py-6 text-lg flex items-center gap-3 transition-transform hover:scale-105"
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
