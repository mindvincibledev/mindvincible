
import React from 'react';
import { Paintbrush } from 'lucide-react';

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  colors, 
  selectedColor, 
  onSelectColor 
}) => {
  return (
    <div className="w-full">
      <h3 className="text-white text-lg mb-3 flex items-center gap-2">
        <Paintbrush className="h-5 w-5" />
        Select Color
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-12 h-12 rounded-full transition-all duration-300 ${
              selectedColor === color 
                ? 'ring-4 ring-white scale-110' 
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
