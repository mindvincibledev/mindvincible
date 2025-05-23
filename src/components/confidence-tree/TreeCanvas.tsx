
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { calculateLeafPositions, drawLeafShape } from '@/utils/confidenceTreeUtils';

interface TreeData {
  id?: string;
  user_id?: string;
  name: string;
  branches: Branch[];
  created_at?: string;
  is_shared?: boolean;
}

interface Branch {
  id: string;
  name: string;
  leaves: Leaf[];
}

interface Leaf {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'mixed';
  starred?: boolean;
}

interface TreeCanvasProps {
  treeData: TreeData;
  interactiveMode?: 'build' | 'view' | 'reflect';
  simplified?: boolean;
  onBranchClick?: (branch: Branch) => void;
  onLeafClick?: (branch: Branch, leaf: Leaf) => void;
}

const TreeCanvas = ({ 
  treeData, 
  interactiveMode = 'view',
  simplified = false,
  onBranchClick,
  onLeafClick
}: TreeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [hoveredElement, setHoveredElement] = useState<{ type: 'branch' | 'leaf', id: string, text: string } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // Track branch and leaf positions for interactivity
  const [branchPositions, setBranchPositions] = useState<Map<string, { x: number, y: number, width: number, height: number, angle: number }>>(new Map());
  const [leafPositions, setLeafPositions] = useState<Map<string, { x: number, y: number, radius: number, branchId: string }>>(new Map());
  
  // Update canvas size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasWrapperRef.current) {
        setCanvasSize({
          width: canvasWrapperRef.current.clientWidth,
          height: simplified ? 160 : 400
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [simplified]);

  // Draw tree when component renders or data changes
  useEffect(() => {
    if (!canvasRef.current || canvasSize.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Adjust canvas resolution for high DPI displays
    canvas.width = canvasSize.width * window.devicePixelRatio;
    canvas.height = canvasSize.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Reset styles
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw tree components
    drawTree(ctx, treeData);
    
  }, [treeData, canvasSize]);
  
  // Handle mouse interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if mouse is hovering over a branch
      let foundElement = false;
      
      // First check branches (they're underneath leaves)
      branchPositions.forEach((pos, branchId) => {
        // Calculate if point is on the branch line
        const branch = treeData.branches.find(b => b.id === branchId);
        if (!branch) return;
        
        // Use a larger hit area for better UX
        const hitAreaWidth = 20;
        
        const dx = Math.cos(pos.angle) * hitAreaWidth;
        const dy = Math.sin(pos.angle) * hitAreaWidth;
        
        // Check if point is within the rotated rectangle representing the branch
        const pointInRotatedRect = isPointInRotatedRect(
          x, y,
          pos.x, pos.y,
          pos.width, hitAreaWidth,
          pos.angle
        );
        
        if (pointInRotatedRect) {
          setHoveredElement({ type: 'branch', id: branchId, text: branch.name });
          foundElement = true;
          return;
        }
      });
      
      // Then check leaves (they're on top)
      if (!foundElement) {
        leafPositions.forEach((pos, leafId) => {
          const branchId = pos.branchId;
          const branch = treeData.branches.find(b => b.id === branchId);
          if (!branch) return;
          
          const leaf = branch.leaves.find(l => l.id === leafId);
          if (!leaf) return;
          
          const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
          if (distance <= pos.radius) {
            setHoveredElement({ type: 'leaf', id: leafId, text: leaf.text });
            foundElement = true;
            return;
          }
        });
      }
      
      if (!foundElement) {
        setHoveredElement(null);
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      if (!hoveredElement) return;
      
      if (hoveredElement.type === 'branch') {
        const branch = treeData.branches.find(b => b.id === hoveredElement.id);
        if (branch && onBranchClick) {
          onBranchClick(branch);
        }
      } else if (hoveredElement.type === 'leaf') {
        // Find which branch contains this leaf
        for (const branch of treeData.branches) {
          const leaf = branch.leaves.find(l => l.id === hoveredElement.id);
          if (leaf && onLeafClick) {
            onLeafClick(branch, leaf);
            break;
          }
        }
      }
    };
    
    if (interactiveMode !== 'view') {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);
        
        return () => {
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('click', handleClick);
        };
      }
    }
  }, [treeData, branchPositions, leafPositions, hoveredElement, interactiveMode, onBranchClick, onLeafClick]);
  
  // Helper function to detect if a point is inside a rotated rectangle
  const isPointInRotatedRect = (
    px: number, py: number,
    rectX: number, rectY: number,
    rectWidth: number, rectHeight: number,
    angleRad: number
  ) => {
    // Translate point to origin relative to rectangle center
    const cx = rectX + rectWidth / 2;
    const cy = rectY;
    
    // Translate point
    const tx = px - cx;
    const ty = py - cy;
    
    // Rotate point
    const rx = tx * Math.cos(-angleRad) - ty * Math.sin(-angleRad);
    const ry = tx * Math.sin(-angleRad) + ty * Math.cos(-angleRad);
    
    // Check if rotated point is inside the original rectangle
    return Math.abs(rx) <= rectWidth / 2 && Math.abs(ry) <= rectHeight / 2;
  };
  
  // Draw the full tree
  const drawTree = (ctx: CanvasRenderingContext2D, treeData: TreeData) => {
    const width = canvasSize.width;
    const height = canvasSize.height;
    
    // Tree dimensions
    const trunkWidth = simplified ? 10 : 20;
    const trunkHeight = simplified ? 60 : 100;
    const trunkX = width / 2;
    const trunkY = height - 20; // Bottom of trunk position
    
    // Reset position tracking
    const newBranchPositions = new Map();
    const newLeafPositions = new Map();
    
    // Draw trunk with texture
    drawTrunk(ctx, trunkX, trunkY, trunkWidth, trunkHeight);
    
    // Add tree name/label if not simplified
    if (!simplified) {
      ctx.fillStyle = '#333';
      ctx.font = '14px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('You', trunkX, trunkY + 15);
    }
    
    // Draw branches
    const branchCount = treeData.branches.length;
    if (branchCount > 0) {
      // Calculate branch distribution
      const totalAngleSpan = Math.min(150, 30 * branchCount); // Max 150 degrees
      const startAngle = (270 - totalAngleSpan / 2) * (Math.PI / 180);
      const angleStep = branchCount > 1 ? (totalAngleSpan / (branchCount - 1)) * (Math.PI / 180) : 0;
      
      treeData.branches.forEach((branch, index) => {
        let angle;
        if (branchCount === 1) {
          angle = 270 * (Math.PI / 180); // Single branch goes straight up
        } else {
          angle = startAngle + index * angleStep;
        }
        
        // Branch length varies slightly
        const branchLength = simplified ? 
          40 + (Math.sin(index * 0.7) * 5) : 
          80 + (Math.sin(index * 0.7) * 20);
        
        const endX = trunkX + Math.cos(angle) * branchLength;
        const endY = (trunkY - trunkHeight) + Math.sin(angle) * branchLength;
        
        // Draw branch with texture
        drawBranch(ctx, trunkX, trunkY - trunkHeight, endX, endY, simplified ? 3 : 6);
        
        // Store branch position for interactivity
        newBranchPositions.set(branch.id, {
          x: trunkX,
          y: trunkY - trunkHeight,
          width: branchLength,
          height: simplified ? 3 : 6,
          angle: angle
        });
        
        // Add branch label if not simplified
        if (!simplified) {
          drawBranchLabel(ctx, branch.name, angle, branchLength, trunkX, trunkY - trunkHeight);
        }
        
        // Draw leaves for this branch
        if (branch.leaves.length > 0) {
          drawLeavesOnBranch(
            ctx, 
            branch, 
            trunkX, 
            trunkY - trunkHeight, 
            endX, 
            endY, 
            angle, 
            branchLength, 
            simplified, 
            newLeafPositions
          );
        }
      });
    }
    
    // Update position state
    setBranchPositions(newBranchPositions);
    setLeafPositions(newLeafPositions);
  };
  
  // Draw the trunk with wood texture
  const drawTrunk = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    // Draw trunk base
    ctx.fillStyle = '#8B4513'; // Brown color
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x - width / 2, y - height);
    ctx.lineTo(x + width / 2, y - height);
    ctx.lineTo(x + width / 2, y);
    ctx.closePath();
    ctx.fill();
    
    // Add texture to trunk (vertical lines)
    ctx.strokeStyle = '#6B3F10';
    ctx.lineWidth = 1;
    for (let i = 1; i < width; i += 3) {
      ctx.beginPath();
      ctx.moveTo(x - width / 2 + i, y);
      ctx.lineTo(x - width / 2 + i, y - height);
      ctx.stroke();
    }
  };
  
  // Draw a branch with texture
  const drawBranch = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    width: number
  ) => {
    // Create gradient for more realistic branch
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, '#8B4513');    // Dark brown at trunk
    gradient.addColorStop(1, '#A67C52');    // Lighter at end
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    
    // Draw main branch
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Add wood grain texture
    ctx.strokeStyle = 'rgba(107, 63, 16, 0.4)'; // Dark brown, semi-transparent
    ctx.lineWidth = 1;
    
    // Get angle of branch
    const angle = Math.atan2(endY - startY, endX - startX);
    const branchLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    // Add subtle grain lines along the branch
    for (let i = 0; i < branchLength; i += 6) {
      const x1 = startX + Math.cos(angle) * i;
      const y1 = startY + Math.sin(angle) * i;
      
      // Draw small line across the branch
      const perpAngle = angle + Math.PI/2;
      const grainWidth = width * 0.7;
      
      ctx.beginPath();
      ctx.moveTo(x1 - Math.cos(perpAngle) * grainWidth/2, y1 - Math.sin(perpAngle) * grainWidth/2);
      ctx.lineTo(x1 + Math.cos(perpAngle) * grainWidth/2, y1 + Math.sin(perpAngle) * grainWidth/2);
      ctx.stroke();
    }
  };
  
  // Draw branch label
  const drawBranchLabel = (
    ctx: CanvasRenderingContext2D,
    branchName: string,
    angle: number,
    branchLength: number,
    trunkX: number,
    trunkY: number
  ) => {
    const labelX = trunkX + Math.cos(angle) * (branchLength + 10);
    const labelY = trunkY + Math.sin(angle) * (branchLength + 10);
    
    // Background for text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const textWidth = ctx.measureText(branchName).width;
    ctx.fillRect(labelX - textWidth/2 - 4, labelY - 14, textWidth + 8, 20);
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(branchName, labelX, labelY);
  };
  
  // Draw leaves on a branch
  const drawLeavesOnBranch = (
    ctx: CanvasRenderingContext2D,
    branch: Branch,
    startX: number,
    startY: number, 
    endX: number,
    endY: number,
    branchAngle: number,
    branchLength: number,
    simplified: boolean,
    leafPositions: Map<string, { x: number, y: number, radius: number, branchId: string }>
  ) => {
    const leafCount = branch.leaves.length;
    const maxLeaves = 15;  // Maximum number of leaves per branch
    
    // Leaf size
    const leafBaseSize = simplified ? 6 : 10;
    
    // Calculate leaf positions along the branch
    const leafPositionData = calculateLeafPositions(leafCount, branchLength, branchAngle, maxLeaves);
    
    // Draw each leaf
    leafPositionData.forEach((posData, i) => {
      if (i >= branch.leaves.length) return;
      
      const leaf = branch.leaves[i];
      
      // Calculate position along the branch
      const leafPositionRatio = posData.position;
      const leafX = startX + Math.cos(branchAngle) * (branchLength * leafPositionRatio);
      const leafY = startY + Math.sin(branchAngle) * (branchLength * leafPositionRatio);
      
      // Calculate offset perpendicular to branch
      const perpAngle = branchAngle + (posData.side === 'left' ? Math.PI/2 : -Math.PI/2);
      const offsetDistance = posData.offsetDistance;
      
      const finalLeafX = leafX + Math.cos(perpAngle) * offsetDistance;
      const finalLeafY = leafY + Math.sin(perpAngle) * offsetDistance;
      
      // Draw stem connecting leaf to branch
      ctx.strokeStyle = '#6B3F10';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leafX, leafY);
      ctx.lineTo(finalLeafX, finalLeafY);
      ctx.stroke();
      
      // Vary leaf size slightly for natural look
      const sizeVariation = 0.8 + Math.random() * 0.4;
      const leafSize = leafBaseSize * sizeVariation;
      
      // Determine leaf color based on type
      let leafColor;
      switch (leaf.type) {
        case 'positive':
          leafColor = '#2AC20E';
          break;
        case 'negative':
          leafColor = '#8B4513';
          break;
        case 'mixed':
          // Create a radial gradient for mixed leaves
          const gradient = ctx.createRadialGradient(
            finalLeafX, finalLeafY, 0,
            finalLeafX, finalLeafY, leafSize
          );
          gradient.addColorStop(0, '#2AC20E');
          gradient.addColorStop(1, '#8B4513');
          leafColor = gradient;
          break;
      }
      
      // Calculate leaf angle (perpendicular to branch + slight random variation)
      const leafAngle = perpAngle + (Math.random() * 0.4 - 0.2);
      
      // Draw the leaf
      drawLeafShape(ctx, finalLeafX, finalLeafY, leafSize, leafAngle, leafColor);
      
      // Add star to starred leaves
      if (leaf.starred && !simplified) {
        ctx.fillStyle = '#FFF';
        drawStar(ctx, finalLeafX, finalLeafY, 5, leafSize / 2, leafSize / 4);
      }
      
      // Store leaf position for interactivity
      leafPositions.set(leaf.id, {
        x: finalLeafX,
        y: finalLeafY,
        radius: leafSize,
        branchId: branch.id
      });
    });
  };
  
  // Helper function to draw a star
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  return (
    <div className="relative" ref={canvasWrapperRef}>
      <canvas 
        ref={canvasRef} 
        width={canvasSize.width}
        height={canvasSize.height}
        className={`w-full h-auto ${interactiveMode !== 'view' ? 'cursor-pointer' : ''}`}
        style={{ touchAction: 'none' }}
      />
      
      {/* Floating tooltip for hover state */}
      {hoveredElement && interactiveMode !== 'view' && (
        <div
          className="absolute bg-white p-2 rounded shadow-md text-sm z-10 max-w-xs transform -translate-x-1/2"
          style={{
            left: hoveredElement.type === 'branch' ? 
              branchPositions.get(hoveredElement.id)?.x || 0 :
              leafPositions.get(hoveredElement.id)?.x || 0,
            top: (hoveredElement.type === 'branch' ? 
              branchPositions.get(hoveredElement.id)?.y || 0 :
              leafPositions.get(hoveredElement.id)?.y || 0) - 30
          }}
        >
          <div className="font-medium overflow-hidden text-ellipsis">
            {hoveredElement.text}
          </div>
          {hoveredElement.type === 'branch' && interactiveMode === 'build' && (
            <div className="text-xs text-gray-500">Click to add leaves</div>
          )}
          {hoveredElement.type === 'leaf' && interactiveMode === 'reflect' && (
            <div className="text-xs text-gray-500">Click to interact</div>
          )}
        </div>
      )}
      
      {/* Animated leaves */}
      {!simplified && interactiveMode !== 'view' && (
        <>
          <motion.div
            className="absolute w-6 h-6"
            initial={{ top: -20, left: '30%', opacity: 0 }}
            animate={{ 
              top: [null, '10%', '15%', '20%'], 
              left: [null, '35%', '32%', '28%'],
              opacity: [0, 1, 1, 0],
              rotate: [0, 10, -10, 5]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              repeatDelay: 2,
              times: [0, 0.2, 0.6, 1]
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C7.75 2 4 5.75 4 10C4 14.25 7.75 18 12 18C16.25 18 20 14.25 20 10C20 5.75 16.25 2 12 2Z"
                fill="#2AC20E"
                fillOpacity="0.7"
              />
              <path
                d="M12 18L8 22M12 18L16 22"
                stroke="#2AC20E"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          
          <motion.div
            className="absolute w-5 h-5"
            initial={{ top: -20, right: '25%', opacity: 0 }}
            animate={{ 
              top: [null, '15%', '25%', '35%'], 
              right: [null, '30%', '27%', '22%'],
              opacity: [0, 1, 1, 0],
              rotate: [0, -15, 10, -5]
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity, 
              repeatDelay: 3,
              times: [0, 0.3, 0.7, 1],
              delay: 2
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C7.75 2 4 5.75 4 10C4 14.25 7.75 18 12 18C16.25 18 20 14.25 20 10C20 5.75 16.25 2 12 2Z"
                fill="#8B4513"
                fillOpacity="0.6"
              />
              <path
                d="M12 18L8 22M12 18L16 22"
                stroke="#8B4513"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TreeCanvas;
