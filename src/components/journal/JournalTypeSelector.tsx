
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
    <div className="flex flex-wrap gap-4 justify-center mb-6">
      <Button
        onClick={() => onTypeChange('text')}
        className={`flex items-center gap-2 px-4 py-2 ${
          selectedType === 'text'
            ? 'bg-[#FC68B3] hover:bg-[#FC68B3]/90'
            : 'bg-white/70 backdrop-blur-sm hover:bg-white/80 border border-[#FC68B3]/30'
        } rounded-lg transition-all`}
        aria-label="Text journal"
      >
        <FileText className="h-5 w-5" />
        <span>Text</span>
      </Button>
      
      <Button
        onClick={() => onTypeChange('audio')}
        className={`flex items-center gap-2 px-4 py-2 ${
          selectedType === 'audio'
            ? 'bg-[#FF8A48] hover:bg-[#FF8A48]/90'
            : 'bg-white/70 backdrop-blur-sm hover:bg-white/80 border border-[#FF8A48]/30'
        } rounded-lg transition-all`}
        aria-label="Audio journal"
      >
        <Mic className="h-5 w-5" />
        <span>Audio</span>
      </Button>
      
      <Button
        onClick={() => onTypeChange('drawing')}
        className={`flex items-center gap-2 px-4 py-2 ${
          selectedType === 'drawing'
            ? 'bg-[#3DFDFF] hover:bg-[#3DFDFF]/90 text-black'
            : 'bg-white/70 backdrop-blur-sm hover:bg-white/80 border border-[#3DFDFF]/30'
        } rounded-lg transition-all`}
        aria-label="Drawing journal"
      >
        <Brush className="h-5 w-5" />
        <span>Drawing</span>
      </Button>
    </div>
  );
};

export default JournalTypeSelector;
