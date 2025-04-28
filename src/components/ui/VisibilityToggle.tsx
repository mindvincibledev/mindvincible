
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

interface VisibilityToggleProps {
  isVisible: boolean;
  onToggle: (value: boolean) => void;
  description?: string;
}

const VisibilityToggle = ({ 
  isVisible, 
  onToggle, 
  description = "Make visible to clinicians" 
}: VisibilityToggleProps) => {
  return (
    <div className="flex items-center space-x-2 relative">
      <Switch
        id="visibility"
        checked={isVisible}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-[#2AC20E]"
      />
      <Label htmlFor="visibility" className="text-sm text-gray-600">
        {description}
      </Label>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -left-1 -top-1 w-3 h-3 bg-[#2AC20E] rounded-full"
        />
      )}
    </div>
  );
};

export default VisibilityToggle;
