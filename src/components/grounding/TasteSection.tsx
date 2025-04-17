
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [selectedTastes, setSelectedTastes] = useState<{[key: string]: boolean}>({
    sweet: false,
    salty: false,
    sour: false,
    bitter: false,
    umami: false
  });

  // For determining if the user can proceed
  const canProceed = textInput !== '' || 
                    selectedObjects.length > 0 || 
                    Object.values(selectedTastes).some(value => value);

  // Set up persisted storage
  useEffect(() => {
    // Load saved data from localStorage if available
    const savedData = localStorage.getItem('tasteSection');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setTextInput(parsedData.textInput || '');
      setSelectedObjects(parsedData.selectedObjects || []);
      setSelectedTastes(parsedData.selectedTastes || {
        sweet: false,
        salty: false,
        sour: false,
        bitter: false,
        umami: false
      });
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('tasteSection', JSON.stringify({
      textInput,
      selectedObjects,
      selectedTastes
    }));
  }, [textInput, selectedObjects, selectedTastes]);

  const handleTastesChange = (id: string, checked: boolean) => {
    setSelectedTastes(prev => ({
      ...prev,
      [id]: checked
    }));
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
          <ObjectDragDrop 
            objects={tasteObjects} 
            selectedItems={selectedObjects}
            onItemsChange={setSelectedObjects}
            maxItems={3}
          />
        </TabsContent>

        <TabsContent value="tastes">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="sweet" 
                checked={selectedTastes.sweet}
                onCheckedChange={(checked) => handleTastesChange('sweet', checked === true)} 
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="sweet">Sweet</Label>
                <p className="text-sm text-gray-500">Sugar, fruit, candy</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="salty" 
                checked={selectedTastes.salty}
                onCheckedChange={(checked) => handleTastesChange('salty', checked === true)} 
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="salty">Salty</Label>
                <p className="text-sm text-gray-500">Chips, pretzels, olives</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="sour" 
                checked={selectedTastes.sour}
                onCheckedChange={(checked) => handleTastesChange('sour', checked === true)} 
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="sour">Sour</Label>
                <p className="text-sm text-gray-500">Lemon, vinegar, yogurt</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="bitter" 
                checked={selectedTastes.bitter}
                onCheckedChange={(checked) => handleTastesChange('bitter', checked === true)} 
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="bitter">Bitter</Label>
                <p className="text-sm text-gray-500">Coffee, dark chocolate</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="umami" 
                checked={selectedTastes.umami}
                onCheckedChange={(checked) => handleTastesChange('umami', checked === true)} 
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="umami">Umami</Label>
                <p className="text-sm text-gray-500">Savory, broth, mushrooms</p>
              </div>
            </div>
          </div>
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

export default TasteSection;
