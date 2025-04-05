
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface JarCanvasProps {
  selectedColor: string;
  selectedEmotion: string;
  drawJarOutline: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const JarCanvas = forwardRef<HTMLCanvasElement, JarCanvasProps>(
  ({ selectedColor, selectedEmotion, drawJarOutline }, ref) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSize = { width: 300, height: 400 };

    // Forward the ref to parent component
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    // Initialize canvas once on mount
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || isCanvasInitialized) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      // Initial setup - clear canvas and draw jar outline
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawJarOutline(context, canvas.width, canvas.height);
      setIsCanvasInitialized(true);
      
    }, [drawJarOutline, isCanvasInitialized]);

    // Setup event listeners
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Setup for mobile
      const setupTouch = () => {
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
      };
      
      // Setup for desktop
      const setupMouse = () => {
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseUp);
      };
      
      setupTouch();
      setupMouse();
      
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
      };
    }, []);

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      setLastPos({ x, y });
      drawDot(x, y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      drawLine(lastPos.x, lastPos.y, x, y);
      setLastPos({ x, y });
    };

    const handleTouchEnd = () => {
      setIsDrawing(false);
    };

    // Fix mouse drawing to be continuous
    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setLastPos({ x, y });
      drawDot(x, y);
    };

    // Updated mouse move handler to draw even without clicking
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      drawLine(lastPos.x, lastPos.y, x, y);
      setLastPos({ x, y });
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    const drawDot = (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      context.fillStyle = selectedColor;
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      context.fill();
    };

    const drawLine = (fromX: number, fromY: number, toX: number, toY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      context.strokeStyle = selectedColor;
      context.lineWidth = 20;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.stroke();
    };

    return (
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border rounded-md touch-none bg-white shadow-lg"
        />
        <div className="flex items-center justify-center mt-4 gap-2">
          <div 
            className="h-5 w-5 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: selectedColor,
              boxShadow: `0 0 10px ${selectedColor}90` 
            }}
          />
          <p className="text-white text-center text-sm">
            Currently coloring with: <span className="font-bold">{selectedEmotion}</span>
          </p>
        </div>
      </div>
    );
  }
);

JarCanvas.displayName = 'JarCanvas';

export default JarCanvas;
