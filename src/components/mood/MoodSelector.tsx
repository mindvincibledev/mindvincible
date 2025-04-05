
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MoodPosition {
  x: number;
  y: number;
  angle: number;
  size: number;
}

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
  // Get mood position in the wheel
  const getMoodPosition = (index: number, totalMoods: number): MoodPosition => {
    // Calculate the angle based on index within the semi-circle
    const startAngle = -120; // Begin from bottom left
    const endAngle = -60; // End at bottom right
    const angleRange = endAngle - startAngle;
    const angleStep = angleRange / (totalMoods - 1);
    const angle = startAngle + (index * angleStep);

    // Convert angle to radians for calculating x, y positions
    const angleRad = angle * Math.PI / 180;

    // Calculate position on arc (r=1 for unit circle)
    const x = Math.cos(angleRad);
    const y = Math.sin(angleRad);

    // Distance from selected mood (closest mood is largest)
    const distFromSelected = Math.abs(index - selectedMoodIndex);
    const sizeMultiplier = distFromSelected === 0 ? 1 : Math.max(0.5, 1 - (distFromSelected * 0.2));

    // Scale and adjust positions to fit in our container
    return {
      x: 50 + x * 40, // 50% is center, 40% is the radius in percentage
      y: 95 + y * 40, // 95% from top for the center of the arc
      angle: angle + 90, // Rotate text to follow arc tangent
      size: sizeMultiplier
    };
  };

  // Determine how many moods to show on each side of the selected mood
  const visibleMoodsOnEachSide = 2;

  // Calculate whether a mood should be visible based on distance from selected mood
  const isMoodVisible = (index: number) => {
    const distFromSelected = Math.abs(index - selectedMoodIndex);
    return distFromSelected <= visibleMoodsOnEachSide; // Show limited moods for clearer visibility
  };

  // Apply perspective and wheel styling
  return (
    <div 
      ref={wheelRef} 
      className="w-full h-64 relative mt-auto overflow-hidden perspective-1000" 
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove as any} 
      onTouchEnd={handleTouchEnd} 
      onMouseDown={handleTouchStart} 
      onMouseMove={handleTouchMove as any} 
      onMouseUp={handleTouchEnd} 
      onMouseLeave={handleTouchEnd}
    >
      {/* Wheel background with 3D effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-48 bg-gradient-to-t from-white/20 to-transparent rounded-t-[50%] overflow-hidden">
        {/* Wheel lines/segments */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          {Array.from({ length: moods.length + 1 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute bottom-0 left-1/2 h-full w-[1px] bg-white/10 origin-bottom"
              style={{
                transform: `translateX(-50%) rotate(${-120 + (i * (60 / (moods.length - 1)))}deg)`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Moods arranged in wheel */}
      {moods.map((mood, index) => {
        const position = getMoodPosition(index, moods.length);
        const isSelected = index === selectedMoodIndex;
        const isVisible = isMoodVisible(index);
        
        if (!isVisible) return null;
        
        return (
          <motion.div 
            key={mood} 
            className="absolute transform cursor-pointer select-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isSelected ? 1 : 0.6,
              x: `${position.x}%`,
              y: `${position.y}%`,
              scale: position.size,
              transition: { duration: 0.4, ease: "easeInOut" }
            }}
            style={{
              transformOrigin: "center",
              zIndex: isSelected ? 10 : 5
            }} 
            onClick={() => onMoodSelect(index)}
          >
            <div className="relative">
              <span 
                className={`text-xl md:text-2xl font-bold transition-all whitespace-nowrap ${isSelected ? 'text-white drop-shadow-lg' : 'text-white/70'}`}
                style={{
                  textShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                {mood}
              </span>
              
              {isSelected && (
                <div className="flex justify-between items-center absolute w-full top-1/2 -translate-y-1/2">
                  <motion.button
                    className="absolute -left-12 flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={e => {
                      e.stopPropagation();
                      onChangeMood('left');
                    }}
                  >
                    <ChevronLeft className="text-white drop-shadow-md w-8 h-8 md:w-10 md:h-10" />
                  </motion.button>
                  
                  <motion.button
                    className="absolute -right-12 flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={e => {
                      e.stopPropagation();
                      onChangeMood('right');
                    }}
                  >
                    <ChevronRight className="text-white drop-shadow-md w-8 h-8 md:w-10 md:h-10" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
      
      {/* Current position indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full shadow-lg"></div>
      
      {/* Dots for navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {moods.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i === selectedMoodIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
            onClick={() => onMoodSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
