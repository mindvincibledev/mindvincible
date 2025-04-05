
import React, { useRef, useEffect, useState } from 'react';
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
  const [hoveredMoodIndex, setHoveredMoodIndex] = useState<number | null>(null);
  
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
  // Use hovered mood color if available, otherwise use selected mood color
  const moodColor = hoveredMoodIndex !== null 
    ? getMoodColor(moods[hoveredMoodIndex]) 
    : getMoodColor(selectedMood);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full text-center flex flex-col items-center justify-center px-4 py-8"
    >
      {/* Full screen background that changes with mood - no gradient, solid color with slight transparency */}
      <motion.div 
        className="absolute inset-0 -z-10"
        animate={{ 
          backgroundColor: moodColor
        }}
        transition={{ duration: 0.3 }}
        style={{ opacity: 0.9 }} // Higher opacity for stronger colors
      />
      
      <div className="relative w-full max-w-md z-10">
        {/* Card container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden p-6"
        >
          {/* App name */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-white mb-8"
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
            onMoodHover={setHoveredMoodIndex}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodMeter;
