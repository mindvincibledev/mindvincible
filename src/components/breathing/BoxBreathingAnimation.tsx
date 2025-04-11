
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";

type BreathingPhase = 'prepare' | 'inhale' | 'hold1' | 'exhale' | 'hold2';
type BreathingState = {
  phase: BreathingPhase;
  progress: number;
  message: string;
  countDown: number;
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
    message: 'Get ready...',
    countDown: 3
  });
  
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [cycleCount, setCycleCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);
  
  const totalCycles = 3; // Number of complete cycles before completion
  const prepDuration = 3; // 3 seconds preparation time
  
  const getPhaseMessage = (phase: BreathingPhase): string => {
    switch (phase) {
      case 'prepare': return 'Get ready...';
      case 'inhale': return 'Breathe in';
      case 'hold1': return 'Hold it';
      case 'exhale': return 'Breathe out';
      case 'hold2': return 'Hold again';
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
  
  // Fixed box size
  const boxSize = 200; 
  
  // Get theme-based colors
  const getThemeColors = () => {
    switch (theme) {
      case 'clouds':
        return {
          box: 'from-sky-300/90 to-indigo-200/90',
          glow: 'rgba(148, 190, 233, 0.8)',
          trace: '#ffffff'
        };
      case 'galaxy':
        return {
          box: 'from-purple-500/90 to-indigo-600/90',
          glow: 'rgba(139, 92, 246, 0.8)',
          trace: '#f0e7ff'
        };
      case 'neon':
        return {
          box: 'from-green-400/90 to-cyan-400/90',
          glow: 'rgba(52, 211, 153, 0.8)',
          trace: '#dbfff6'
        };
      case 'bubbles':
        return {
          box: 'from-blue-400/90 to-teal-300/90',
          glow: 'rgba(45, 212, 191, 0.8)',
          trace: '#d5ffff'
        };
      default: // glow
        return {
          box: 'from-[#3DFDFF]/90 to-[#FC68B3]/90',
          glow: 'rgba(61, 253, 255, 0.8)',
          trace: '#ffffff'
        };
    }
  };

  const themeColors = getThemeColors();
  
  // Calculate total exercise duration for progress bar
  const calculateTotalDuration = () => {
    return prepDuration + (phaseDuration * 4 * totalCycles);
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
          const phaseDurationToUse = state.phase === 'prepare' ? prepDuration : phaseDuration;
          const newProgress = state.progress + (100 / (phaseDurationToUse * 10)); // 10 updates per second
          
          // Calculate countdown number
          const newCountDown = Math.ceil((100 - newProgress) / (100 / phaseDurationToUse));
          
          // Update total progress for progress bar
          const totalDuration = calculateTotalDuration();
          const elapsedTime = state.phase === 'prepare' 
            ? (prepDuration - newCountDown) 
            : prepDuration + (cycleCount * 4 * phaseDuration) + 
              (['inhale', 'hold1', 'exhale', 'hold2'].indexOf(state.phase) * phaseDuration) +
              (phaseDuration - newCountDown);
          
          setTotalProgress((elapsedTime / totalDuration) * 100);
          
          // If we've completed this phase
          if (newProgress >= 100) {
            // Get the next phase
            const nextPhase = getNextPhase(state.phase);
            return {
              phase: nextPhase,
              progress: 0,
              message: getPhaseMessage(nextPhase),
              countDown: nextPhase === 'prepare' ? 3 : phaseDuration
            };
          }
          
          // Otherwise just update progress
          return {
            ...state,
            progress: newProgress,
            countDown: newCountDown
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
    
    // Calculate position based on phase and progress
    switch (phase) {
      case 'inhale': // Top side: left to right
        return {
          x: -halfSize + (progress / 100) * boxSize,
          y: -halfSize
        };
      case 'hold1': // Right side: top to bottom
        return {
          x: halfSize,
          y: -halfSize + (progress / 100) * boxSize
        };
      case 'exhale': // Bottom side: right to left
        return {
          x: halfSize - (progress / 100) * boxSize,
          y: halfSize
        };
      case 'hold2': // Left side: bottom to top
        return {
          x: -halfSize,
          y: halfSize - (progress / 100) * boxSize
        };
      default:
        return { x: 0, y: 0 };
    }
  };
  
  const tracePosition = getTracePosition();
  
  // Floating animation for the box
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 6,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* Floating box container */}
      <motion.div 
        className="relative mb-10"
        animate={floatingAnimation}
      >
        {/* Main breathing box - no expansion/contraction */}
        <motion.div
          className={`relative bg-gradient-to-r ${themeColors.box} rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md overflow-hidden`}
          style={{ 
            width: boxSize, 
            height: boxSize,
            boxShadow: `0 0 25px 5px ${themeColors.glow}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Glossy overlay effect */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)',
              pointerEvents: 'none',
            }}
          />
          
          {/* Message and countdown inside the box */}
          {isActive && (
            <div className="flex flex-col items-center justify-center">
              <motion.p 
                className="text-white text-xl font-medium text-center drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {breathingState.message}
              </motion.p>
              
              <motion.p
                className="text-white text-4xl font-bold mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={breathingState.countDown} // This ensures animation triggers on number change
              >
                {breathingState.countDown}
              </motion.p>
            </div>
          )}
        </motion.div>
        
        {/* Tracing point that moves around the box with smoother animation */}
        {isActive && tracePosition && (
          <motion.div
            className="absolute"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: themeColors.trace,
              boxShadow: `0 0 10px 3px ${themeColors.trace}`,
              zIndex: 10,
              left: '50%',
              top: '50%',
              marginLeft: tracePosition.x,
              marginTop: tracePosition.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={false}
            transition={{
              type: "spring",
              stiffness: 30,
              damping: 20
            }}
          />
        )}
      </motion.div>
      
      {/* Progress bar for total exercise */}
      {isActive && (
        <div className="w-full max-w-md mb-8">
          <Progress 
            value={totalProgress} 
            className="h-2 bg-white/30 backdrop-blur-sm" 
          />
          <p className="text-center text-sm text-gray-600 mt-2">
            {Math.floor(totalProgress)}% complete
          </p>
        </div>
      )}
      
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
