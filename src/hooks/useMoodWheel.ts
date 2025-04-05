
import { useState, useEffect, RefObject } from 'react';

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
  
  // Create audio for scroll sound effect
  const [scrollSound] = useState(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.src = '/click.mp3'; // We'll add this file later
      audio.volume = 0.2;
      return audio;
    }
    return null;
  });
  
  // Play sound effect when scrolling
  const playScrollSound = () => {
    if (scrollSound) {
      scrollSound.currentTime = 0;
      scrollSound.play().catch(err => console.log('Audio play error:', err));
    }
  };

  // Handle changing the mood
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
      if (isAnimating) return;
      if (e.deltaX > 0 || e.deltaY > 0) {
        changeMood('right');
      } else {
        changeMood('left');
      }
    };
    
    const wheelElement = wheelRef.current;
    if (wheelElement) {
      wheelElement.addEventListener('wheel', handleWheelScroll, {
        passive: true
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
    let currentX;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    const diff = currentX - startX;
    if (Math.abs(diff) > 30) {
      // Threshold for swipe
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

  return {
    selectedMoodIndex,
    setSelectedMoodIndex,
    isAnimating,
    changeMood,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
