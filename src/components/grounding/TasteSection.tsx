
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ObjectDragDrop from './ObjectDragDrop';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tasteObjects = [
  'Coffee', 'Tea', 'Chocolate', 'Mint', 'Gum', 
  'Toothpaste', 'Water', 'Fruit', 'Candy', 'Bread',
  'Nothing', 'Snack', 'Salty', 'Sweet', 'Sour',
  'Spicy', 'Bitter', 'Juice', 'Soda', 'Smoothie'
];

interface TasteSectionProps {
  onComplete: () => void;
  onBack: () => void;
}

const TasteSection: React.FC<TasteSectionProps> = ({ onComplete, onBack }) => {
  // State for different input types
  const [textInput, setTextInput] = useState<string>('');
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [selectedTasteType, setSelectedTasteType] = useState<string>('');

  // For determining if the user can proceed
  const canProceed = textInput !== '' || 
                    selectedObject !== '' || 
                    selectedTasteType !== '';

  // Set up persisted storage
  useEffect(() => {
    // Load saved data from localStorage if available
    const savedData = localStorage.getItem('tasteSection');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setTextInput(parsedData.textInput || '');
      setSelectedObject(parsedData.selectedObject || '');
      setSelectedTasteType(parsedData.selectedTasteType || '');
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('tasteSection', JSON.stringify({
      textInput,
      selectedObject,
      selectedTasteType
    }));
  }, [textInput, selectedObject, selectedTasteType]);

  const handleObjectSelect = (item: string) => {
    setSelectedObject(item === selectedObject ? '' : item);
  };

  const handleSkip = () => {
    // Clear the local storage for this section
    localStorage.removeItem('tasteSection');
    onComplete();
  };

  return (
    <motion.div 
      className="rounded-xl bg-white/90 backdrop-blur-sm shadow-lg p-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#2AC20E] bg-clip-text text-transparent">
          Taste: Let's Complete Your Grounding
        </h2>
        <p className="text-gray-700 mt-2">
          What's one taste you notice? Gum? Toothpaste? A snack? Even nothing counts!
        </p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-gray-100">
          <TabsTrigger value="text" className="text-xs sm:text-sm">Text Answer</TabsTrigger>
          <TabsTrigger value="objects" className="text-xs sm:text-sm">Taste Objects</TabsTrigger>
          <TabsTrigger value="tastes" className="text-xs sm:text-sm">Taste Types</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div>
            <Label htmlFor="taste-input">Describe what you taste right now:</Label>
            <Input 
              id="taste-input" 
              value={textInput} 
              onChange={(e) => setTextInput(e.target.value)} 
              className="mt-2"
              placeholder="I taste..."
            />
          </div>
        </TabsContent>

        <TabsContent value="objects">
          <div className="w-full">
            <p className="text-sm font-medium text-gray-700 mb-4">Select one taste object:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {tasteObjects.map((item) => {
                const emoji = getEmojiForItem(item);
                return (
                  <motion.div
                    key={item}
                    className={`px-4 py-2 rounded-full cursor-pointer text-center 
                              ${selectedObject === item ? 'bg-[#3DFDFF]/20 border border-[#3DFDFF]' : 'bg-white/80 border border-gray-200'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleObjectSelect(item)}
                    layout
                  >
                    <span className="mr-2">{emoji}</span>
                    {item}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tastes">
          <RadioGroup 
            value={selectedTasteType} 
            onValueChange={setSelectedTasteType}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2 p-3 rounded-lg border border-gray-200 bg-white/80">
                <RadioGroupItem id="sweet" value="sweet" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="sweet" className="text-base">Sweet</Label>
                  <p className="text-sm text-gray-500">Sugar, fruit, candy</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 p-3 rounded-lg border border-gray-200 bg-white/80">
                <RadioGroupItem id="salty" value="salty" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="salty" className="text-base">Salty</Label>
                  <p className="text-sm text-gray-500">Chips, pretzels, olives</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 p-3 rounded-lg border border-gray-200 bg-white/80">
                <RadioGroupItem id="sour" value="sour" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="sour" className="text-base">Sour</Label>
                  <p className="text-sm text-gray-500">Lemon, vinegar, yogurt</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 p-3 rounded-lg border border-gray-200 bg-white/80">
                <RadioGroupItem id="bitter" value="bitter" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="bitter" className="text-base">Bitter</Label>
                  <p className="text-sm text-gray-500">Coffee, dark chocolate</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 p-3 rounded-lg border border-gray-200 bg-white/80">
                <RadioGroupItem id="umami" value="umami" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="umami" className="text-base">Umami</Label>
                  <p className="text-sm text-gray-500">Savory, broth, mushrooms</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button 
            onClick={onComplete} 
            disabled={!canProceed}
            className="bg-gradient-to-r from-[#3DFDFF] to-[#FC68B3] hover:opacity-90 flex items-center"
          >
            Complete
            {canProceed ? <Check className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to get emoji for items
function getEmojiForItem(item: string): string {
  const emojiMap: Record<string, string> = {
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
    "Smoothie": "🥤",
    "Fresh Bread": "🥖",
    "Cleaning Products": "🧹",
    "Essential Oil": "🌱💧",
  };

  return emojiMap[item] || "✨";
}

export default TasteSection;
