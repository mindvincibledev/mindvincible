
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Pencil, Save, RotateCcw } from 'lucide-react';
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
    { color: '#FF8A48', name: 'Orange' },
    { color: '#D5D5F1', name: 'Lavender' },
    { color: '#3DFDFF', name: 'Cyan' },
    { color: '#F5DF4D', name: 'Yellow' },
    { color: '#FC68B3', name: 'Pink' },
    { color: '#2AC20E', name: 'Green' },
    { color: '#FFFFFF', name: 'White' },
    { color: '#000000', name: 'Black' }
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
  
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="p-4 rounded-lg border border-[#3DFDFF]/30 bg-white">
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
        
        {/* Brush size selector */}
        <div className="mb-4 flex items-center justify-center gap-4">
          {[2, 5, 10].map((size) => (
            <motion.button
              key={size}
              onClick={() => setStrokeWidth(size)}
              className={`flex items-center justify-center rounded-full transition-all ${
                strokeWidth === size ? 'bg-gray-100' : ''
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="rounded-full bg-black"
                style={{ 
                  width: size * 2, 
                  height: size * 2,
                  backgroundColor: strokeColor
                }}
              />
            </motion.button>
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className="flex items-center gap-1"
          >
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={saveDrawing}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
        
        {/* Canvas */}
        <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white">
          <canvas 
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full touch-none cursor-crosshair h-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
