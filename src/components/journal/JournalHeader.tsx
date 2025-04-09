
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface JournalHeaderProps {
  title: string;
  isSaving: boolean;
  onSave: () => void;
}

const JournalHeader: React.FC<JournalHeaderProps> = ({ title, isSaving, onSave }) => {
  return (
    <>
      <h1 className="text-4xl font-bold text-black text-center mb-8">{title}</h1>
      
      <div className="flex justify-center">
        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-white px-8 py-6 text-lg flex items-center gap-3 transition-transform hover:scale-105"
        >
          <Save className="h-5 w-5" />
          {isSaving ? 'Saving...' : 'Save Journal Entry'}
        </Button>
      </div>
    </>
  );
};

export default JournalHeader;
