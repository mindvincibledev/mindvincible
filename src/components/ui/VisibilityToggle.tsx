import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'sonner';

interface VisibilityToggleProps {
  isVisible: boolean;
  onToggle: (value: boolean) => void;
  description?: string;
}

const VisibilityToggle = ({ 
  isVisible, 
  onToggle, 
  description = "Make this entry visible to clinicians" 
}: VisibilityToggleProps) => {
  const [localVisible, setLocalVisible] = React.useState(isVisible);

  // Keep local state in sync with prop changes
  React.useEffect(() => {
    setLocalVisible(isVisible);
  }, [isVisible]);

  const handleToggleChange = (value: boolean) => {
    // Update local state immediately for responsive UI
    setLocalVisible(value);
    
    // Call the parent's onToggle handler
    onToggle(value);
    
    // Show toast notification when toggled
    if (value) {
      toast("Sharing Enabled", {
        description: "You're in control. You can turn sharing your response off anytime. Only your trusted school social worker will be able to see what you choose to share.",
        duration: 5000, // Show for 5 seconds
      });
    } else {
      toast("Sharing Disabled", {
        description: "Your entry is now private.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex items-center space-x-2 relative">
      <Switch
        id="visibility"
        checked={localVisible}
        onCheckedChange={handleToggleChange}
        className="data-[state=checked]:bg-[#2AC20E]"
      />
      <Label htmlFor="visibility" className="text-sm text-gray-600">
        {description}
      </Label>
      
      {/* Visual feedback indicator with improved animation */}
      <AnimatePresence>
        {localVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -left-1 -top-1 w-3 h-3 bg-[#2AC20E] rounded-full"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisibilityToggle;
