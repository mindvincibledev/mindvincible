
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PenLine, Type, Eraser, RotateCcw } from 'lucide-react';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';

interface SectionBaseProps {
  title: string;
  description: string;
  textPlaceholder: string;
  textValue: string;
  drawingBlob: Blob | null;
  onSaveText: (text: string) => void;
  onSaveDrawing: (blob: Blob | null) => void;
}

const SectionBase: React.FC<SectionBaseProps> = ({
  title,
  description,
  textPlaceholder,
  textValue,
  drawingBlob,
  onSaveText,
  onSaveDrawing
}) => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [text, setText] = useState(textValue || '');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  
  // Drawing state
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [lastPosition, setLastPosition] = useState<{x: number, y: number} | null>(null);

  // Initialize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to match its display size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setCanvasContext(ctx);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    // If there's an existing drawing blob, display it
    if (drawingBlob) {
      const img = new Image();
      const url = URL.createObjectURL(drawingBlob);
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        setIsCanvasEmpty(false);
      };
      
      img.src = url;
    }

    // Handle window resize
    const handleResize = () => {
      if (!canvas || !ctx) return;
      
      // Save current drawing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }
      
      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Restore drawing
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawingBlob, strokeColor, strokeWidth]);

  // Handle canvas drawing interactions
  const startDrawing = (x: number, y: number) => {
    if (!canvasContext) return;
    
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    setLastPosition({ x, y });
    setIsCanvasEmpty(false);
  };

  const moveDrawing = (x: number, y: number) => {
    if (!canvasContext || !lastPosition) return;
    
    canvasContext.beginPath();
    canvasContext.moveTo(lastPosition.x, lastPosition.y);
    canvasContext.lineTo(x, y);
    canvasContext.stroke();
    
    setLastPosition({ x, y });
  };

  const endDrawing = () => {
    if (canvasContext) {
      canvasContext.closePath();
      saveDrawing();
    }
    setLastPosition(null);
  };

  // Use the canvas interaction hook
  useCanvasInteraction({
    canvasRef,
    onStartDrawing: startDrawing,
    onMoveDrawing: moveDrawing,
    onEndDrawing: endDrawing
  });

  // Save canvas drawing to blob
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || isCanvasEmpty) {
      onSaveDrawing(null);
      return;
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        onSaveDrawing(blob);
      }
    }, 'image/png');
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvasContext;
    
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsCanvasEmpty(true);
    onSaveDrawing(null);
  };

  // Handle text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onSaveText(newText);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-gray-700 mt-2">{description}</p>
      </div>
      
      <Tabs
        defaultValue="text"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="drawing" className="flex items-center gap-2">
            <PenLine className="h-4 w-4" />
            Drawing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <Textarea
            placeholder={textPlaceholder}
            value={text}
            onChange={handleTextChange}
            className="min-h-[200px] resize-none p-4 text-gray-700"
          />
        </TabsContent>
        
        <TabsContent value="drawing" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
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
                if (canvasContext) canvasContext.strokeStyle = '#000000';
              }}
              className={`w-8 h-8 p-0 bg-black border-2 ${
                strokeColor === '#000000' ? 'border-[#FC68B3]' : 'border-transparent'
              }`}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStrokeColor('#FC68B3');
                if (canvasContext) canvasContext.strokeStyle = '#FC68B3';
              }}
              className={`w-8 h-8 p-0 bg-[#FC68B3] border-2 ${
                strokeColor === '#FC68B3' ? 'border-black' : 'border-transparent'
              }`}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStrokeColor('#FF8A48');
                if (canvasContext) canvasContext.strokeStyle = '#FF8A48';
              }}
              className={`w-8 h-8 p-0 bg-[#FF8A48] border-2 ${
                strokeColor === '#FF8A48' ? 'border-black' : 'border-transparent'
              }`}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStrokeColor('#3DFDFF');
                if (canvasContext) canvasContext.strokeStyle = '#3DFDFF';
              }}
              className={`w-8 h-8 p-0 bg-[#3DFDFF] border-2 ${
                strokeColor === '#3DFDFF' ? 'border-black' : 'border-transparent'
              }`}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStrokeColor('#F5DF4D');
                if (canvasContext) canvasContext.strokeStyle = '#F5DF4D';
              }}
              className={`w-8 h-8 p-0 bg-[#F5DF4D] border-2 ${
                strokeColor === '#F5DF4D' ? 'border-black' : 'border-transparent'
              }`}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStrokeColor('#2AC20E');
                if (canvasContext) canvasContext.strokeStyle = '#2AC20E';
              }}
              className={`w-8 h-8 p-0 bg-[#2AC20E] border-2 ${
                strokeColor === '#2AC20E' ? 'border-black' : 'border-transparent'
              }`}
            />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">Line Width:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStrokeWidth(2);
                if (canvasContext) canvasContext.lineWidth = 2;
              }}
              className={`h-6 px-2 ${strokeWidth === 2 ? 'bg-gray-200' : ''}`}
            >
              Thin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStrokeWidth(5);
                if (canvasContext) canvasContext.lineWidth = 5;
              }}
              className={`h-6 px-2 ${strokeWidth === 5 ? 'bg-gray-200' : ''}`}
            >
              Medium
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStrokeWidth(10);
                if (canvasContext) canvasContext.lineWidth = 10;
              }}
              className={`h-6 px-2 ${strokeWidth === 10 ? 'bg-gray-200' : ''}`}
            >
              Thick
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full touch-none"
              style={{ height: '300px' }}
            />
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Draw using your mouse or finger on touch screens
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SectionBase;
