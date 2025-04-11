
import React from 'react';
import SectionBase from './SectionBase';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <motion.div 
          className="p-3 bg-[#D5D5F1]/10 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Volume2 className="h-10 w-10 text-[#D5D5F1]" />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SectionBase
          title="If your emotion made a sound, how loud would it be?"
          description="Picture your emotion like it's making noise. Is it quiet like a whisper, or loud like a scream? This helps you understand how much space the feeling is taking up in your mind."
          textPlaceholder="The sound of this emotion is..."
          textValue={textValue}
          drawingBlob={drawingBlob}
          onSaveText={onSaveText}
          onSaveDrawing={onSaveDrawing}
        />
      </motion.div>
    </div>
  );
};

export default SoundSection;
