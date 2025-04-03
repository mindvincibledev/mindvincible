
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodDisplayProps {
  selectedMood: string;
}

const MoodDisplay: React.FC<MoodDisplayProps> = ({ selectedMood }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full px-6 pt-20 pb-12">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white/90 mb-8 tracking-wide"
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
          className="relative text-7xl md:text-8xl lg:text-9xl font-extrabold text-white my-10 md:my-12 tracking-tight" 
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.15)'
          }}
        >
          {selectedMood}
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm -z-10"></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoodDisplay;
