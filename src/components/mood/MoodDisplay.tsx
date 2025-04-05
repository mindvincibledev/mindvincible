
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodDisplayProps {
  selectedMood: string;
}

const MoodDisplay: React.FC<MoodDisplayProps> = ({ selectedMood }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full px-6 pt-20 pb-6">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-medium text-white mb-4"
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
          className="relative text-7xl md:text-8xl lg:text-9xl font-bold text-white my-6 md:my-8 tracking-tight" 
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.15)'
          }}
        >
          {selectedMood}
          
          {/* Bubble decorative elements */}
          <motion.div 
            className="absolute -top-10 -left-10 w-60 h-60 rounded-full bg-white/10 blur-2xl -z-10"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl -z-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
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
