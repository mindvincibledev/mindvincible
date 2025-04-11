
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brush, Trash, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import { useAuth } from '@/context/AuthContext';

interface DrawingJournalProps {
  onDrawingChange: (imageBlob: Blob) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

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

const DrawingJournal: React.FC<DrawingJournalProps> = ({ 
  onDrawingChange, 
  onTitleChange,
  title 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#FC68B3');
  const [brushSize, setBrushSize] = useState(5);
  const lastPosition = useRef({ x: 0, y: 0 });
  const { user } = useAuth();
  
  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set initial canvas background to white
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Initial save of the blank canvas
    saveDrawing();
  }, []);

  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    lastPosition.current = { x, y };
    
    // Draw initial dot
    context.beginPath();
    context.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    context.fillStyle = selectedColor;
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
    context.strokeStyle = selectedColor;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
    
    // Update last position
    lastPosition.current = { x, y };
  };

  const endDrawing = () => {
    // Save drawing
    saveDrawing();
  };

  // Use the canvas interaction hook
  useCanvasInteraction({
    canvasRef,
    onStartDrawing: startDrawing,
    onMoveDrawing: draw,
    onEndDrawing: endDrawing
  });

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Reset canvas to white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save the cleared state
    saveDrawing();
    
    toast({
      title: "Canvas cleared",
      description: "Your drawing has been cleared",
    });
  };

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
  
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="drawing-journal-title" className="text-black mb-2 block font-medium">
          Drawing Journal Title
        </Label>
        <Input
          id="drawing-journal-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter a title for your drawing"
          className="bg-white border-[#3DFDFF]/30 text-black placeholder-gray-500"
        />
      </div>
      
      <div className="p-4 rounded-lg border border-[#3DFDFF]/30 bg-white">
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {colors.map(({color, name}) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color 
                  ? 'border-black scale-110 shadow-glow' 
                  : 'border-transparent opacity-80'
              }`}
              style={{ 
                backgroundColor: color,
                boxShadow: selectedColor === color ? `0 0 8px ${color}` : 'none'
              }}
              aria-label={`Select ${name} color`}
            />
          ))}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="brush-size" className="text-black mb-2 block">
            Brush Size: {brushSize}px
          </Label>
          <input
            type="range"
            id="brush-size"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white">
          <canvas 
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full touch-none cursor-crosshair"
          />
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={clearCanvas}
            variant="destructive"
            className="flex items-center gap-2 text-black"
          >
            <Trash className="h-5 w-5" />
            Clear
          </Button>
          
          <Button 
            onClick={saveDrawing}
            className="bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-black flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            Save Drawing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawingJournal;
