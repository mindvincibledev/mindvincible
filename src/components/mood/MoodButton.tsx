
import React from 'react';
import { motion } from 'framer-motion';

interface MoodButtonProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
}

const MoodButton: React.FC<MoodButtonProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelectMood(selectedMood)} 
      className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-medium shadow-lg mt-8 mb-12 w-64 border border-white/30 transition-all relative overflow-hidden group"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 2px 8px rgba(255,255,255,0.15) inset'
      }}
    >
      {/* Shimmer effect */}
      <motion.div 
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        animate={{
          x: ["100%", "-100%"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 3,
          ease: "easeInOut",
        }}
      />
      
      <span className="relative z-10 flex items-center justify-center">
        <span className="mr-2">Tap to pick your mood</span>
        <motion.span
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          👆
        </motion.span>
      </span>
    </motion.button>
  );
};

export default MoodButton;
