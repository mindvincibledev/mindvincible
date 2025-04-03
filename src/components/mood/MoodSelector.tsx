
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
      className="w-full h-52 relative mt-auto overflow-visible pb-8" 
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove as any} 
      onTouchEnd={handleTouchEnd} 
      onMouseDown={handleTouchStart} 
      onMouseMove={handleTouchMove as any} 
      onMouseUp={handleTouchEnd} 
      onMouseLeave={handleTouchEnd}
    >
      {/* Semi-circle background with light blur */}
      <div className="absolute bottom-0 left-0 right-0 h-64 w-full bg-gradient-to-t from-white/20 to-transparent backdrop-blur-sm rounded-t-full"></div>
      
      {/* Animated wave decoration */}
      <motion.div 
        className="absolute bottom-6 left-0 right-0 h-12 opacity-30"
        style={{
          background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23FFFFFF' fill-opacity='0.3'%3E%3C/path%3E%3C/svg%3E\")",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Moods arranged in a semi-circle */}
      {moods.map((mood, index) => {
        const position = getMoodPosition(index);
        const isSelected = index === selectedMoodIndex;
        return (
          <motion.div 
            key={mood} 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" 
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }} 
            initial={false}
            animate={{
              opacity: isSelected ? 1 : 0.6,
              scale: isSelected ? 1.1 : 0.9,
              zIndex: isSelected ? 10 : 5,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
            onClick={() => onMoodSelect(index)}
          >
            <div 
              style={{
                transform: `translate(-50%, -50%) rotate(${position.angle}deg)`,
                transition: 'all 0.3s ease'
              }} 
              className="relative"
            >
              <div 
                className={`py-1.5 px-3 rounded-full transition-all duration-300 ${isSelected ? 'bg-white/20 backdrop-blur-sm shadow-lg border border-white/30' : ''}`}
                style={{
                  transform: `rotate(${-position.angle}deg)`,
                }}
              >
                <span 
                  className={`text-lg md:text-xl font-bold transition-all ${isSelected ? 'text-white' : 'text-white/80'}`} 
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
              
              {/* Highlight effect for selected mood */}
              {isSelected && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -z-10 rounded-full bg-white/10"
                  initial={{ width: 0, height: 0 }}
                  animate={{ 
                    width: 120,
                    height: 120,
                    x: -60,
                    y: -60,
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
      
      {/* Decorative dots with pulsing animation */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/4 w-2 h-2 rounded-full bg-white/40"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-8 left-1/3 w-1 h-1 rounded-full bg-white/30"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        className="absolute bottom-10 right-1/4 w-2 h-2 rounded-full bg-white/40"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, delay: 0.7 }}
        className="absolute bottom-5 right-1/3 w-1 h-1 rounded-full bg-white/30"
      />
    </div>
  );
};

export default MoodSelector;
