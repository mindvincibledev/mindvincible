
import React from 'react';
import { Smile, Flame, Cloud, Eye, Zap, X, Heart } from 'lucide-react';

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

// Map of emotions associated with each color
const colorEmotions = [
  { color: '#F5DF4D', name: 'Happy', icon: <Smile className="h-5 w-5" /> },
  { color: '#FF8A48', name: 'Angry', icon: <Flame className="h-5 w-5" /> },
  { color: '#3DFDFF', name: 'Sad', icon: <Cloud className="h-5 w-5" /> },
  { color: '#D5D5F1', name: 'Fearful', icon: <Eye className="h-5 w-5" /> },
  { color: '#2AC20E', name: 'Surprised', icon: <Zap className="h-5 w-5" /> },
  { color: '#F5DF4D', name: 'Disgusted', icon: <X className="h-5 w-5" /> },
  { color: '#FC68B3', name: 'Love', icon: <Heart className="h-5 w-5" /> },
];

const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  colors, 
  selectedColor, 
  onSelectColor 
}) => {
  return (
    <div className="w-full">
      <h3 className="text-white text-lg mb-3 text-center">
        Select an emotion color to fill your jar
      </h3>
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {colorEmotions.map((item, index) => (
          <button
            key={item.name}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              colors[index % colors.length] === selectedColor 
                ? 'ring-4 ring-white scale-110' 
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: colors[index % colors.length] }}
            onClick={() => onSelectColor(colors[index % colors.length])}
            aria-label={`Select ${item.name} color`}
          >
            {item.icon}
            <span className={item.color === '#F5DF4D' || item.color === '#2AC20E' ? 'text-black' : 'text-white'}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
      <p className="text-white text-center text-sm mb-4">
        Fill the jar with feelings colours to see how much of each feeling you have right now
      </p>
    </div>
  );
};

export default ColorPalette;
