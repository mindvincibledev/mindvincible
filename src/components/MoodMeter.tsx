
import React, { useRef } from 'react';
import { getMoodColor } from '@/utils/moodUtils';
import MoodDisplay from './mood/MoodDisplay';
import MoodButton from './mood/MoodButton';
import MoodSelector from './mood/MoodSelector';
import { useMoodWheel } from '@/hooks/useMoodWheel';
import { motion } from 'framer-motion';

const moods = ['Angry', 'Sad', 'Anxious', 'Calm', 'Happy', 'Excited', 'Overwhelmed'];

interface MoodMeterProps {
  onMoodSelect: (mood: string) => void;
}

const MoodMeter: React.FC<MoodMeterProps> = ({ onMoodSelect }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const {
    selectedMoodIndex,
    setSelectedMoodIndex,
    changeMood,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useMoodWheel({ 
    moodsCount: moods.length, 
    initialMoodIndex: 5, // Default to Excited
    wheelRef
  });

  // Calculate selected mood based on index
  const selectedMood = moods[selectedMoodIndex];
  const moodColor = getMoodColor(selectedMood);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-[calc(100vh-120px)] text-center flex flex-col items-center justify-between relative overflow-hidden pb-8" 
      style={{
        background: `linear-gradient(135deg, ${moodColor} 0%, ${moodColor}99 50%, ${moodColor}66 100%)`,
        transition: 'background 0.7s ease'
      }}
    >
      {/* Animated wave background */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-20 z-0"
        initial={{ backgroundPosition: '0% 0%' }}
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "mirror", 
          duration: 20,
          ease: "linear"
        }}
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 Q 25 25, 50 50 T 100 50 T 150 50' stroke='white' fill='none' stroke-width='5' opacity='0.5' /%3E%3Cpath d='M0 60 Q 25 35, 50 60 T 100 60 T 150 60' stroke='white' fill='none' stroke-width='4' opacity='0.4' /%3E%3Cpath d='M0 70 Q 25 45, 50 70 T 100 70 T 150 70' stroke='white' fill='none' stroke-width='3' opacity='0.3' /%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
        }}
      />
      
      {/* Mood Display Component */}
      <MoodDisplay selectedMood={selectedMood} />
      
      {/* Mood Selection Button */}
      <MoodButton selectedMood={selectedMood} onSelectMood={onMoodSelect} />
      
      {/* Mood Selector Component */}
      <MoodSelector 
        moods={moods}
        selectedMoodIndex={selectedMoodIndex}
        onMoodSelect={setSelectedMoodIndex}
        onChangeMood={changeMood}
        wheelRef={wheelRef}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />
      
      {/* Background decorative elements with motion */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute top-40 right-10 w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 4,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.div>
  );
};

export default MoodMeter;
