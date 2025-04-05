
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface JarCanvasProps {
  selectedColor: string;
  selectedEmotion: string;
  drawJarOutline: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const JarCanvas = forwardRef<HTMLCanvasElement, JarCanvasProps>(
  ({ selectedColor, selectedEmotion, drawJarOutline }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);
    const canvasSize = { width: 300, height: 400 };
    
    // Store current color and previous position for drawing
    const currentColor = useRef(selectedColor);
    const lastPosition = useRef({ x: 0, y: 0 });
    
    // Forward the ref to parent component
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    // Update the color ref when selectedColor changes
    useEffect(() => {
      currentColor.current = selectedColor;
    }, [selectedColor]);

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

    // Handle starting a drawing action
    const startDrawing = (x: number, y: number) => {
      setIsDrawing(true);
      lastPosition.current = { x, y };
      drawDot(x, y);
    };

    // Handle moving while drawing
    const moveDrawing = (x: number, y: number) => {
      if (!isDrawing) return;
      drawLine(lastPosition.current.x, lastPosition.current.y, x, y);
      lastPosition.current = { x, y };
    };

    // Handle end of drawing
    const endDrawing = () => {
      setIsDrawing(false);
    };

    // Draw a dot at the specified position
    const drawDot = (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      context.fillStyle = currentColor.current;
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      context.fill();
    };

    // Draw a line between two points
    const drawLine = (fromX: number, fromY: number, toX: number, toY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      context.strokeStyle = currentColor.current;
      context.lineWidth = 20;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      
      context.beginPath();
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.stroke();
    };

    // Touch event handlers
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Touch events
      const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        startDrawing(x, y);
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        moveDrawing(x, y);
      };

      const handleTouchEnd = () => {
        endDrawing();
      };

      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);

      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }, [isDrawing]);

    // Mouse event handlers
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Mouse events
      const handleMouseDown = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        startDrawing(x, y);
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        moveDrawing(x, y);
      };

      const handleMouseUp = () => {
        endDrawing();
      };

      const handleMouseLeave = () => {
        endDrawing();
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
    }, [isDrawing]);

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
