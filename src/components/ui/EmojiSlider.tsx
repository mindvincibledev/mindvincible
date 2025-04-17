
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
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Slider
        value={value}
        onValueChange={onValueChange}
        max={10}
        step={1}
        className="my-4"
      />
      <div className="flex justify-between text-2xl">
        <span>{minEmoji}</span>
        <span>{middleEmoji}</span>
        <span>{maxEmoji}</span>
      </div>
    </div>
  );
};

export default EmojiSlider;
