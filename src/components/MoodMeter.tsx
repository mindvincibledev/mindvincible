
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      x: 50 + x * 42, // 50% is center, 42% is the radius in percentage
      y: 85 + y * 35, // 85% from top for the center of the arc
      angle: angle - 90, // Rotate text to be tangent to the arc
    };
  };

  return (
    <div className="w-full h-full text-center flex flex-col items-center justify-between relative overflow-hidden" 
         style={{ 
           background: `linear-gradient(135deg, ${moodColor} 0%, ${moodColor}99 50%, ${moodColor}66 100%)`,
           transition: 'background 0.7s ease'
         }}>
      <div className="flex-1 flex flex-col justify-center items-center w-full px-6 pt-20 pb-12">
        <h2 className="text-2xl font-bold text-white/90 mb-8 tracking-wide">I'm feeling</h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative text-7xl md:text-8xl lg:text-9xl font-extrabold text-white my-10 md:my-12 tracking-tight"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
          >
            {selectedMood}
          </motion.div>
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMoodSelect(selectedMood)}
          className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-medium shadow-lg mt-8 w-64 border border-white/30 transition-all hover:bg-white/30"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 2px 8px rgba(255,255,255,0.15) inset' }}
        >
          Tap to pick your mood
        </motion.button>
      </div>
      
      {/* Semi-circle mood selector at bottom with light blur effect */}
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
        {/* Semi-circle background with light blur */}
        <div className="absolute bottom-0 left-0 right-0 h-72 w-full bg-white/20 backdrop-blur-sm rounded-t-full"></div>
        
        {/* Center indicator line */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/70 rounded-full shadow-lg"></div>
        
        {/* Moods arranged in a semi-circle */}
        {moods.map((mood, index) => {
          const position = getMoodPosition(index);
          const isSelected = index === selectedMoodIndex;
          
          return (
            <div
              key={mood}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                opacity: isSelected ? 1 : 0.6,
                transition: 'all 0.3s ease',
                transform: `translate(-50%, -50%) rotate(${position.angle}deg)`,
                zIndex: isSelected ? 10 : 5,
              }}
              onClick={() => setSelectedMoodIndex(index)}
            >
              <div 
                style={{ 
                  transform: `rotate(${-position.angle}deg)`,
                  transition: 'all 0.3s ease',
                }} 
                className={`relative py-1 px-2 ${isSelected ? 'bg-white/20 backdrop-blur-sm rounded-full shadow-lg' : ''}`}
              >
                <span 
                  className={`text-lg md:text-xl font-bold transition-all ${isSelected ? 'text-white scale-110' : 'text-white/80'}`}
                  style={{ 
                    textShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  {mood}
                </span>
                {isSelected && index > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -left-8 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronLeft 
                      className="text-white cursor-pointer hover:scale-110 transition-transform" 
                      size={24}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeMood('left');
                      }} 
                    />
                  </motion.div>
                )}
                {isSelected && index < moods.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -right-8 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronRight 
                      className="text-white cursor-pointer hover:scale-110 transition-transform" 
                      size={24}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeMood('right');
                      }} 
                    />
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Decorative dots */}
        <div className="absolute bottom-6 left-1/4 w-2 h-2 rounded-full bg-white/40"></div>
        <div className="absolute bottom-8 left-1/3 w-1 h-1 rounded-full bg-white/30"></div>
        <div className="absolute bottom-10 right-1/4 w-2 h-2 rounded-full bg-white/40"></div>
        <div className="absolute bottom-5 right-1/3 w-1 h-1 rounded-full bg-white/30"></div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm"></div>
      <div className="absolute top-40 right-10 w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm"></div>
    </div>
  );
};

export default MoodMeter;
