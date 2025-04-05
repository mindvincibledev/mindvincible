
import { useState, useEffect, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseCanvasInteractionProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  onStartDrawing: (x: number, y: number) => void;
  onMoveDrawing: (x: number, y: number) => void;
  onEndDrawing: () => void;
}

export const useCanvasInteraction = ({
  canvasRef,
  onStartDrawing,
  onMoveDrawing,
  onEndDrawing
}: UseCanvasInteractionProps) => {
  const [isDrawing, setIsDrawing] = useState(false);

  // Mouse event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setIsDrawing(true);
      onStartDrawing(x, y);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onMoveDrawing(x, y);
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      onEndDrawing();
    };

    const handleMouseLeave = () => {
      if (isDrawing) {
        setIsDrawing(false);
        onEndDrawing();
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasRef, isDrawing, onStartDrawing, onMoveDrawing, onEndDrawing]);

  // Touch event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setIsDrawing(true);
      onStartDrawing(x, y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      onMoveDrawing(x, y);
    };

    const handleTouchEnd = () => {
      setIsDrawing(false);
      onEndDrawing();
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasRef, isDrawing, onStartDrawing, onMoveDrawing, onEndDrawing]);

  return { isDrawing };
};
