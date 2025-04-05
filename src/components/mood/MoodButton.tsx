
import React from 'react';
import { motion } from 'framer-motion';

interface MoodButtonProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
}

const MoodButton: React.FC<MoodButtonProps> = ({ selectedMood, onSelectMood }) => {
  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.2;
    audio.play().catch(err => console.log('Button click audio error:', err));
  };
  
  const handleClick = () => {
    playClickSound();
    onSelectMood(selectedMood);
  };
  
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick} 
      className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-medium shadow-lg my-6 w-64 border border-white/30 transition-all relative overflow-hidden group"
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <span className="relative z-10">Tap to pick your mood</span>
    </motion.button>
  );
};

export default MoodButton;
