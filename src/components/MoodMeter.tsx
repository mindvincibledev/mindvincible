
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Heart, Sun, Cloud, Moon, Smile, Brain, CloudRain, PiggyBank, Leaf } from 'lucide-react';

interface Mood {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface Factor {
  name: string;
  icon: React.ReactNode;
}

const moods: Mood[] = [
  {
    name: 'Happy',
    icon: <Smile className="w-8 h-8 text-white" />,
    color: '#4CAF50',
    description: 'Feeling great!'
  },
  {
    name: 'Excited',
    icon: <Heart className="w-8 h-8 text-white" />,
    color: '#FF9800',
    description: 'Full of energy!'
  },
  {
    name: 'Neutral',
    icon: <Sun className="w-8 h-8 text-white" />,
    color: '#FFC107',
    description: 'Just okay'
  },
  {
    name: 'Angry',
    icon: <Cloud className="w-8 h-8 text-white" />,
    color: '#F44336',
    description: 'Feeling frustrated'
  },
  {
    name: 'Sad',
    icon: <Moon className="w-8 h-8 text-white" />,
    color: '#2196F3',
    description: 'Not feeling great'
  }
];

const factors: Factor[] = [
  { name: 'Relationships', icon: <Heart className="w-8 h-8" /> },
  { name: 'Mental Health', icon: <Brain className="w-8 h-8" /> },
  { name: 'Weather', icon: <Sun className="w-8 h-8" /> },
  { name: 'Sleep', icon: <Moon className="w-8 h-8" /> },
  { name: 'Work/School', icon: <PiggyBank className="w-8 h-8" /> },
  { name: 'Physical Health', icon: <Leaf className="w-8 h-8" /> }
];

interface MoodMeterProps {
  onMoodSelect: (mood: string, factors: string[]) => void;
}

const MoodMeter: React.FC<MoodMeterProps> = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<Mood>(moods[1]); // Default to Excited
  const [sliderValue, setSliderValue] = useState([1]); // Index of "Excited"
  const [showFactors, setShowFactors] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const moodIndex = Math.min(Math.floor(value[0]), moods.length - 1);
    setSelectedMood(moods[moodIndex]);
  };
  
  const handleMoodClick = () => {
    setShowFactors(true);
  };
  
  const toggleFactor = (factorName: string) => {
    if (selectedFactors.includes(factorName)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factorName));
    } else {
      setSelectedFactors([...selectedFactors, factorName]);
    }
  };
  
  const handleSubmit = () => {
    onMoodSelect(selectedMood.name, selectedFactors);
  };
  
  return (
    <div className="w-full max-w-md">
      {!showFactors ? (
        <div className="min-h-[80vh] flex flex-col items-center justify-between pt-10 pb-20 relative">
          <div 
            className="w-full h-full absolute inset-0 rounded-3xl -z-10" 
            style={{ 
              background: `linear-gradient(135deg, ${selectedMood.color}, ${selectedMood.color}DD)`,
              opacity: 0.9
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center mt-20 flex-1"
          >
            <h2 className="text-2xl text-white/90 font-medium mb-4">I'm feeling</h2>
            <h1 className="text-6xl font-bold text-white mb-6">
              {selectedMood.name}
            </h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMoodClick}
              className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-medium shadow-lg mt-10 hover:bg-white/30 transition-colors"
            >
              Tap to pick your mood
            </motion.button>
          </motion.div>
          
          <div className="w-full px-6 relative">
            <div className="absolute -top-20 left-0 right-0 flex justify-between px-4 text-white/60">
              <div className="rotate-[-15deg] flex items-center">
                <span>Sad</span>
                <svg className="h-5 w-5 ml-1" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="rotate-[15deg] flex items-center">
                <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Happy</span>
              </div>
            </div>
            
            <div className="h-12 mb-6 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden">
              <Slider
                defaultValue={[1]}
                max={moods.length - 1}
                step={1}
                value={sliderValue}
                onValueChange={handleSliderChange}
                className="mb-10"
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-white/10 rounded-t-[60px] -mb-10"></div>
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Select your mood
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            {moods.map((mood, index) => (
              <div 
                key={mood.name} 
                className={`flex flex-col items-center ${index === 4 ? 'col-span-2 mx-auto' : ''}`}
              >
                <button
                  onClick={() => setSelectedMood(mood)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform ${
                    selectedMood.name === mood.name ? 'ring-4 ring-white scale-110' : 'opacity-90 hover:scale-105'
                  }`}
                  style={{ backgroundColor: mood.color }}
                >
                  {mood.icon}
                </button>
                <h3 className="mt-2 font-semibold text-center text-white">{mood.name}</h3>
                <p className="text-sm text-white/80 text-center">{mood.description}</p>
              </div>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mt-8 mb-6">
            What's contributing to these feelings?
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {factors.map(factor => (
              <button
                key={factor.name}
                onClick={() => toggleFactor(factor.name)}
                className={`bg-white rounded-xl p-4 flex flex-col items-center justify-center h-32 transition-colors ${
                  selectedFactors.includes(factor.name) 
                    ? 'bg-opacity-90 border-2 border-blue-500' 
                    : 'bg-opacity-50 hover:bg-opacity-70'
                }`}
              >
                {factor.icon}
                <span className="mt-2 font-medium text-gray-800">{factor.name}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-10 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="px-8 py-4 rounded-full bg-white text-purple-600 text-lg font-semibold shadow-lg hover:bg-opacity-90 transition-colors"
            >
              Confirm
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodMeter;
