
import React, { useRef, useEffect } from 'react';
import { getMoodColor } from '@/utils/moodUtils';
import MoodDisplay from './mood/MoodDisplay';
import MoodButton from './mood/MoodButton';
import MoodSelector from './mood/MoodSelector';
import { useMoodWheel } from '@/hooks/useMoodWheel';
import { motion } from 'framer-motion';

// Define the moods in a consistent order
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

  // Create dynamic background gradient based on mood
  const gradientStyle = {
    background: `radial-gradient(circle at center, ${moodColor} 0%, ${moodColor}dd 60%, ${moodColor}aa 100%)`,
    transition: 'background 0.7s ease'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full text-center flex flex-col items-center justify-between relative overflow-hidden" 
      style={gradientStyle}
    >
      {/* Animated background waves */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <WaveBackground moodColor={moodColor} />
      </div>

      {/* App name */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.7, y: 0 }}
        className="absolute top-4 left-0 w-full text-xl font-bold text-white/70"
      >
        M(in)dvincible
      </motion.h1>

      {/* Mood Display Component */}
      <MoodDisplay selectedMood={selectedMood} />
      
      {/* Mood Selection Button */}
      <MoodButton selectedMood={selectedMood} onSelectMood={onMoodSelect} />
      
      {/* Horizontally scrollable Mood Selector Component */}
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
    </motion.div>
  );
};

// Wave background component for animation
const WaveBackground: React.FC<{ moodColor: string }> = ({ moodColor }) => {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        animate={{ 
          y: [0, 5, 0],
          opacity: [0.7, 0.9, 0.7]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <motion.path
            d="M0,800 C300,700 400,900 1000,800 L1000,1000 L0,1000 Z"
            fill={`${moodColor}33`}
            animate={{
              d: [
                "M0,800 C300,700 400,900 1000,800 L1000,1000 L0,1000 Z",
                "M0,850 C300,750 400,950 1000,850 L1000,1000 L0,1000 Z",
                "M0,800 C300,700 400,900 1000,800 L1000,1000 L0,1000 Z"
              ]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 10,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ 
          y: [0, -8, 0],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.5
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <motion.path
            d="M0,700 C250,650 350,720 1000,680 L1000,1000 L0,1000 Z"
            fill={`${moodColor}22`}
            animate={{
              d: [
                "M0,700 C250,650 350,720 1000,680 L1000,1000 L0,1000 Z",
                "M0,720 C250,670 350,740 1000,700 L1000,1000 L0,1000 Z",
                "M0,700 C250,650 350,720 1000,680 L1000,1000 L0,1000 Z"
              ]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 12,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>
    </>
  );
};

export default MoodMeter;
