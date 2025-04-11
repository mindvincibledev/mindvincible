
import React from 'react';
import SectionBase from './SectionBase';
import { MessageCircle } from 'lucide-react';

interface MessageSectionProps {
  textValue: string;
  drawingBlob: Blob | null;
  onSaveText: (text: string) => void;
  onSaveDrawing: (blob: Blob | null) => void;
}

const MessageSection: React.FC<MessageSectionProps> = ({
  textValue,
  drawingBlob,
  onSaveText,
  onSaveDrawing
}) => {
  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-[#2AC20E]/10 rounded-full">
          <MessageCircle className="h-10 w-10 text-[#2AC20E]" />
        </div>
      </div>
      
      <SectionBase
        title="What is this feeling trying to tell you?"
        description="Emotions usually have a reason for showing up. Is it trying to get your attention or make you do something? Maybe it wants you to take a break, talk to someone, or stand up for yourself."
        textPlaceholder="This emotion is telling me..."
        textValue={textValue}
        drawingBlob={drawingBlob}
        onSaveText={onSaveText}
        onSaveDrawing={onSaveDrawing}
      />
    </div>
  );
};

export default MessageSection;
