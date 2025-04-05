
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
  // Create an extended array of moods for infinite scroll effect
  const wheelItems = useMemo(() => {
    // Create a triple-repeated array to give the impression of infinite scrolling
    return [...moods, ...moods, ...moods];
  }, [moods]);
  
  // Calculate the visually centered index in our extended array
  const extendedSelectedIndex = useMemo(() => {
    return selectedMoodIndex + moods.length;
  }, [selectedMoodIndex, moods.length]);
  
  // Play a sound when changing moods
  const playScrollSound = () => {
    try {
      const audio = new Audio('/click.mp3');
      audio.volume = 0.2;
      audio.play().catch(err => console.log('Audio play error:', err));
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  };

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
      
      {/* Curved Scroll Wheel UI */}
      <div className="absolute bottom-16 left-0 w-full px-4">
        <div className="relative h-24">
          {/* Left navigation button */}
          <motion.button
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              playScrollSound();
              onChangeMood('left');
            }}
          >
            <ChevronLeft className="text-white w-6 h-6" />
          </motion.button>
          
          {/* The curved scroll wheel container */}
          <div className="relative w-full h-full overflow-hidden">
            {/* Center selection indicator line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 -translate-x-1/2 z-10 h-full" />
            
            {/* Highlight zone */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 z-0"
              style={{
                boxShadow: `0 0 20px ${getMoodColor(moods[selectedMoodIndex])}40`
              }}
            />

            {/* The actual curved wheel */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full">
              <div className="relative h-48 w-full">
                {wheelItems.map((mood, index) => {
                  // Calculate position along the arc
                  const totalItems = wheelItems.length;
                  const centerIndex = extendedSelectedIndex;
                  
                  // Calculate distance from center item (positive or negative)
                  const distanceFromCenter = index - centerIndex;
                  
                  // Define how many items to show on each side of the center
                  const visibleRange = 5;
                  
                  // Only render items within the visible range
                  if (Math.abs(distanceFromCenter) > visibleRange) {
                    return null;
                  }
                  
                  // Calculate angle based on position relative to center
                  const angle = distanceFromCenter * 15; // 15 degrees spacing
                  
                  // Calculate horizontal position along the arc
                  const radius = 150; // Radius of the arc
                  const x = Math.sin(angle * Math.PI / 180) * radius;
                  
                  // Calculate vertical position (y) with a curve effect
                  // Items further from center move up to create an arch
                  const y = Math.abs(distanceFromCenter) * 8; // Increase for more curve
                  
                  // Calculate opacity based on distance from center
                  const opacity = 1 - Math.min(Math.abs(distanceFromCenter) * 0.15, 0.7);
                  
                  // Calculate scale based on distance from center
                  const scale = 1 - Math.min(Math.abs(distanceFromCenter) * 0.08, 0.4);
                  
                  const isSelected = index === centerIndex;
                  
                  return (
                    <motion.div 
                      key={`${mood}-${index}`}
                      className="absolute left-1/2 cursor-pointer flex flex-col items-center justify-center"
                      initial={false}
                      animate={{
                        x: x,
                        y: -y - 20, // Base offset plus dynamic curve
                        scale: isSelected ? scale * 1.2 : scale,
                        opacity
                      }}
                      onClick={() => {
                        // Find the actual mood index in the original array
                        const actualIndex = index % moods.length;
                        playScrollSound();
                        onMoodSelect(actualIndex);
                      }}
                    >
                      <motion.div
                        className="whitespace-nowrap px-5 py-3 backdrop-blur-sm rounded-lg"
                        style={{
                          color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.8)',
                          textShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                          background: isSelected ? `${getMoodColor(mood)}20` : 'transparent',
                          border: isSelected ? `1px solid ${getMoodColor(mood)}40` : '1px solid transparent',
                          fontSize: isSelected ? '1.25rem' : '1rem',
                          fontWeight: isSelected ? 'bold' : 'normal'
                        }}
                      >
                        {mood}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right navigation button */}
          <motion.button
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              playScrollSound();
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
            onClick={() => {
              playScrollSound();
              onMoodSelect(i);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
