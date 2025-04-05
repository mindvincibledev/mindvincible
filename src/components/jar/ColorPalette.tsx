
import React from 'react';
import { Smile, Flame, Cloud, Eye, Zap, X, Heart } from 'lucide-react';

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string, emotion: string) => void;
}

// Map of emotions associated with each color
const colorEmotions = [
  { color: '#F5DF4D', name: 'Happy', icon: <Smile className="h-5 w-5" /> },
  { color: '#FF8A48', name: 'Angry', icon: <Flame className="h-5 w-5" /> },
  { color: '#3DFDFF', name: 'Sad', icon: <Cloud className="h-5 w-5" /> },
  { color: '#D5D5F1', name: 'Fearful', icon: <Eye className="h-5 w-5" /> },
  { color: '#2AC20E', name: 'Surprised', icon: <Zap className="h-5 w-5" /> },
  { color: '#D6F6D5', name: 'Disgusted', icon: <X className="h-5 w-5" /> },
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
        {colorEmotions.map((item, index) => {
          const isSelected = colors[index % colors.length] === selectedColor;
          const buttonColor = colors[index % colors.length];
          const textColor = buttonColor === '#F5DF4D' || buttonColor === '#2AC20E' || buttonColor === '#D6F6D5' ? 'text-black' : 'text-white';
          
          return (
            <button
              key={item.name}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border border-white/30
                transition-all duration-300 backdrop-blur-sm
                ${isSelected 
                  ? 'ring-2 ring-white/80 scale-105 shadow-lg' 
                  : 'hover:scale-105 hover:shadow-md'}
              `}
              style={{ 
                backgroundColor: isSelected ? `${buttonColor}` : `${buttonColor}70`,
                boxShadow: isSelected ? `0 0 15px ${buttonColor}90` : ''
              }}
              onClick={() => onSelectColor(colors[index % colors.length], item.name)}
              aria-label={`Select ${item.name} color`}
            >
              {item.icon}
              <span className={`font-medium ${textColor}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-white text-center text-sm mb-4">
        Fill the jar with feelings colours to see how much of each feeling you have right now
      </p>
    </div>
  );
};

export default ColorPalette;
