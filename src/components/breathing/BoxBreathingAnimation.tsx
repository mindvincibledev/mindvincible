import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BreathingPhase = 'prepare' | 'inhale' | 'hold1' | 'exhale' | 'hold2';
type BreathingState = {
  phase: BreathingPhase;
  progress: number;
  message: string;
};

interface BoxBreathingAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  phaseDuration?: number; // Duration of each phase in seconds
  theme?: 'glow' | 'clouds' | 'galaxy' | 'neon' | 'bubbles';
  soundType?: 'none' | 'rain' | 'waves' | 'lofi';
}

const BoxBreathingAnimation: React.FC<BoxBreathingAnimationProps> = ({
  isActive,
  onComplete,
  phaseDuration = 4, // Default to 4 seconds per phase
  theme = 'glow',
  soundType = 'none'
}) => {
  const [breathingState, setBreathingState] = useState<BreathingState>({
    phase: 'prepare',
    progress: 0,
    message: 'Get ready...'
  });
  
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [cycleCount, setCycleCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const totalCycles = 3; // Number of complete cycles before completion
  const prepDuration = 3; // 3 seconds preparation time
  
  const getPhaseMessage = (phase: BreathingPhase): string => {
    const timeRemaining = Math.ceil((100 - breathingState.progress) / (100 / (phase === 'prepare' ? prepDuration : phaseDuration)));
    
    switch (phase) {
      case 'prepare': return `Get ready... ${timeRemaining}`;
      case 'inhale': return `Breathe in... ${timeRemaining}`;
      case 'hold1': return `Hold it... ${timeRemaining}`;
      case 'exhale': return `Breathe out... ${timeRemaining}`;
      case 'hold2': return `Hold again... ${timeRemaining}`;
      default: return '';
    }
  };
  
  const getNextPhase = (currentPhase: BreathingPhase): BreathingPhase => {
    switch (currentPhase) {
      case 'prepare': return 'inhale';
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
  const boxSize = 200; // Base size of the breathing box
  const expansionFactor = 1.25; // How much the box expands during inhalation
  
  // Get theme-based colors
  const getThemeColors = () => {
    switch (theme) {
      case 'clouds':
        return {
          box: 'bg-gradient-to-r from-sky-300/80 to-indigo-200/80 backdrop-blur-md',
          glow: 'rgba(148, 190, 233, 0.6)',
          trace: '#ffffff'
        };
      case 'galaxy':
        return {
          box: 'bg-gradient-to-r from-purple-500/80 to-indigo-600/80 backdrop-blur-md',
          glow: 'rgba(139, 92, 246, 0.6)',
          trace: '#f0e7ff'
        };
      case 'neon':
        return {
          box: 'bg-gradient-to-r from-green-400/80 to-cyan-400/80 backdrop-blur-md',
          glow: 'rgba(52, 211, 153, 0.6)',
          trace: '#dbfff6'
        };
      case 'bubbles':
        return {
          box: 'bg-gradient-to-r from-blue-400/80 to-teal-300/80 backdrop-blur-md',
          glow: 'rgba(45, 212, 191, 0.6)',
          trace: '#d5ffff'
        };
      default: // glow
        return {
          box: 'bg-gradient-to-r from-[#3DFDFF]/80 to-[#FC68B3]/80 backdrop-blur-md',
          glow: 'rgba(61, 253, 255, 0.6)',
          trace: '#ffffff'
        };
    }
  };

  const themeColors = getThemeColors();
  
  // Start and manage the breathing cycle
  useEffect(() => {
    if (isActive && !isPaused) {
      // Clear any existing timer
      if (timer) clearInterval(timer);
      
      // Define the interval for progress updates
      const interval = setInterval(() => {
        setBreathingState(state => {
          // Update progress
          const phaseDurationToUse = state.phase === 'prepare' ? prepDuration : phaseDuration;
          const newProgress = state.progress + (100 / (phaseDurationToUse * 10)); // 10 updates per second
          
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
            progress: newProgress,
            message: getPhaseMessage(state.phase)
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

  // Play sound effect based on selected sound type
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    
    if (soundType !== 'none' && isActive) {
      audio = new Audio(`/sounds/${soundType}.mp3`);
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio playback failed:", e));
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [soundType, isActive]);

  // Calculate the current active side of the box and point position
  const getTracePosition = () => {
    const { phase, progress } = breathingState;
    
    if (phase === 'prepare') {
      // During preparation, don't show the trace point
      return null;
    }
    
    const halfSize = boxSize / 2;
    const adjustedSize = phase === 'inhale' || phase === 'hold1' ? boxSize * expansionFactor : boxSize;
    const halfAdjustedSize = adjustedSize / 2;
    
    // Calculate position based on phase and progress
    switch (phase) {
      case 'inhale': // Top side: left to right
        return {
          x: -halfAdjustedSize + (progress / 100) * adjustedSize,
          y: -halfAdjustedSize
        };
      case 'hold1': // Right side: top to bottom
        return {
          x: halfAdjustedSize,
          y: -halfAdjustedSize + (progress / 100) * adjustedSize
        };
      case 'exhale': // Bottom side: right to left
        return {
          x: halfAdjustedSize - (progress / 100) * adjustedSize,
          y: halfAdjustedSize
        };
      case 'hold2': // Left side: bottom to top
        return {
          x: -halfAdjustedSize,
          y: halfAdjustedSize - (progress / 100) * adjustedSize
        };
      default:
        return { x: 0, y: 0 };
    }
  };
  
  const tracePosition = getTracePosition();
  
  // Calculate box animation based on phase
  const getBoxAnimation = () => {
    const { phase } = breathingState;
    
    // Don't animate during preparation
    if (phase === 'prepare') {
      return {
        scale: 1,
        boxShadow: `0 0 20px 5px ${themeColors.glow}`
      };
    }
    
    switch (phase) {
      case 'inhale':
      case 'hold1':
        return {
          scale: expansionFactor,
          boxShadow: `0 0 30px 10px ${themeColors.glow}`
        };
      case 'exhale':
      case 'hold2':
        return {
          scale: 1,
          boxShadow: `0 0 20px 5px ${themeColors.glow}`
        };
      default:
        return { scale: 1 };
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-64 md:h-96">
      {/* Floating box container */}
      <div className="relative">
        {/* Main breathing box */}
        <motion.div
          className={`relative ${themeColors.box} rounded-xl flex items-center justify-center overflow-hidden`}
          style={{ 
            width: boxSize, 
            height: boxSize,
            originX: 0.5,
            originY: 0.5
          }}
          animate={getBoxAnimation()}
          transition={{ 
            duration: breathingState.phase === 'prepare' ? 0 : phaseDuration,
            ease: "easeInOut" 
          }}
        >
          {/* Message inside the box */}
          {isActive && (
            <motion.p 
              className="text-white text-lg font-medium text-center px-4 drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {breathingState.message}
            </motion.p>
          )}
        </motion.div>
        
        {/* Tracing point that moves around the box */}
        {isActive && tracePosition && (
          <motion.div
            className="absolute"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: themeColors.trace,
              boxShadow: `0 0 8px 2px ${themeColors.trace}`,
              zIndex: 10,
              left: '50%',
              top: '50%',
              marginLeft: tracePosition.x,
              marginTop: tracePosition.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={false}
          />
        )}
      </div>
      
      {/* Wavy background effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute bottom-0 w-full h-32 opacity-20"
          style={{
            background: `linear-gradient(to top, ${themeColors.glow}, transparent)`
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default BoxBreathingAnimation;
