
import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface EmojiSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  minEmoji?: string;
  middleEmoji?: string;
  maxEmoji?: string;
  label?: string;
}

const EmojiSlider: React.FC<EmojiSliderProps> = ({
  value,
  onValueChange,
  minEmoji = "😌",
  middleEmoji = "😊",
  maxEmoji = "🌟",
  label
}) => {
  // Create a value-based opacity for the emoji indicators
  const getEmojiOpacity = (position: 'min' | 'middle' | 'max') => {
    const val = value[0];
    
    if (position === 'min') {
      return val <= 3 ? 1 : 0.5;
    } else if (position === 'middle') {
      return val > 3 && val < 8 ? 1 : 0.5;
    } else {
      return val >= 8 ? 1 : 0.5;
    }
  };
  
  return (
    <div className="space-y-4">
      {label && <Label className="text-base mb-2 block">{label}</Label>}
      
      <Slider
        value={value}
        onValueChange={onValueChange}
        max={10}
        step={1}
        className="my-6"
      />
      
      <div className="flex justify-between text-3xl">
        <motion.span 
          animate={{ scale: getEmojiOpacity('min') === 1 ? 1.2 : 1 }}
          style={{ opacity: getEmojiOpacity('min') }}
          className="transition-all duration-300"
        >
          {minEmoji}
        </motion.span>
        
        <motion.span 
          animate={{ scale: getEmojiOpacity('middle') === 1 ? 1.2 : 1 }}
          style={{ opacity: getEmojiOpacity('middle') }}
          className="transition-all duration-300"
        >
          {middleEmoji}
        </motion.span>
        
        <motion.span 
          animate={{ scale: getEmojiOpacity('max') === 1 ? 1.2 : 1 }}
          style={{ opacity: getEmojiOpacity('max') }}
          className="transition-all duration-300"
        >
          {maxEmoji}
        </motion.span>
      </div>
    </div>
  );
};

export default EmojiSlider;
