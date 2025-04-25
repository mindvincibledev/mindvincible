
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrawingCanvasProps {
  onDrawingChange: (blob: Blob) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Configure context
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

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

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;

      ctx.drawImage(tempCanvas, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [strokeColor, strokeWidth]);

  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setLastPosition({ x, y });
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing || !lastPosition) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPosition({ x, y });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPosition(null);
      saveDrawing();
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        onDrawingChange(blob);
      }
    }, 'image/png');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveDrawing();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    draw(x, y);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
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
          onClick={() => {
            setStrokeColor('#000000');
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) ctx.strokeStyle = '#000000';
          }}
          className={`w-8 h-8 p-0 bg-black ${
            strokeColor === '#000000' ? 'ring-2 ring-offset-2 ring-black' : ''
          }`}
        />
        
        {['#FC68B3', '#FF8A48', '#3DFDFF', '#F5DF4D', '#2AC20E'].map((color) => (
          <Button
            key={color}
            variant="outline"
            size="sm"
            onClick={() => {
              setStrokeColor(color);
              const ctx = canvasRef.current?.getContext('2d');
              if (ctx) ctx.strokeStyle = color;
            }}
            className={`w-8 h-8 p-0`}
            style={{
              backgroundColor: color,
              border: strokeColor === color ? '2px solid black' : '1px solid #e2e8f0'
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Line Width:</span>
        {[2, 5, 10].map((width) => (
          <Button
            key={width}
            variant="outline"
            size="sm"
            onClick={() => {
              setStrokeWidth(width);
              const ctx = canvasRef.current?.getContext('2d');
              if (ctx) ctx.lineWidth = width;
            }}
            className={`h-6 px-2 ${strokeWidth === width ? 'bg-gray-100' : ''}`}
          >
            {width === 2 ? 'Thin' : width === 5 ? 'Medium' : 'Thick'}
          </Button>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none bg-white"
          style={{ height: '300px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        Draw using your mouse or finger on touch screens
      </p>
    </div>
  );
};

export default DrawingCanvas;
