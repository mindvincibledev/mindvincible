
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import { drawDot, drawLine, drawJarOutline as drawJarOutlineUtil } from '@/utils/canvasDrawingUtils';

interface JarCanvasProps {
  selectedColor: string;
  selectedEmotion: string;
  drawJarOutline: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const JarCanvas = forwardRef<HTMLCanvasElement, JarCanvasProps>(
  ({ selectedColor, selectedEmotion, drawJarOutline }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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
      lastPosition.current = { x, y };
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      drawDot(context, x, y, currentColor.current);
    };

    // Handle moving while drawing
    const moveDrawing = (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      drawLine(
        context, 
        lastPosition.current.x, 
        lastPosition.current.y, 
        x, 
        y, 
        currentColor.current
      );
      lastPosition.current = { x, y };
    };

    // Handle end of drawing
    const endDrawing = () => {
      // This function can be expanded if needed for cleanup operations
    };

    // Use the custom hook for touch and mouse interactions
    useCanvasInteraction({
      canvasRef,
      onStartDrawing: startDrawing,
      onMoveDrawing: moveDrawing,
      onEndDrawing: endDrawing
    });

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
