
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMoodColor } from '@/utils/moodUtils';

const moods = [
  'Angry',
  'Sad',
  'Anxious', 
  'Calm',
  'Happy',
  'Excited', 
  'Overwhelmed'
];

interface MoodMeterProps {
  onMoodSelect: (mood: string) => void;
}

const MoodMeter: React.FC<MoodMeterProps> = ({ onMoodSelect }) => {
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(5); // Default to Excited
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  // Calculate selected mood based on index
  const selectedMood = moods[selectedMoodIndex];
  const moodColor = getMoodColor(selectedMood);
  
  // Handle changing the mood
  const changeMood = (direction: 'left' | 'right') => {
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
    }, 300);
  };
  
  // Handle wheel scroll event
  useEffect(() => {
    const handleWheelScroll = (e: WheelEvent) => {
      if (isAnimating) return;
      
      if (e.deltaX > 0 || e.deltaY > 0) {
        changeMood('right');
      } else {
        changeMood('left');
      }
    };
    
    const wheelElement = wheelRef.current;
    if (wheelElement) {
      wheelElement.addEventListener('wheel', handleWheelScroll, { passive: true });
    }
    
    return () => {
      if (wheelElement) {
        wheelElement.removeEventListener('wheel', handleWheelScroll);
      }
    };
  }, [selectedMoodIndex, isAnimating]);

  // Handle touch/mouse events for swiping
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    let currentX;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 30) { // Threshold for swipe
      if (diff > 0) {
        changeMood('left');
      } else {
        changeMood('right');
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Get mood position in the arc
  const getMoodPosition = (index: number) => {
    // Calculate the angle based on index within the semi-circle
    const totalAngle = 180; // semi-circle angle range
    const anglePerItem = totalAngle / (moods.length - 1);
    const angle = index * anglePerItem;
    
    // Convert angle to radians for calculating x, y positions
    const angleRad = (angle * Math.PI) / 180;
    
    // Calculate position on semi-circle (r=1 for unit circle)
    const x = Math.sin(angleRad);
    const y = -Math.cos(angleRad); // Negative because we want the arc to be at the bottom
    
    // Scale and adjust positions to fit in our container
    return {
      x: 50 + x * 40, // 50% is center, 40% is the radius in percentage
      y: 85 + y * 30, // 85% from top for the center of the arc
      angle: angle - 90, // Rotate text to be tangent to the arc
    };
  };

  return (
    <div className="w-full h-full text-center flex flex-col items-center justify-between" style={{ 
      background: `linear-gradient(to bottom, ${moodColor}, ${moodColor}99)`,
      transition: 'background 0.5s ease'
    }}>
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h2 className="text-2xl text-white font-medium mb-6">I'm feeling</h2>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative text-8xl md:text-9xl font-bold text-white/80 my-12"
        >
          {selectedMood}
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMoodSelect(selectedMood)}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500/80 to-orange-400/80 text-white text-lg font-medium shadow-lg mt-8 w-64"
        >
          Tap to pick your mood
        </motion.button>
      </div>
      
      {/* Semi-circle mood selector at bottom */}
      <div 
        ref={wheelRef}
        className="w-full h-48 relative mt-auto overflow-hidden pb-8"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove as any}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove as any}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Semi-circle background */}
        <div className="absolute bottom-0 left-0 right-0 h-72 w-full bg-white/20 rounded-t-full"></div>
        
        {/* Center indicator line */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-black rounded-full"></div>
        
        {/* Moods arranged in a semi-circle */}
        {moods.map((mood, index) => {
          const position = getMoodPosition(index);
          const isSelected = index === selectedMoodIndex;
          
          return (
            <div
              key={mood}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                opacity: isSelected ? 1 : 0.6,
                transition: 'all 0.3s ease',
                transform: `translate(-50%, -50%) rotate(${position.angle}deg)`,
              }}
              onClick={() => setSelectedMoodIndex(index)}
            >
              <div style={{ transform: `rotate(${-position.angle}deg)` }}>
                <span className={`text-lg md:text-xl font-bold ${isSelected ? 'text-white scale-110' : 'text-white/80'}`}>
                  {mood}
                </span>
                {isSelected && index > 0 && (
                  <ChevronLeft className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-white cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      changeMood('left');
                    }} 
                  />
                )}
                {isSelected && index < moods.length - 1 && (
                  <ChevronRight className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-white cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      changeMood('right');
                    }} 
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodMeter;
