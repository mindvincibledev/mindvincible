
import React from 'react';
import SectionBase from './SectionBase';
import { MapPin } from 'lucide-react';

interface LocationSectionProps {
  textValue: string;
  drawingBlob: Blob | null;
  onSaveText: (text: string) => void;
  onSaveDrawing: (blob: Blob | null) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  textValue,
  drawingBlob,
  onSaveText,
  onSaveDrawing
}) => {
  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-[#FF8A48]/10 rounded-full">
          <MapPin className="h-10 w-10 text-[#FF8A48]" />
        </div>
      </div>
      
      <SectionBase
        title="Where do you feel it in your body?"
        description="Emotions often show up in our bodies. For example, stress might feel like tight shoulders or a racing heart. Where do you notice this feeling? Just one part, or all over?"
        textPlaceholder="I feel it in my..."
        textValue={textValue}
        drawingBlob={drawingBlob}
        onSaveText={onSaveText}
        onSaveDrawing={onSaveDrawing}
      />
    </div>
  );
};

export default LocationSection;
