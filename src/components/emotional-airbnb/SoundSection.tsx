
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
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="p-3 bg-[#D5D5F1]/10 rounded-full relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-[#D5D5F1]/5"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut" 
            }}
          />
          <Volume2 className="h-10 w-10 text-[#D5D5F1] relative z-10" />
          
          {/* Sound wave effect */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D5D5F1]/20"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5,
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
      
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
