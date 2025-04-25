
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Pencil, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';

interface DrawingCanvasProps {
  onDrawingChange: (blob: Blob) => void;
  initialColor?: string;
  className?: string;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onDrawingChange, 
  initialColor = '#000000',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState(initialColor);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Available colors using the app's color scheme
  const colors = [
    { color: '#000000', name: 'Black' },
    { color: '#FC68B3', name: 'Pink' },
    { color: '#FF8A48', name: 'Orange' },
    { color: '#3DFDFF', name: 'Cyan' },
    { color: '#F5DF4D', name: 'Yellow' },
    { color: '#2AC20E', name: 'Green' }
  ];

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set initial canvas background to white
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set initial drawing style
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Initial save of the blank canvas
    saveDrawing();
    
    // Handle window resize
    const handleResize = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = strokeColor;
      context.lineWidth = strokeWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';

      context.drawImage(tempCanvas, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update stroke style when color or width changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
  }, [strokeColor, strokeWidth]);

  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    lastPosition.current = { x, y };
    
    // Draw initial dot
    context.beginPath();
    context.arc(x, y, strokeWidth / 2, 0, Math.PI * 2);
    context.fillStyle = strokeColor;
    context.fill();
  };

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Draw line
    context.beginPath();
    context.moveTo(lastPosition.current.x, lastPosition.current.y);
    context.lineTo(x, y);
    context.stroke();
    
    // Update last position
    lastPosition.current = { x, y };
  };

  const endDrawing = () => {
    saveDrawing();
  };

  // Use the canvas interaction hook
  useCanvasInteraction({
    canvasRef,
    onStartDrawing: startDrawing,
    onMoveDrawing: draw,
    onEndDrawing: endDrawing
  });

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      if (blob) {
        onDrawingChange(blob);
      } else {
        console.error("Failed to create blob from canvas");
      }
    }, 'image/png');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear canvas and set white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save the cleared canvas
    saveDrawing();
  };

  // Determine the line thickness label based on width
  const getLineThicknessLabel = (width: number) => {
    if (width <= 2) return "Thin";
    if (width <= 5) return "Medium";
    return "Thick";
  };
  
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        {/* Color selector */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {colors.map(({color, name}) => (
            <button
              key={color}
              onClick={() => setStrokeColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                strokeColor === color 
                  ? 'border-black scale-110 shadow-glow' 
                  : 'border-transparent opacity-80'
              }`}
              style={{ 
                backgroundColor: color,
                boxShadow: strokeColor === color ? `0 0 8px ${color}` : 'none'
              }}
              aria-label={`Select ${name} color`}
              title={name}
            />
          ))}
        </div>
        
        {/* Line Width selector */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Line Width: {getLineThicknessLabel(strokeWidth)}</p>
          <div className="flex justify-between gap-2">
            <button 
              onClick={() => setStrokeWidth(2)}
              className={`px-4 py-1 rounded ${strokeWidth === 2 ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              Thin
            </button>
            <button 
              onClick={() => setStrokeWidth(5)}
              className={`px-4 py-1 rounded ${strokeWidth === 5 ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              Medium
            </button>
            <button 
              onClick={() => setStrokeWidth(10)}
              className={`px-4 py-1 rounded ${strokeWidth === 10 ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              Thick
            </button>
          </div>
        </div>
        
        {/* Clear button */}
        <div className="flex justify-start mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className="flex items-center gap-1"
          >
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        </div>
        
        {/* Canvas */}
        <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-1 bg-white">
          <canvas 
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full touch-none cursor-crosshair h-[300px]"
          />
        </div>
        
        <p className="text-gray-500 text-sm text-center">
          Draw using your mouse or finger on touch screens
        </p>
      </div>
    </div>
  );
};

export default DrawingCanvas;
