
/**
 * Utility functions for canvas drawing operations
 */

// Draw a dot at the specified position
export const drawDot = (
  context: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  color: string,
  size: number = 10
) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, size, 0, Math.PI * 2);
  context.fill();
};

// Draw a line between two points
export const drawLine = (
  context: CanvasRenderingContext2D,
  fromX: number, 
  fromY: number, 
  toX: number, 
  toY: number, 
  color: string,
  lineWidth: number = 20
) => {
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.stroke();
};

// Draw jar outline
export const drawJarOutline = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number
) => {
  // Drawing the jar outline in black
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  // Jar neck
  const neckWidth = width * 0.3;
  const neckHeight = height * 0.2;
  ctx.moveTo(width/2 - neckWidth/2, height * 0.1);
  ctx.lineTo(width/2 - neckWidth/2, height * 0.1 + neckHeight);
  ctx.lineTo(width * 0.2, height * 0.3); // Left shoulder
  ctx.lineTo(width * 0.2, height * 0.8); // Left side
  ctx.quadraticCurveTo(width * 0.2, height * 0.9, width * 0.5, height * 0.9); // Bottom curve left
  ctx.quadraticCurveTo(width * 0.8, height * 0.9, width * 0.8, height * 0.8); // Bottom curve right
  ctx.lineTo(width * 0.8, height * 0.3); // Right side
  ctx.lineTo(width/2 + neckWidth/2, height * 0.1 + neckHeight); // Right shoulder
  ctx.lineTo(width/2 + neckWidth/2, height * 0.1); // Top right of neck
  ctx.closePath();
  ctx.stroke();
  
  // Jar lid
  ctx.beginPath();
  ctx.arc(width/2, height * 0.07, neckWidth * 0.7, 0, Math.PI * 2);
  ctx.stroke();
};

// Clear canvas and redraw jar outline
export const clearCanvas = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  context.clearRect(0, 0, width, height);
  drawJarOutline(context, width, height);
};
