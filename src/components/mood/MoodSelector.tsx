
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MoodPosition {
  x: number;
  y: number;
  angle: number;
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
  // Get mood position in the arc
  const getMoodPosition = (index: number): MoodPosition => {
    // Calculate the angle based on index within the semi-circle
    const totalAngle = 180; // semi-circle angle range
    const anglePerItem = totalAngle / (moods.length - 1);
    const angle = index * anglePerItem;

    // Convert angle to radians for calculating x, y positions
    const angleRad = angle * Math.PI / 180;

    // Calculate position on semi-circle (r=1 for unit circle)
    const x = Math.sin(angleRad);
    const y = -Math.cos(angleRad); // Negative because we want the arc to be at the bottom

    // Scale and adjust positions to fit in our container
    return {
      x: 50 + x * 42, // 50% is center, 42% is the radius in percentage
      y: 85 + y * 35, // 85% from top for the center of the arc
      angle: angle - 90 // Rotate text to be tangent to the arc
    };
  };

  return (
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
              zIndex: isSelected ? 10 : 5
            }} 
            onClick={() => onMoodSelect(index)}
          >
            <div 
              style={{
                transform: `rotate(${-position.angle}deg)`,
                transition: 'all 0.3s ease'
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
                  initial={{
                    opacity: 0,
                    x: 5
                  }} 
                  animate={{
                    opacity: 1,
                    x: 0
                  }} 
                  className="absolute -left-8 top-1/2 transform -translate-y-1/2"
                >
                  <ChevronLeft 
                    className="text-white cursor-pointer hover:scale-110 transition-transform" 
                    size={24} 
                    onClick={e => {
                      e.stopPropagation();
                      onChangeMood('left');
                    }} 
                  />
                </motion.div>
              )}
              {isSelected && index < moods.length - 1 && (
                <motion.div 
                  initial={{
                    opacity: 0,
                    x: -5
                  }} 
                  animate={{
                    opacity: 1,
                    x: 0
                  }} 
                  className="absolute -right-8 top-1/2 transform -translate-y-1/2"
                >
                  <ChevronRight 
                    className="text-white cursor-pointer hover:scale-110 transition-transform" 
                    size={24} 
                    onClick={e => {
                      e.stopPropagation();
                      onChangeMood('right');
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
  );
};

export default MoodSelector;
