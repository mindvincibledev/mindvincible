
import React, { useRef, useEffect, useState, useMemo } from 'react';
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
  const [wheelItems, setWheelItems] = useState<string[]>([]);
  
  // Create an extended array of moods for infinite scroll effect
  useEffect(() => {
    // Create a triple-repeated array to give the impression of infinite scrolling
    setWheelItems([...moods, ...moods, ...moods]);
  }, [moods]);
  
  // Calculate the visually centered index in our extended array
  const extendedSelectedIndex = useMemo(() => {
    return selectedMoodIndex + moods.length;
  }, [selectedMoodIndex, moods.length]);
  
  // Ensure the selected mood is visible and properly positioned
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedElement = container.children[extendedSelectedIndex] as HTMLElement;
      
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
  }, [extendedSelectedIndex]);

  return (
    <div 
      ref={wheelRef} 
      className="w-full h-64 relative mt-auto select-none"
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove as any} 
      onTouchEnd={handleTouchEnd} 
      onMouseDown={handleTouchStart} 
      onMouseMove={handleTouchMove as any} 
      onMouseUp={handleTouchEnd} 
      onMouseLeave={handleTouchEnd}
    >
      {/* Wheel background with gradient */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-t-3xl">
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
      <div className="absolute bottom-16 left-0 w-full px-6 md:px-12">
        <div className="relative">
          {/* Left navigation button */}
          <motion.button
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            initial={{ x: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onChangeMood('left');
            }}
          >
            <ChevronLeft className="text-white w-6 h-6" />
          </motion.button>
          
          {/* The scroll wheel with arch effect */}
          <div className="relative overflow-hidden mx-12 h-24">
            {/* Center selection indicator line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 -translate-x-1/2 z-10 h-full" />
            
            {/* Highlight zone */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 z-0"
              style={{
                boxShadow: `0 0 20px ${getMoodColor(moods[selectedMoodIndex])}40`
              }}
            />

            {/* Arched mood options container */}
            <div 
              ref={scrollContainerRef}
              className="flex items-center h-full overflow-x-auto hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {/* Extra space at start for better UI balance */}
              <div className="w-[calc(50vw-80px)] shrink-0" />
              
              {wheelItems.map((mood, index) => {
                const isSelected = index === extendedSelectedIndex;
                
                // Calculate the Y position for the arch effect - items further from center move up
                const distanceFromCenter = Math.abs(index - extendedSelectedIndex);
                const maxDistance = 4; // How far to calculate arch effect
                const maxYOffset = 20; // Maximum pixels to move up for arch
                
                // Calculate y-offset for arch effect
                const yOffset = Math.min(distanceFromCenter, maxDistance) * (maxYOffset / maxDistance);
                
                // Calculate opacity based on distance from center
                const opacity = 1 - Math.min(distanceFromCenter * 0.15, 0.7);
                
                // Calculate scale based on distance from center
                const scale = 1 - Math.min(distanceFromCenter * 0.05, 0.3);
                
                return (
                  <motion.div 
                    key={`${mood}-${index}`}
                    className="flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 px-4"
                    initial={false}
                    animate={{ 
                      y: -yOffset,
                      opacity,
                      scale,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => {
                      // Find the actual mood index in the original array
                      const actualIndex = index % moods.length;
                      onMoodSelect(actualIndex);
                    }}
                  >
                    <motion.div
                      className="text-xl font-bold whitespace-nowrap px-5 py-3 backdrop-blur-sm rounded-lg"
                      style={{
                        color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.8)',
                        textShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                        background: isSelected ? `${getMoodColor(mood)}20` : 'transparent',
                        border: isSelected ? `1px solid ${getMoodColor(mood)}40` : '1px solid transparent'
                      }}
                    >
                      {mood}
                    </motion.div>
                  </motion.div>
                );
              })}
              
              {/* Extra space at end for better UI balance */}
              <div className="w-[calc(50vw-80px)] shrink-0" />
            </div>
          </div>
          
          {/* Right navigation button */}
          <motion.button
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            initial={{ x: 0 }}
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
      
      {/* Hide scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default MoodSelector;
