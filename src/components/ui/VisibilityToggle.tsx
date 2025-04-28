
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="visibility"
        checked={isVisible}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="visibility" className="text-sm text-gray-600">
        {description}
      </Label>
    </div>
  );
};

export default VisibilityToggle;
