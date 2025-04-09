
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Mic, Brush } from 'lucide-react';

type JournalType = 'text' | 'audio' | 'drawing';

interface JournalTypeSelectorProps {
  selectedType: JournalType;
  onTypeChange: (type: JournalType) => void;
}

const JournalTypeSelector: React.FC<JournalTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="flex flex-wrap gap-6 justify-center mb-8">
      <Button
        onClick={() => onTypeChange('text')}
        className={`flex items-center gap-2 px-6 py-3 ${
          selectedType === 'text'
            ? 'bg-[#FC68B3] hover:bg-[#FC68B3]/90 shadow-lg scale-105'
            : 'bg-[#FC68B3]/40 hover:bg-[#FC68B3]/60 border border-[#FC68B3]/30'
        } rounded-lg transition-all duration-300 hover:scale-105`}
        aria-label="Text journal"
      >
        <FileText className="h-5 w-5" />
        <span>Text</span>
      </Button>
      
      <Button
        onClick={() => onTypeChange('audio')}
        className={`flex items-center gap-2 px-6 py-3 ${
          selectedType === 'audio'
            ? 'bg-[#FF8A48] hover:bg-[#FF8A48]/90 shadow-lg scale-105'
            : 'bg-[#FF8A48]/40 hover:bg-[#FF8A48]/60 border border-[#FF8A48]/30'
        } rounded-lg transition-all duration-300 hover:scale-105`}
        aria-label="Audio journal"
      >
        <Mic className="h-5 w-5" />
        <span>Audio</span>
      </Button>
      
      <Button
        onClick={() => onTypeChange('drawing')}
        className={`flex items-center gap-2 px-6 py-3 ${
          selectedType === 'drawing'
            ? 'bg-[#3DFDFF] hover:bg-[#3DFDFF]/90 shadow-lg scale-105 text-black'
            : 'bg-[#3DFDFF]/40 hover:bg-[#3DFDFF]/60 border border-[#3DFDFF]/30 text-black'
        } rounded-lg transition-all duration-300 hover:scale-105`}
        aria-label="Drawing journal"
      >
        <Brush className="h-5 w-5" />
        <span>Drawing</span>
      </Button>
    </div>
  );
};

export default JournalTypeSelector;
