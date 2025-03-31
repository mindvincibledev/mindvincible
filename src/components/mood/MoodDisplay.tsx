
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodDisplayProps {
  selectedMood: string;
}

const MoodDisplay: React.FC<MoodDisplayProps> = ({ selectedMood }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full px-6 pt-20 pb-12">
      <h2 className="text-2xl font-bold text-white/90 mb-8 tracking-wide">I'm feeling</h2>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedMood} 
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.9
          }} 
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }} 
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.9
          }} 
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }} 
          className="relative text-7xl md:text-8xl lg:text-9xl font-extrabold text-white my-10 md:my-12 tracking-tight" 
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.15)'
          }}
        >
          {selectedMood}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoodDisplay;
