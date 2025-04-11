
import React from 'react';
import SectionBase from './SectionBase';
import { Heart } from 'lucide-react';

interface EmotionSectionProps {
  textValue: string;
  drawingBlob: Blob | null;
  onSaveText: (text: string) => void;
  onSaveDrawing: (blob: Blob | null) => void;
}

const EmotionSection: React.FC<EmotionSectionProps> = ({
  textValue,
  drawingBlob,
  onSaveText,
  onSaveDrawing
}) => {
  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-[#FC68B3]/10 rounded-full">
          <Heart className="h-10 w-10 text-[#FC68B3]" />
        </div>
      </div>
      
      <SectionBase
        title="What are you feeling right now?"
        description="Take a moment and check in with yourself—what emotion are you feeling? It could be something like happy, sad, annoyed, nervous, or excited. There’s no right or wrong answer!"
        textPlaceholder="I'm feeling..."
        textValue={textValue}
        drawingBlob={drawingBlob}
        onSaveText={onSaveText}
        onSaveDrawing={onSaveDrawing}
      />
    </div>
  );
};

export default EmotionSection;
