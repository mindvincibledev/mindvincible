
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface FlipCardProps {
  id: string;
  criticalThought: string;
  positiveReframe: string;
  flipped: boolean;
  onFlip: (id: string) => void;
}

const FlipCard: React.FC<FlipCardProps> = ({
  id,
  criticalThought,
  positiveReframe,
  flipped,
  onFlip
}) => {
  return (
    <div className="perspective-[1000px] h-52 cursor-pointer" onClick={() => onFlip(id)}>
      <motion.div 
        className="relative w-full h-full transition-all duration-500 transform-style-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front side - negative thought */}
        <Card 
          className="absolute inset-0 w-full h-full p-4 flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#FC68B3]/10 to-[#FC68B3]/20 shadow-md hover:shadow-lg border-2 border-[#FC68B3]/30"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center">
            <span className="text-xs uppercase tracking-wider text-[#FC68B3]/70 mb-2">
              Critical Thought
            </span>
            <p className="text-lg font-medium text-gray-800">
              {criticalThought}
            </p>
            <div className="mt-auto pt-2 text-xs text-gray-500">
              Tap to flip
            </div>
          </div>
        </Card>
        
        {/* Back side - positive reframe */}
        <Card 
          className="absolute inset-0 w-full h-full p-4 flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#D5D5F1]/10 to-[#D5D5F1]/20 shadow-md border-2 border-[#D5D5F1]/30"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center">
            <span className="text-xs uppercase tracking-wider text-[#D5D5F1]/70 mb-2">
              Positive Reframe
            </span>
            <p className="text-lg font-medium text-gray-800">
              {positiveReframe}
            </p>
            <div className="mt-auto pt-2 text-xs text-gray-500">
              Tap to flip back
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default FlipCard;
