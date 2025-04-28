
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useMoodWheel } from '@/hooks/useMoodWheel';

interface PowerOfHiMoodSelectorProps {
  moods: string[];
  selectedMoodIndex: number;
  onMoodSelect: (moodIndex: number) => void;
}

const PowerOfHiMoodSelector = ({ moods, selectedMoodIndex, onMoodSelect }: PowerOfHiMoodSelectorProps) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const {
    changeMood,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useMoodWheel({ 
    moodsCount: moods.length, 
    initialMoodIndex: selectedMoodIndex, 
    wheelRef 
  });

  return (
    <div 
      className="relative w-full overflow-hidden my-4 py-2"
      ref={wheelRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="relative flex justify-center">
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-gray-100 rounded-full shadow-md"
          onClick={() => changeMood('left')}
          aria-label="Previous mood"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex items-center px-10">
            {moods.map((mood, index) => (
              <motion.div
                key={mood}
                className={`snap-center cursor-pointer mx-2 flex-shrink-0 p-3 rounded-lg ${
                  index === selectedMoodIndex
                    ? 'bg-gradient-to-r from-[#FC68B3]/20 to-[#FF8A48]/20 scale-110 shadow-lg'
                    : 'bg-white/60 opacity-70'
                }`}
                animate={{
                  scale: index === selectedMoodIndex ? 1.1 : 0.9,
                  opacity: index === selectedMoodIndex ? 1 : 0.7,
                }}
                transition={{ duration: 0.2 }}
                onClick={() => onMoodSelect(index)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {index === 0 ? "😄" : 
                     index === 1 ? "🤩" : 
                     index === 2 ? "🥳" : 
                     index === 3 ? "😎" : 
                     index === 4 ? "😰" : 
                     index === 5 ? "😳" : 
                     index === 6 ? "😖" : "😨"}
                  </div>
                  <div className={`text-sm font-medium ${
                    index === selectedMoodIndex ? 'text-gray-900' : 'text-gray-600'
                  }`}>{mood}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-gray-100 rounded-full shadow-md"
          onClick={() => changeMood('right')}
          aria-label="Next mood"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PowerOfHiMoodSelector;
