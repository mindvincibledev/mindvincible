
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
        title="How intense is this emotion?"
        description="Describe the strength or intensity of what you're feeling."
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
