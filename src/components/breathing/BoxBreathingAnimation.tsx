import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
type BreathingState = {
  phase: BreathingPhase;
  progress: number;
  message: string;
};

interface BoxBreathingAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  phaseDuration?: number; // Duration of each phase in seconds
}

const BoxBreathingAnimation: React.FC<BoxBreathingAnimationProps> = ({
  isActive,
  onComplete,
  phaseDuration = 4 // Default to 4 seconds per phase
}) => {
  const [breathingState, setBreathingState] = useState<BreathingState>({
    phase: 'inhale',
    progress: 0,
    message: 'Breathe In...'
  });
  
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [cycleCount, setCycleCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const totalCycles = 3; // Number of complete cycles before completion
  
  const getPhaseMessage = (phase: BreathingPhase): string => {
    switch (phase) {
      case 'inhale': return 'Breathe In...';
      case 'hold1': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'hold2': return 'Hold...';
      default: return '';
    }
  };
  
  const getNextPhase = (currentPhase: BreathingPhase): BreathingPhase => {
    switch (currentPhase) {
      case 'inhale': return 'hold1';
      case 'hold1': return 'exhale';
      case 'exhale': return 'hold2';
      case 'hold2': 
        // Increment cycle when a full cycle completes
        setCycleCount(prev => prev + 1);
        return 'inhale';
      default: return 'inhale';
    }
  };
  
  // Animation constants
  const boxSize = 180; // Base size of the breathing box
  const expansionFactor = 1.5; // How much the box expands during inhalation
  const animationConfig = {
    inhale: {
      scale: expansionFactor,
      borderRadius: 30,
      transition: { duration: phaseDuration, ease: "easeInOut" }
    },
    hold1: {
      scale: expansionFactor,
      borderRadius: 30,
      transition: { duration: phaseDuration, ease: "linear" }
    },
    exhale: {
      scale: 1,
      borderRadius: 16,
      transition: { duration: phaseDuration, ease: "easeInOut" }
    },
    hold2: {
      scale: 1,
      borderRadius: 16,
      transition: { duration: phaseDuration, ease: "linear" }
    }
  };
  
  // Background glow animation
  const glowVariants = {
    inhale: {
      boxShadow: `0 0 30px 10px rgba(61, 253, 255, 0.3), 
                  0 0 60px 20px rgba(61, 253, 255, 0.2)`,
      transition: { duration: phaseDuration, ease: "easeInOut" }
    },
    hold1: {
      boxShadow: `0 0 30px 10px rgba(245, 223, 77, 0.3), 
                 0 0 60px 20px rgba(245, 223, 77, 0.2)`,
      transition: { duration: phaseDuration, ease: "easeInOut" }
    },
    exhale: {
      boxShadow: `0 0 30px 10px rgba(252, 104, 179, 0.3), 
                 0 0 60px 20px rgba(252, 104, 179, 0.2)`,
      transition: { duration: phaseDuration, ease: "easeInOut" }
    },
    hold2: {
      boxShadow: `0 0 30px 10px rgba(42, 194, 14, 0.3), 
                 0 0 60px 20px rgba(42, 194, 14, 0.2)`,
      transition: { duration: phaseDuration, ease: "easeInOut" }
    }
  };
  
  // Moving wave background animation
  const waveVariants = {
    animate: {
      d: [
        "M0,64 C21.3,69.3 42.7,74.7 64,74.7 C85.3,74.7 106.7,69.3 128,64 C149.3,58.7 170.7,53.3 192,53.3 C213.3,53.3 234.7,58.7 256,64 C277.3,69.3 298.7,74.7 320,74.7 C341.3,74.7 362.7,69.3 384,64 L384,128 L0,128 Z",
        "M0,96 C21.3,85.3 42.7,74.7 64,74.7 C85.3,74.7 106.7,85.3 128,96 C149.3,106.7 170.7,117.3 192,117.3 C213.3,117.3 234.7,106.7 256,96 C277.3,85.3 298.7,74.7 320,74.7 C341.3,74.7 362.7,85.3 384,96 L384,128 L0,128 Z",
        "M0,64 C21.3,69.3 42.7,74.7 64,74.7 C85.3,74.7 106.7,69.3 128,64 C149.3,58.7 170.7,53.3 192,53.3 C213.3,53.3 234.7,58.7 256,64 C277.3,69.3 298.7,74.7 320,74.7 C341.3,74.7 362.7,69.3 384,64 L384,128 L0,128 Z"
      ],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        duration: 8
      }
    }
  };

  // Start and manage the breathing cycle
  useEffect(() => {
    if (isActive && !isPaused) {
      // Clear any existing timer
      if (timer) clearInterval(timer);
      
      // Define the interval for progress updates
      const interval = setInterval(() => {
        setBreathingState(state => {
          // Update progress
          const newProgress = state.progress + (100 / (phaseDuration * 10)); // 10 updates per second
          
          // If we've completed this phase
          if (newProgress >= 100) {
            // Get the next phase
            const nextPhase = getNextPhase(state.phase);
            return {
              phase: nextPhase,
              progress: 0,
              message: getPhaseMessage(nextPhase)
            };
          }
          
          // Otherwise just update progress
          return {
            ...state,
            progress: newProgress
          };
        });
      }, 100); // Update 10 times per second
      
      setTimer(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, isPaused, phaseDuration]);
  
  // Track completion of cycles
  useEffect(() => {
    if (cycleCount >= totalCycles && onComplete) {
      onComplete();
      // Reset cycle count if you want it to restart
      setCycleCount(0);
    }
  }, [cycleCount, onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-64 md:h-96">
      {/* Background waves */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <motion.svg 
          viewBox="0 0 384 128" 
          className="absolute bottom-0 w-full opacity-20"
        >
          <motion.path
            fill="url(#wave-gradient)"
            variants={waveVariants}
            animate="animate"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3DFDFF" />
              <stop offset="50%" stopColor="#F5DF4D" />
              <stop offset="100%" stopColor="#FC68B3" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
      
      {/* Orbiting particles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-70"
            style={{ 
              width: 4 + Math.random() * 4, 
              height: 4 + Math.random() * 4 
            }}
            animate={{
              x: [Math.cos(i * Math.PI/4) * 120, Math.cos((i * Math.PI/4) + Math.PI) * 120],
              y: [Math.sin(i * Math.PI/4) * 120, Math.sin((i * Math.PI/4) + Math.PI) * 120],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 6 + i,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Central breathing box */}
      <motion.div
        className="relative bg-gradient-to-r from-[#3DFDFF]/40 to-[#FC68B3]/40 backdrop-blur-lg rounded-2xl"
        style={{ width: boxSize, height: boxSize }}
        variants={animationConfig}
        animate={breathingState.phase}
        custom={phaseDuration}
      >
        <motion.div 
          className="absolute inset-0 rounded-2xl"
          variants={glowVariants}
          animate={breathingState.phase}
        />
      </motion.div>

      {/* Breath instructions */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 text-center py-4"
        animate={{ 
          opacity: [0.7, 1, 0.7],
          y: [0, -5, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <p className="text-xl font-medium text-white bg-black/30 backdrop-blur-sm rounded-full px-6 py-2 mx-auto inline-block">
          {breathingState.message}
        </p>
      </motion.div>

      {/* Progress circle around the box */}
      <svg 
        className="absolute" 
        width={boxSize * expansionFactor + 40} 
        height={boxSize * expansionFactor + 40}
      >
        <circle 
          cx={boxSize * expansionFactor / 2 + 20} 
          cy={boxSize * expansionFactor / 2 + 20} 
          r={boxSize * expansionFactor / 2 + 10}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        <motion.circle 
          cx={boxSize * expansionFactor / 2 + 20} 
          cy={boxSize * expansionFactor / 2 + 20} 
          r={boxSize * expansionFactor / 2 + 10}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * (boxSize * expansionFactor / 2 + 10)}`}
          strokeDashoffset={2 * Math.PI * (boxSize * expansionFactor / 2 + 10) * (1 - breathingState.progress / 100)}
        />
      </svg>
    </div>
  );
};

export default BoxBreathingAnimation;
