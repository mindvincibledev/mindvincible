
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Create an infinite mood array by repeating the moods
  const extendedMoods = [...moods, ...moods, ...moods]; // Triple the array for infinite scrolling effect
  const offsetIndex = moods.length + selectedMoodIndex; // Current position in the extended array

  // Ensure the selected mood is visible and centered
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedElement = container.children[offsetIndex] as HTMLElement;
      
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
      {/* Wheel background with gradient */}
      <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-t-2xl">
        {/* Decorative circle elements */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-20 blur-md"
          style={{ background: `radial-gradient(circle, ${getMoodColor(moods[selectedMoodIndex])} 0%, transparent 70%)` }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
      </div>
      
      {/* Scroll wheel UI */}
      <div className="absolute bottom-24 left-0 w-full px-12">
        <div className="relative">
          {/* Left navigation button - Fixed position */}
          <motion.button
            className="absolute -left-2 top-1/2 -translate-y-1/2 transform-gpu z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            style={{ 
              transform: "translateY(-50%)", 
              WebkitTransform: "translateY(-50%)",
              position: "absolute",
              top: "50%",
              left: "-0.5rem"
            }}
            whileTap={{ scale: 0.9, opacity: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onChangeMood('left');
            }}
          >
            <ChevronLeft className="text-white w-6 h-6" />
          </motion.button>
          
          {/* The scroll wheel */}
          <div className="relative overflow-hidden mx-10 py-4">
            {/* Center line indicator - removed */}
            
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
                    className="flex flex-col items-center justify-center cursor-pointer transition-all shrink-0"
                    animate={{ 
                      opacity: isSelected ? 1 : 0.6,
                      scale: isSelected ? 1.2 : 1,
                      transition: { duration: 0.3 }
                    }}
                    onClick={() => {
                      const adjustedIndex = (actualIndex >= 0) ? actualIndex : moods.length + actualIndex;
                      onMoodSelect(adjustedIndex);
                    }}
                  >
                    <motion.span 
                      className="text-xl font-bold whitespace-nowrap px-4 py-2"
                      style={{
                        color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.7)',
                        textShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
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
                  </motion.div>
                );
              })}
              
              {/* Insert extra space at end for better UI balance */}
              <div className="w-[calc(50vw-60px)] shrink-0" />
            </div>
          </div>
          
          {/* Right navigation button - Fixed position */}
          <motion.button
            className="absolute -right-2 top-1/2 -translate-y-1/2 transform-gpu z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            style={{ 
              transform: "translateY(-50%)", 
              WebkitTransform: "translateY(-50%)",
              position: "absolute",
              top: "50%", 
              right: "-0.5rem"
            }}
            whileTap={{ scale: 0.9, opacity: 0.8 }}
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MoodSelector;
