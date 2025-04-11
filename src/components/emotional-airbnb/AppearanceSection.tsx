
import React from 'react';
import SectionBase from './SectionBase';
import { Eye } from 'lucide-react';

interface AppearanceSectionProps {
  textValue: string;
  drawingBlob: Blob | null;
  onSaveText: (text: string) => void;
  onSaveDrawing: (blob: Blob | null) => void;
}

const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  textValue,
  drawingBlob,
  onSaveText,
  onSaveDrawing
}) => {
  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-[#3DFDFF]/10 rounded-full">
          <Eye className="h-10 w-10 text-[#3DFDFF]" />
        </div>
      </div>
      
      <SectionBase
        title="If your feeling had a look, what would it be?"
        description="Imagine your emotion as a shape, object, or color. This helps make your feelings more understandable and less overwhelming."
        textPlaceholder="This emotion looks like..."
        textValue={textValue}
        drawingBlob={drawingBlob}
        onSaveText={onSaveText}
        onSaveDrawing={onSaveDrawing}
      />
    </div>
  );
};

export default AppearanceSection;
