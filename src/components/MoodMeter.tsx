
import React, { useRef } from 'react';
import { getMoodColor } from '@/utils/moodUtils';
import MoodDisplay from './mood/MoodDisplay';
import MoodButton from './mood/MoodButton';
import MoodSelector from './mood/MoodSelector';
import { useMoodWheel } from '@/hooks/useMoodWheel';

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
    <div 
      className="w-full h-full text-center flex flex-col items-center justify-between relative overflow-hidden" 
      style={{
        background: `linear-gradient(135deg, ${moodColor} 0%, ${moodColor}99 50%, ${moodColor}66 100%)`,
        transition: 'background 0.7s ease'
      }}
    >
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
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm"></div>
      <div className="absolute top-40 right-10 w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm"></div>
    </div>
  );
};

export default MoodMeter;
