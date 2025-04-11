
import React, { useState } from 'react';
import SectionBase from './SectionBase';
import { Volume2, Wand2 } from 'lucide-react';
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
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2500);
  };

  return (
    <div>
      <div className="flex justify-center mb-6">
        <motion.div 
          className="p-3 bg-[#D5D5F1]/10 rounded-full relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerAnimation}
        >
          <Volume2 className="h-10 w-10 text-[#D5D5F1]" />
          
          {/* Sound waves animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-[#D5D5F1]/70"
                initial={{ scale: 1, opacity: 0 }}
                animate={isAnimating ? { 
                  scale: [1, 1 + (i * 0.2)], 
                  opacity: [0.8, 0] 
                } : { scale: 1, opacity: 0 }}
                transition={{ 
                  repeat: isAnimating ? 2 : 0, 
                  duration: 0.8, 
                  delay: i * 0.1,
                  ease: "easeOut" 
                }}
              />
            ))}
          </div>
          
          {/* Magic sparkle effect */}
          <motion.div
            className="absolute top-0 right-0 text-[#3DFDFF]"
            animate={isAnimating ? { 
              rotate: [0, 45, -45, 0],
              scale: [0.5, 1.2, 0.5],
              opacity: [0, 1, 0] 
            } : { opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <Wand2 size={18} />
          </motion.div>
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
