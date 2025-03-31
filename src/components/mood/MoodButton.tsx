
import React from 'react';
import { motion } from 'framer-motion';

interface MoodButtonProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
}

const MoodButton: React.FC<MoodButtonProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <motion.button 
      whileHover={{
        scale: 1.05
      }} 
      whileTap={{
        scale: 0.95
      }} 
      onClick={() => onSelectMood(selectedMood)} 
      className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-medium shadow-lg mt-8 w-64 border border-white/30 transition-all hover:bg-white/30" 
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 2px 8px rgba(255,255,255,0.15) inset'
      }}
    >
      Tap to pick your mood
    </motion.button>
  );
};

export default MoodButton;
