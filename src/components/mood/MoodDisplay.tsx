
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodColor } from '@/utils/moodUtils';

interface MoodDisplayProps {
  selectedMood: string;
}

const MoodDisplay: React.FC<MoodDisplayProps> = ({ selectedMood }) => {
  const moodColor = getMoodColor(selectedMood);
  
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full px-4 pt-4 pb-6 z-10">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-medium text-black mb-2"
      >
        I'm feeling
      </motion.h2>
      
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
          className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-black my-4 md:my-6 tracking-tight" 
          style={{
            textShadow: '0 2px 10px rgba(255,255,255,0.5)'
          }}
        >
          {selectedMood}
          
          {/* Simple decorative elements with enhanced colors */}
          <motion.div 
            className="absolute -top-8 -left-8 w-32 h-32 rounded-full -z-10"
            style={{
              background: `${moodColor}50`
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div 
            className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full -z-10"
            style={{
              background: `${moodColor}40`
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoodDisplay;
