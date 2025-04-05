
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseMoodWheelProps {
  moodsCount: number;
  initialMoodIndex?: number;
  wheelRef: RefObject<HTMLDivElement>;
}

export const useMoodWheel = ({ 
  moodsCount, 
  initialMoodIndex = 0, 
  wheelRef 
}: UseMoodWheelProps) => {
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(initialMoodIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragThreshold, setDragThreshold] = useState(30); // Adjustable drag threshold
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio for scroll sound effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.src = '/click.mp3';
      audio.volume = 0.2;
      audio.load();
      audioRef.current = audio;
      
      // Clean up
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  // Handle screen size changes for touch sensitivity
  useEffect(() => {
    const updateDragThreshold = () => {
      // Make drag less sensitive on larger screens
      setDragThreshold(window.innerWidth > 768 ? 50 : 30);
    };
    
    updateDragThreshold();
    window.addEventListener('resize', updateDragThreshold);
    
    return () => {
      window.removeEventListener('resize', updateDragThreshold);
    };
  }, []);
  
  // Play sound effect when scrolling
  const playScrollSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        // Silently handle autoplay restrictions
        console.log('Audio play error:', err);
      });
    }
  };

  // Handle changing the mood with proper centralization
  const changeMood = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    let newIndex = selectedMoodIndex;
    
    if (direction === 'left') {
      newIndex = (selectedMoodIndex - 1 + moodsCount) % moodsCount;
    } else {
      newIndex = (selectedMoodIndex + 1) % moodsCount;
    }
    
    setSelectedMoodIndex(newIndex);
    playScrollSound();

    // Reset animation flag after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Alternative direct selection handler to ensure proper centering
  const handleDirectMoodSelect = (index: number) => {
    if (isAnimating || index === selectedMoodIndex) return;
    
    setIsAnimating(true);
    setSelectedMoodIndex(index);
    playScrollSound();
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle keyboard navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        changeMood('left');
      } else if (e.key === "ArrowRight") {
        changeMood('right');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMoodIndex, isAnimating, moodsCount]);

  // Handle wheel scroll event
  useEffect(() => {
    const handleWheelScroll = (e: WheelEvent) => {
      // Prevent scrolling if already animating
      if (isAnimating) return;
      
      // Prevent default browser scrolling behavior
      e.preventDefault();
      
      // Detect horizontal scroll or vertical scroll (most common)
      // For trackpads and touch devices, deltaX is often used for horizontal scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scroll detection (trackpads typically)
        if (e.deltaX > 0) {
          changeMood('right');
        } else {
          changeMood('left');
        }
      } else {
        // Vertical scroll detection (mouse wheels typically)
        if (e.deltaY > 0) {
          changeMood('right');
        } else {
          changeMood('left');
        }
      }
    };
    
    const wheelElement = wheelRef.current;
    if (wheelElement) {
      // Use passive: false to be able to call preventDefault
      wheelElement.addEventListener('wheel', handleWheelScroll, {
        passive: false
      });
    }
    
    return () => {
      if (wheelElement) {
        wheelElement.removeEventListener('wheel', handleWheelScroll);
      }
    };
  }, [selectedMoodIndex, isAnimating, moodsCount, wheelRef]);

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
    
    let currentX: number;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    
    const diff = currentX - startX;
    if (Math.abs(diff) > dragThreshold) {
      // Pass the drag threshold
      if (diff > 0) {
        changeMood('left');
      } else {
        changeMood('right');
      }
      
      // Reset drag state
      setIsDragging(false);
      setStartX(0);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return {
    selectedMoodIndex,
    setSelectedMoodIndex: handleDirectMoodSelect,
    isAnimating,
    changeMood,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
