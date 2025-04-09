
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import JournalTypeSelector from '@/components/journal/JournalTypeSelector';
import TextJournal from '@/components/journal/TextJournal';
import AudioJournal from '@/components/journal/AudioJournal';
import DrawingJournal from '@/components/journal/DrawingJournal';
import JournalHeader from '@/components/journal/JournalHeader';
import { useJournalSave } from '@/hooks/useJournalSave';

type JournalType = 'text' | 'audio' | 'drawing';

const JournalEntry = () => {
  const [journalType, setJournalType] = useState<JournalType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [drawingBlob, setDrawingBlob] = useState<Blob | null>(null);
  
  const { saveJournal, isSaving } = useJournalSave();

  const handleSaveJournal = () => {
    saveJournal({
      journalType,
      title,
      content,
      audioBlob,
      drawingBlob
    });
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-24 w-[101%]">
          <div className="max-w-[calc(3xl+10%)] mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 p-8 shadow-lg">
              <JournalHeader 
                title="Create New Journal Entry"
                isSaving={isSaving}
                onSave={handleSaveJournal}
              />
              
              {/* Added mt-12 to create more space between the save button and type selector */}
              <div className="mt-12">
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
            </div>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default JournalEntry;
