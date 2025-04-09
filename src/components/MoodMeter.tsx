
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
  // Dim the color by 20%
  const moodColor = hoveredMoodIndex !== null 
    ? getMoodColor(moods[hoveredMoodIndex]) 
    : getMoodColor(selectedMood);
  
  // Function to dim a color by 20%
  const dimColor = (color: string) => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Dim by 20%
    const dimFactor = 0.8;
    const newR = Math.round(r * dimFactor);
    const newG = Math.round(g * dimFactor);
    const newB = Math.round(b * dimFactor);
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };
  
  const dimmedMoodColor = dimColor(moodColor);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full text-center flex flex-col items-center justify-center px-4 py-8"
    >
      <div className="relative w-full max-w-md z-10" style={{ maxWidth: "calc(100% * 1.1)" }}> {/* Increased width by 10% */}
        {/* Card container with more vibrant colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-lg rounded-2xl shadow-md border border-white/30 overflow-hidden p-6"
          style={{
            backgroundColor: `${dimmedMoodColor}`, // More saturated, solid color but dimmed
            transition: 'background-color 0.5s ease',
            boxShadow: `0 8px 32px ${dimmedMoodColor}50`
          }}
        >
          {/* App name */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-black mb-8"
          >
            M(in)dvincible
          </motion.h1>
          
          {/* Mood Display Component */}
          <MoodDisplay selectedMood={selectedMood} dimColor={dimColor} />
          
          {/* Mood Selection Button */}
          <MoodButton selectedMood={selectedMood} onSelectMood={onMoodSelect} dimColor={dimColor} />
          
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
            dimColor={dimColor}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodMeter;
