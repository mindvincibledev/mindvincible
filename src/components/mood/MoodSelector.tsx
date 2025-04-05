
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MoodSelectorProps {
  moods: string[];
  selectedMoodIndex: number;
  onMoodSelect: (index: number) => void;
  onChangeMood: (direction: 'left' | 'right') => void;
  wheelRef: React.RefObject<HTMLDivElement>;
  handleTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  handleTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  handleTouchEnd: () => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  moods,
  selectedMoodIndex,
  onMoodSelect,
  onChangeMood,
  wheelRef,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}) => {
  return (
    <div 
      ref={wheelRef} 
      className="w-full h-64 relative mt-auto"
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove as any} 
      onTouchEnd={handleTouchEnd} 
      onMouseDown={handleTouchStart} 
      onMouseMove={handleTouchMove as any} 
      onMouseUp={handleTouchEnd} 
      onMouseLeave={handleTouchEnd}
    >
      {/* Background gradient */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white/20 to-transparent rounded-t-lg"></div>
      
      {/* Horizontal scrollable mood selector */}
      <div className="absolute bottom-12 left-0 w-full">
        <div className="relative px-8 py-4">
          {/* Left navigation button */}
          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onChangeMood('left');
            }}
          >
            <ChevronLeft className="text-white w-6 h-6" />
          </motion.button>
          
          {/* Mood options */}
          <ScrollArea className="w-full overflow-x-auto px-10">
            <div className="flex items-center space-x-8 py-2 px-4 min-w-max">
              {moods.map((mood, index) => {
                const isSelected = index === selectedMoodIndex;
                
                return (
                  <motion.div 
                    key={mood}
                    className={`flex flex-col items-center cursor-pointer transition-all px-2 py-1 rounded-lg ${
                      isSelected ? 'bg-white/10 backdrop-blur-sm' : ''
                    }`}
                    animate={{ 
                      opacity: isSelected ? 1 : 0.6,
                      scale: isSelected ? 1.1 : 1,
                      transition: { duration: 0.3 }
                    }}
                    onClick={() => onMoodSelect(index)}
                  >
                    <span 
                      className={`text-xl md:text-2xl font-bold whitespace-nowrap ${
                        isSelected ? 'text-white' : 'text-white/70'
                      }`}
                      style={{
                        textShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      {mood}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
          
          {/* Right navigation button */}
          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onChangeMood('right');
            }}
          >
            <ChevronRight className="text-white w-6 h-6" />
          </motion.button>
        </div>
      </div>
      
      {/* Current position indicator dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {moods.map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full cursor-pointer"
            animate={{
              scale: i === selectedMoodIndex ? 1.2 : 1,
              backgroundColor: i === selectedMoodIndex ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.4)'
            }}
            whileHover={{ scale: 1.3 }}
            onClick={() => onMoodSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
