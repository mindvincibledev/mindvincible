
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DraggableObjectProps {
  item: string;
  isSelected: boolean;
  onSelect: (item: string) => void;
}

const DraggableObject: React.FC<DraggableObjectProps> = ({ item, isSelected, onSelect }) => {
  const emoji = getEmojiForItem(item);
  
  return (
    <motion.div
      className={`px-4 py-2 rounded-full cursor-pointer text-center 
                ${isSelected ? 'bg-[#3DFDFF]/20 border border-[#3DFDFF]' : 'bg-white/80 border border-gray-200'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(item)}
      layout
    >
      <span className="mr-2">{emoji}</span>
      {item}
    </motion.div>
  );
};

interface ObjectDragDropProps {
  objects: string[];
  selectedItems: string[];
  onItemsChange: (items: string[]) => void;
  maxItems: number;
}

const ObjectDragDrop: React.FC<ObjectDragDropProps> = ({ objects, selectedItems, onItemsChange, maxItems }) => {
  const handleSelect = (item: string) => {
    if (selectedItems.includes(item)) {
      onItemsChange(selectedItems.filter(i => i !== item));
    } else if (selectedItems.length < maxItems) {
      onItemsChange([...selectedItems, item]);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Selected ({selectedItems.length}/{maxItems}):</p>
        <div className="min-h-16 p-3 border-2 border-dashed border-[#3DFDFF]/30 rounded-lg bg-[#3DFDFF]/5">
          {selectedItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <motion.div
                  key={item}
                  className="px-3 py-1 bg-[#3DFDFF]/20 text-gray-800 rounded-full border border-[#3DFDFF]/50 flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="mr-1">{getEmojiForItem(item)}</span>
                  {item}
                  <button 
                    onClick={() => handleSelect(item)}
                    className="ml-2 h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-3">Tap items below to select them</p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Available objects:</p>
        <motion.div className="flex flex-wrap gap-2 justify-center" layout>
          {objects.map((item) => (
            <DraggableObject
              key={item}
              item={item}
              isSelected={selectedItems.includes(item)}
              onSelect={handleSelect}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

function getEmojiForItem(item: string): string {
  const emojiMap: Record<string, string> = {
    // See section objects
    lights: '💡',
    books: '📚', 
    plants: '🌿',
    window: '🪟', 
    desk: '🪑',
    cup: '☕',
    clock: '⏰', 
    phone: '📱',
    person: '👤', 
    door: '🚪',
    pen: '🖊️', 
    shoes: '👟',
    chair: '💺', 
    shadow: '👥',
    wall: '🧱', 
    ceiling: '⬜',
    floor: '🟤', 
    art: '🖼️',
    screen: '🖥️', 
    mouse: '🖱️',
    dog: '🐶',
    cat: '🐱', 
    trees: '🌳',
    clouds: '☁️',

    // Touch section additional objects
    fabric: '🧵',
    hair: '💇',
    skin: '✋',
    paper: '📄',
    wood: '🪵',
    metal: '🔧',
    plastic: '🥤',
    carpet: '🔲',
    blanket: '🛏️',
    pillow: '🛏️',
    remote: '🎮',
    glasses: '👓',
    watch: '⌚',
    ring: '💍',
    bracelet: '📿',
    headphones: '🎧',

    // Smell section objects
    food: '🍽️',
    candle: '🕯️',
    shampoo: '🧴',
    air: '💨',
    coffee: '☕',
    perfume: '💐',
    flowers: '🌸',
    freshbread: '🍞',
    soap: '🧼',
    spices: '🌶️',
    laundry: '👕',
    cleaningproducts: '🧹',
    fruit: '🍎',
    grass: '🌿',
    dessert: '🍰',
    fire: '🔥',
    essentialoil: '🌱',
    bottle: '🍾',
    clothing: '👚',
    "Essential Oil": "🌱💧",
    "Fresh Bread": "🥖",
    "Cleaning Products": "🧹",
    
    // Hear section objects
    music: '🎵',
    voice: '🗣️',
    conversation: '💬',
    vehicle: '🚗',
    bell: '🔔',
    alarm: '⏰',
    traffic: '🚦',
    bird: '🐦',
    rain: '🌧️',
    thunder: '⛈️',
    wind: '💨',
    appliance: '🔌',
    tv: '📺',
    radio: '📻',
    typing: '⌨️',
    footsteps: '👣',
    airplane: '✈️',
    siren: '🚨',
    knock: '🚪',
    fan: '💨',
    stream: '🌊',
    ocean: '🌊',
    breathing: '🫁',
    
    // Taste section objects
    "Coffee": "☕",
    "Tea": "🍵",
    "Chocolate": "🍫",
    "Mint": "🌿",
    "Gum": "🍬",
    "Toothpaste": "🪥",
    "Water": "💧",
    "Fruit": "🍎",
    "Candy": "🍭",
    "Bread": "🍞",
    "Nothing": "🚫",
    "Snack": "🍿",
    "Salty": "🧂",
    "Sweet": "🍯",
    "Sour": "🍋",
    "Spicy": "🌶️",
    "Bitter": "☕",
    "Juice": "🧃",
    "Soda": "🥤",
    "Smoothie": "🥤"
  };

  // Convert item to lowercase for case-insensitive matching
  const lowerItem = item.toLowerCase();
  
  // Try exact match first
  if (emojiMap[item]) return emojiMap[item];
  
  // Try lowercase match
  if (emojiMap[lowerItem]) return emojiMap[lowerItem];
  
  // If no match found, return a default emoji
  return '✨';
}

export default ObjectDragDrop;
