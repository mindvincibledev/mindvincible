
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import { drawDot, drawLine } from '@/utils/canvasDrawingUtils';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onSave: (blob: Blob | null) => void;
  initialColor?: string;
  width?: number;
  height?: number;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  onSave,
  initialColor = '#000000',
  width = 600,
  height = 300,
}) => {
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState(initialColor);
  const [lineWidth, setLineWidth] = useState(5);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth || width;
    canvas.height = height;
    
    // Set default styles
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
  }, [canvasRef, color, lineWidth, width, height]);

  const handleStartDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save position
    setLastPosition({ x, y });
    
    // Draw dot
    drawDot(ctx, x, y, color, lineWidth / 2);
  };

  const handleMoveDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw line from last position to current position
    drawLine(ctx, lastPosition.x, lastPosition.y, x, y, color, lineWidth);
    
    // Update last position
    setLastPosition({ x, y });
  };

  const handleEndDrawing = () => {
    // Save canvas state as blob
    saveCanvas();
  };

  // Use the canvas interaction hook
  useCanvasInteraction({
    canvasRef,
    onStartDrawing: handleStartDrawing,
    onMoveDrawing: handleMoveDrawing,
    onEndDrawing: handleEndDrawing,
  });

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      onSave(blob);
    });
  };

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas 
          ref={canvasRef} 
          className="w-full touch-none cursor-crosshair h-[300px]"
        />
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setColor('#000000')}
            className={`${color === '#000000' ? 'ring-2 ring-offset-2 ring-black' : ''}`}
          >
            Black
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setColor('#FF8A48')}
            className={`${color === '#FF8A48' ? 'ring-2 ring-offset-2 ring-orange-500' : ''} bg-[#FF8A48] text-white hover:text-white`}
          >
            Orange
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setColor('#3DFDFF')}
            className={`${color === '#3DFDFF' ? 'ring-2 ring-offset-2 ring-cyan-500' : ''} bg-[#3DFDFF] text-white hover:text-white`}
          >
            Cyan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
