
import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";

interface EmojiSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  emojis: string[];
  label?: string;
  description?: string;
}

const EmojiSlider = ({ value, onValueChange, emojis, label, description }: EmojiSliderProps) => {
  const steps = emojis.length - 1;
  const currentEmoji = emojis[value[0]] || emojis[0];

  return (
    <div className="space-y-4">
      {label && (
        <div className="text-sm font-medium text-gray-700">
          {label}
          {description && (
            <span className="block text-xs text-gray-500 mt-1">{description}</span>
          )}
        </div>
      )}
      
      <div className="flex flex-col items-center gap-2">
        <motion.div
          key={currentEmoji}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl"
        >
          {currentEmoji}
        </motion.div>
        
        <Slider
          value={value}
          onValueChange={onValueChange}
          max={steps}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default EmojiSlider;
