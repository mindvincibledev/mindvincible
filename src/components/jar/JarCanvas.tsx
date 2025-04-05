
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface JarCanvasProps {
  selectedColor: string;
  drawJarOutline: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const JarCanvas = forwardRef<HTMLCanvasElement, JarCanvasProps>(
  ({ selectedColor, drawJarOutline }, ref) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSize = { width: 300, height: 400 };

    // Forward the ref to parent component
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      // Initial setup - clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw jar outline
      drawJarOutline(context, canvas.width, canvas.height);
      
      // Setup for mobile
      const setupTouch = () => {
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
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
    }, [drawJarOutline]);

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
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
      
      drawDot(x, y);
    };

    const handleTouchEnd = () => {
      setIsDrawing(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      drawDot(x, y);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      drawDot(x, y);
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

    return (
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border rounded-md touch-none"
        style={{ backgroundColor: 'white' }}
      />
    );
  }
);

JarCanvas.displayName = 'JarCanvas';

export default JarCanvas;
