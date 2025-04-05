
import React from 'react';
import { motion } from 'framer-motion';
import { getMoodColor } from '@/utils/moodUtils';

interface MoodButtonProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
}

const MoodButton: React.FC<MoodButtonProps> = ({ selectedMood, onSelectMood }) => {
  const moodColor = getMoodColor(selectedMood);
  
  const playClickSound = () => {
    try {
      const audio = new Audio('/click.mp3');
      audio.volume = 0.2;
      audio.play().catch(err => console.log('Button click audio error:', err));
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  };
  
  const handleClick = () => {
    playClickSound();
    onSelectMood(selectedMood);
  };
  
  return (
    <div className="relative z-10">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        className="relative px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-medium shadow-lg my-6 w-64 border border-white/30 overflow-hidden"
        style={{ 
          boxShadow: `0 4px 20px ${moodColor}40`
        }}
      >
        {/* Button light effect inside the button */}
        <motion.div 
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ 
            background: `radial-gradient(circle at center, ${moodColor}40 0%, transparent 70%)`
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* Button highlight effect inside the button */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        
        {/* Text stays centered */}
        <span className="relative z-10">Tap to pick your mood</span>
      </motion.button>
    </div>
  );
};

export default MoodButton;
