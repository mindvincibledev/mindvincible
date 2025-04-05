
import React from 'react';
import { motion } from 'framer-motion';
import { getMoodColor } from '@/utils/moodUtils';

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
      className="px-8 py-3 rounded-full bg-white/30 backdrop-blur-sm text-white text-lg font-medium my-4 w-full max-w-56 relative overflow-hidden group z-10 transform-gpu"
      style={{ 
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Button highlight effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <span className="relative z-10">Tap to pick your mood</span>
    </motion.button>
  );
};

export default MoodButton;
