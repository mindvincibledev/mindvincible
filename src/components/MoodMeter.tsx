
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

const moods = [
  'Happy',
  'Excited',
  'Calm',
  'Sad',
  'Angry',
  'Anxious',
  'Overwhelmed'
];

interface MoodMeterProps {
  onMoodSelect: (mood: string) => void;
}

const MoodMeter: React.FC<MoodMeterProps> = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState('Excited');
  const [sliderValue, setSliderValue] = useState([3]);
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const moodIndex = Math.min(Math.floor(value[0]), moods.length - 1);
    setSelectedMood(moods[moodIndex]);
  };
  
  return (
    <div className="w-full max-w-sm text-center flex flex-col items-center justify-between h-[80vh] py-12">
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-2xl text-white font-medium mb-28">I'm feeling</h2>
          <h1 className="text-6xl font-bold text-white">
            {selectedMood}
          </h1>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMoodSelect(selectedMood)}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF8A48] to-[#FFB07C] text-white text-lg font-medium shadow-lg mt-16"
        >
          Tap to pick your mood
        </motion.button>
      </div>
      
      <div className="w-full mt-8 relative">
        <div className="absolute -bottom-12 left-0 right-0">
          <div className="relative">
            <div className="absolute -top-2 left-0 transform -translate-y-full flex items-center">
              <div className="text-[#FF5757] opacity-70 rotate-[-15deg] flex items-center">
                <span>Angry</span>
                <svg className="h-6 w-6 ml-1" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="absolute -top-2 right-0 transform -translate-y-full flex items-center">
              <div className="text-[#FFD36B] opacity-70 rotate-[15deg] flex items-center">
                <svg className="h-6 w-6 mr-1" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Happy</span>
              </div>
            </div>
          </div>
        </div>
        
        <Slider
          defaultValue={[3]}
          max={moods.length - 1}
          step={1}
          value={sliderValue}
          onValueChange={handleSliderChange}
          className="mb-10"
        />
      </div>
    </div>
  );
};

export default MoodMeter;
