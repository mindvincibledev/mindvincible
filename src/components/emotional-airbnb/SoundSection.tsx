
import React from 'react';
import SectionBase from './SectionBase';
import { Volume2 } from 'lucide-react';

interface SoundSectionProps {
  textValue: string;
  drawingBlob: Blob | null;
  onSaveText: (text: string) => void;
  onSaveDrawing: (blob: Blob | null) => void;
}

const SoundSection: React.FC<SoundSectionProps> = ({
  textValue,
  drawingBlob,
  onSaveText,
  onSaveDrawing
}) => {
  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-[#D5D5F1]/10 rounded-full">
          <Volume2 className="h-10 w-10 text-[#D5D5F1]" />
        </div>
      </div>
      
      <SectionBase
        title="If your emotion made a sound, how loud would it be?"
        description="Picture your emotion like it's making noise. Is it quiet like a whisper, or loud like a scream? This helps you understand how much space the feeling is taking up in your mind."
        textPlaceholder="The sound of this emotion is..."
        textValue={textValue}
        drawingBlob={drawingBlob}
        onSaveText={onSaveText}
        onSaveDrawing={onSaveDrawing}
      />
    </div>
  );
};

export default SoundSection;
