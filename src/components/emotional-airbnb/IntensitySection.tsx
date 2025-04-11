
import React from 'react';
import SectionBase from './SectionBase';
import { Activity } from 'lucide-react';

interface IntensitySectionProps {
  textValue: string;
  drawingBlob: Blob | null;
  onSaveText: (text: string) => void;
  onSaveDrawing: (blob: Blob | null) => void;
}

const IntensitySection: React.FC<IntensitySectionProps> = ({
  textValue,
  drawingBlob,
  onSaveText,
  onSaveDrawing
}) => {
  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-[#F5DF4D]/10 rounded-full">
          <Activity className="h-10 w-10 text-[#F5DF4D]" />
        </div>
      </div>
      
      <SectionBase
        title="How big or strong is the feeling?"
        description="Think about the size or intensity of the emotion. Is it small and barely there, or huge and taking over? Does it feel heavy or light?"
        textPlaceholder="The intensity feels like..."
        textValue={textValue}
        drawingBlob={drawingBlob}
        onSaveText={onSaveText}
        onSaveDrawing={onSaveDrawing}
      />
    </div>
  );
};

export default IntensitySection;
