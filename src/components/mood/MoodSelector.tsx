
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMoodColor } from '@/utils/moodUtils';

interface MoodSelectorProps {
  moods: string[];
  selectedMoodIndex: number;
  onMoodSelect: (index: number) => void;
  onChangeMood: (direction: 'left' | 'right') => void;
  wheelRef: React.RefObject<HTMLDivElement>;
  handleTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  handleTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  handleTouchEnd: () => void;
  onMoodHover: (index: number | null) => void;
  dimColor?: (color: string) => string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  moods,
  selectedMoodIndex,
  onMoodSelect,
  onChangeMood,
  wheelRef,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  onMoodHover,
  dimColor
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Create an infinite mood array by repeating the moods
  const extendedMoods = [...moods, ...moods, ...moods]; // Triple the array for infinite scrolling effect
  const offsetIndex = moods.length + selectedMoodIndex; // Current position in the extended array

  // Center the selected mood whenever it changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedElement = container.querySelector(`[data-index="${offsetIndex}"]`) as HTMLElement;
      
      if (selectedElement) {
        const containerWidth = container.offsetWidth;
        const selectedWidth = selectedElement.offsetWidth;
        const selectedLeft = selectedElement.offsetLeft;
        
        // Calculate scroll position to center the selected element
        const scrollPosition = selectedLeft - (containerWidth / 2) + (selectedWidth / 2);
        
        // Smooth scroll to the position
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedMoodIndex, offsetIndex]);

  const moodColor = getMoodColor(moods[selectedMoodIndex]);
  const actualColor = dimColor ? dimColor(moodColor) : moodColor;

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
      onMouseLeave={() => {
        handleTouchEnd();
        onMoodHover(null);
      }}
    >
      {/* Wheel background with gradient */}
      <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-t from-white/30 via-white/20 to-transparent rounded-t-2xl">
        {/* Decorative circle elements */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-40 blur-md"
          style={{ background: `radial-gradient(circle, ${actualColor} 0%, transparent 70%)` }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
      </div>
      
      {/* Arched selector track */}
      <div className="absolute bottom-24 left-0 w-full px-4 py-2 pointer-events-none">
        <div 
          className="relative h-16 mx-auto" 
          style={{
            maxWidth: "calc(100% - 1.5rem)"
          }}
        >
          {/* Arched Track Background */}
          <svg 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0" 
            viewBox="0 0 400 80" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={`${actualColor}60`} />
                <stop offset="45%" stopColor={`${actualColor}90`} />
                <stop offset="55%" stopColor={`${actualColor}90`} />
                <stop offset="100%" stopColor={`${actualColor}60`} />
              </linearGradient>
            </defs>
            <path 
              d="M 0,60 C 130,30 270,30 400,60" 
              stroke="url(#trackGradient)" 
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
          
          {/* Selection Highlight */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full z-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${actualColor}80 0%, ${actualColor}40 50%, transparent 70%)`,
              filter: "blur(4px)"
            }}
          />
        </div>
      </div>
      
      {/* Scroll wheel UI */}
      <div className="absolute bottom-24 left-0 w-full px-12">
        <div className="relative">
          {/* Left navigation button - Fixed in absolute position */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
            <motion.button
              className="w-10 h-10 flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-full border border-white/40 transform-gpu"
              whileTap={{ scale: 0.9, opacity: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                onChangeMood('left');
              }}
            >
              <ChevronLeft className="text-black w-6 h-6" />
            </motion.button>
          </div>
          
          {/* The scroll wheel */}
          <div className="relative overflow-hidden mx-10 py-4">
            {/* Mood options container */}
            <div 
              ref={scrollContainerRef}
              className="flex items-center space-x-10 py-2 px-4 overflow-x-auto hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {/* Insert extra space at start for better UI balance */}
              <div className="w-[calc(50vw-60px)] shrink-0" />
              
              {extendedMoods.map((mood, index) => {
                const actualIndex = index % moods.length; // Map back to original index
                const isSelected = index === offsetIndex;
                
                return (
                  <motion.div 
                    key={`${mood}-${index}`}
                    data-index={index}
                    className="flex flex-col items-center justify-center cursor-pointer transition-all shrink-0"
                    animate={{ 
                      opacity: isSelected ? 1 : 0.7,
                      scale: isSelected ? 1.2 : 1,
                      y: isSelected ? -6 : 0,
                      transition: { duration: 0.3 }
                    }}
                    onMouseEnter={() => onMoodHover(actualIndex)}
                    onMouseLeave={() => onMoodHover(null)}
                    onClick={() => {
                      const adjustedIndex = (actualIndex >= 0) ? actualIndex : moods.length + actualIndex;
                      onMoodSelect(adjustedIndex);
                    }}
                  >
                    <motion.span 
                      className="text-xl font-bold whitespace-nowrap px-4 py-2"
                      style={{
                        color: 'black',
                        textShadow: isSelected ? '0 2px 8px rgba(255,255,255,0.6)' : 'none'
                      }}
                      animate={{
                        y: isSelected ? [0, -2, 0] : 0
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isSelected ? Infinity : 0,
                        repeatType: "reverse"
                      }}
                    >
                      {mood}
                    </motion.span>
                    
                    {/* Selection indicator dot */}
                    {isSelected && (
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-black mt-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                  </motion.div>
                );
              })}
              
              {/* Insert extra space at end for better UI balance */}
              <div className="w-[calc(50vw-60px)] shrink-0" />
            </div>
          </div>
          
          {/* Right navigation button - Fixed in absolute position */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10">
            <motion.button
              className="w-10 h-10 flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-full border border-white/40 transform-gpu"
              whileTap={{ scale: 0.9, opacity: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                onChangeMood('right');
              }}
            >
              <ChevronRight className="text-black w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Current position indicator dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {moods.map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full cursor-pointer"
            animate={{
              scale: i === selectedMoodIndex ? 1.2 : 1,
              backgroundColor: i === selectedMoodIndex ? 'rgb(0, 0, 0)' : 'rgba(0, 0, 0, 0.4)'
            }}
            whileHover={{ scale: 1.3 }}
            onClick={() => onMoodSelect(i)}
            onMouseEnter={() => onMoodHover(i)}
            onMouseLeave={() => onMoodHover(null)}
          />
        ))}
      </div>
      
      <style>
        {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </div>
  );
};

export default MoodSelector;
