
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getMoodColor } from '@/utils/moodUtils';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Calculate selected mood based on index
  const selectedMood = moods[selectedMoodIndex];
  const selectedColor = getMoodColor(selectedMood);
  
  // Handle scroll wheel navigation
  const handleScroll = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    let newIndex = selectedMoodIndex;
    if (direction === 'left') {
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
      
      if (e.deltaX < 0 || e.deltaY < 0) {
        handleScroll('left');
      } else if (e.deltaX > 0 || e.deltaY > 0) {
        handleScroll('right');
      }
    };
    
    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener('wheel', handleWheelScroll, { passive: false });
    }
    
    // Handle touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        // Swiped left
        handleScroll('right');
      } else if (touchEndX - touchStartX > 50) {
        // Swiped right
        handleScroll('left');
      }
    };
    
    if (containerElement) {
      containerElement.addEventListener('touchstart', handleTouchStart);
      containerElement.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      if (containerElement) {
        containerElement.removeEventListener('wheel', handleWheelScroll);
        containerElement.removeEventListener('touchstart', handleTouchStart);
        containerElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [selectedMoodIndex, isAnimating]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${selectedColor} 0%, ${selectedColor}99 100%)`
      }}
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center"
        >
          <h2 className="text-4xl text-white font-medium mb-20">I'm feeling</h2>
          
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-8xl font-bold text-white mb-24"
          >
            {selectedMood}
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoodSelect(selectedMood)}
            className="px-10 py-4 rounded-full bg-white/30 backdrop-blur-sm text-white text-xl font-medium shadow-lg mt-12 hover:bg-white/40 transition-colors"
          >
            Tap to pick your mood
          </motion.button>
        </motion.div>
      </div>
      
      <div 
        ref={wheelRef}
        className="relative w-full h-64 overflow-hidden rounded-t-[40%]"
      >
        <div className="absolute bottom-0 left-0 w-full h-full bg-white/20 backdrop-blur-sm rounded-t-[40%]">
          <div className="relative w-full h-full">
            {moods.map((mood, index) => {
              // Calculate angle for positioning
              const angleDelta = 25; // degrees between items
              const baseAngle = -90; // middle position (bottom center)
              const angle = baseAngle + (index - selectedMoodIndex) * angleDelta;
              
              // Convert angle to position on the arc
              const radius = 200; // virtual radius of the arc
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;
              
              // Calculate opacity based on distance from center
              const distanceFromCenter = Math.abs(index - selectedMoodIndex);
              const opacity = 1 - (distanceFromCenter * 0.2);
              
              // Only render visible items
              if (distanceFromCenter > 4) return null;
              
              return (
                <motion.div
                  key={mood}
                  className="absolute text-white font-medium"
                  initial={false}
                  animate={{
                    left: `calc(50% + ${x}px)`,
                    bottom: `calc(${y}px)`,
                    opacity: opacity > 0 ? opacity : 0,
                    scale: 1 - (distanceFromCenter * 0.15),
                  }}
                  style={{
                    transformOrigin: 'center',
                    textShadow: index === selectedMoodIndex ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                    fontSize: index === selectedMoodIndex ? '1.5rem' : '1rem',
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  {mood}
                  {index === selectedMoodIndex - 1 && (
                    <motion.div 
                      className="absolute -left-8 top-1/2 -translate-y-1/2 text-white"
                      animate={{ x: [-3, 0, -3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      ⟨⟨
                    </motion.div>
                  )}
                  {index === selectedMoodIndex + 1 && (
                    <motion.div 
                      className="absolute -right-8 top-1/2 -translate-y-1/2 text-white"
                      animate={{ x: [3, 0, 3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      ⟩⟩
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Indicator line */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default MoodMeter;
