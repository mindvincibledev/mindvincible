
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
      <div className="relative w-full max-w-md z-10">
        {/* Card container similar to the mood details screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 overflow-hidden p-6"
          style={{
            boxShadow: `0 8px 32px ${moodColor}33`,
            background: `radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)`,
            transition: 'box-shadow 0.5s ease, background 0.5s ease',
          }}
        >
          {/* App name */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.7, y: 0 }}
            className="text-xl font-bold text-white/70 mb-8"
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
