
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(1); // Default to Excited
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Calculate selected mood based on index
  const selectedMood = moods[selectedMoodIndex];
  
  // Handle scroll wheel navigation
  const handleScroll = (direction: 'up' | 'down') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    let newIndex = selectedMoodIndex;
    if (direction === 'up') {
      newIndex = (selectedMoodIndex - 1 + moods.length) % moods.length;
    } else {
      newIndex = (selectedMoodIndex + 1) % moods.length;
    }
    
    setSelectedMoodIndex(newIndex);
    
    // Reset animation flag after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  // Handle wheel scroll event
  useEffect(() => {
    const handleWheelScroll = (e: WheelEvent) => {
      if (isAnimating) return;
      
      if (e.deltaY < 0) {
        handleScroll('up');
      } else {
        handleScroll('down');
      }
    };
    
    const wheelElement = wheelRef.current;
    if (wheelElement) {
      wheelElement.addEventListener('wheel', handleWheelScroll);
    }
    
    return () => {
      if (wheelElement) {
        wheelElement.removeEventListener('wheel', handleWheelScroll);
      }
    };
  }, [selectedMoodIndex, isAnimating]);
  
  return (
    <div className="w-full max-w-sm text-center flex flex-col items-center justify-between h-[80vh] py-12">
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl text-white font-medium mb-20">I'm feeling</h2>
          
          <div 
            ref={wheelRef}
            className="mood-wheel relative h-[240px] flex items-center justify-center overflow-hidden my-8"
          >
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
            
            <button 
              onClick={() => handleScroll('up')}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            >
              <ChevronUp size={24} />
            </button>
            
            <div className="wheel-content relative w-full">
              {moods.map((mood, index) => {
                // Calculate distance from current selected index
                const distance = Math.abs(index - selectedMoodIndex);
                const isCurrent = index === selectedMoodIndex;
                
                // Use modular arithmetic to handle circular distance
                const circularDistance = Math.min(
                  distance,
                  moods.length - distance
                );
                
                // Calculate opacity and scale based on distance
                const opacity = 1 - circularDistance * 0.25;
                const scale = 1 - circularDistance * 0.15;
                const yOffset = (index - selectedMoodIndex) * 60;
                
                return (
                  <motion.div
                    key={mood}
                    initial={false}
                    animate={{
                      y: yOffset,
                      scale,
                      opacity: opacity > 0 ? opacity : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 1
                    }}
                    onClick={() => !isAnimating && setSelectedMoodIndex(index)}
                    className={`mood-item absolute left-0 right-0 cursor-pointer py-2 ${
                      isCurrent ? 'text-6xl font-bold text-white' : 'text-4xl font-medium text-white/70'
                    }`}
                  >
                    {mood}
                  </motion.div>
                );
              })}
            </div>
            
            <button 
              onClick={() => handleScroll('down')}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            >
              <ChevronDown size={24} />
            </button>
            
            <div className="pointer-events-none absolute inset-y-1/2 left-0 right-0 h-16 -translate-y-1/2 border-t-2 border-b-2 border-[#FF8A48]/30" />
          </div>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMoodSelect(selectedMood)}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF8A48] to-[#FFB07C] text-white text-lg font-medium shadow-lg mt-8"
        >
          Tap to pick your mood
        </motion.button>
      </div>
    </div>
  );
};

export default MoodMeter;
