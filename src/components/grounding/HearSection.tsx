
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EarIcon, Pencil, Mic, ListFilter } from 'lucide-react';
import AudioJournal from '../journal/AudioJournal';
import DrawingJournal from '../journal/DrawingJournal';
import ObjectDragDrop from './ObjectDragDrop';

interface HearSectionProps {
  onComplete: () => void;
  onBack: () => void;
}

const HEARING_OBJECTS = [
  "Music", "Voice", "Conversation", "Vehicle", "Bell", 
  "Alarm", "Traffic", "Bird", "Rain", "Thunder", 
  "Wind", "Appliance", "TV", "Radio", "Typing",
  "Footsteps", "Dog", "Cat", "Airplane", "Siren", 
  "Knock", "Clock", "Fan", "Stream", "Ocean", "Breathing"
];

const HearSection: React.FC<HearSectionProps> = ({ onComplete, onBack }) => {
  const [inputType, setInputType] = useState<string>("text");
  const [textItems, setTextItems] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState<string>("");
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  
  // Audio and drawing states
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioTitle, setAudioTitle] = useState<string>("");
  const [drawingBlob, setDrawingBlob] = useState<Blob | null>(null);
  const [drawingTitle, setDrawingTitle] = useState<string>("");
  
  // Load cached data if available
  useEffect(() => {
    const cachedHearData = localStorage.getItem('groundingHearData');
    if (cachedHearData) {
      try {
        const parsedData = JSON.parse(cachedHearData);
        setTextItems(parsedData.textItems || []);
        setSelectedObjects(parsedData.selectedObjects || []);
        setInputType(parsedData.inputType || "text");
      } catch (err) {
        console.error("Error loading cached hear data:", err);
      }
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    const dataToCache = {
      textItems,
      selectedObjects,
      inputType
    };
    
    localStorage.setItem('groundingHearData', JSON.stringify(dataToCache));
  }, [textItems, selectedObjects, inputType]);
  
  const addTextItem = () => {
    if (currentText.trim() && textItems.length < 3) {
      setTextItems([...textItems, currentText.trim()]);
      setCurrentText("");
    }
  };
  
  const removeTextItem = (index: number) => {
    setTextItems(textItems.filter((_, i) => i !== index));
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTextItem();
    }
  };
  
  const handleOnComplete = () => {
    onComplete();
  };
  
  // Determine if the current section is "complete" based on the active input method
  const isComplete = () => {
    switch (inputType) {
      case "text":
        return textItems.length >= 3;
      case "select":
        return selectedObjects.length >= 3;
      case "audio":
        return audioBlob !== null;
      case "drawing":
        return drawingBlob !== null;
      default:
        return false;
    }
  };
  
  const resetSection = () => {
    setTextItems([]);
    setCurrentText("");
    setSelectedObjects([]);
    setAudioBlob(null);
    setAudioTitle("");
    setDrawingBlob(null);
    setDrawingTitle("");
    
    // Clear cached data
    localStorage.removeItem('groundingHearData');
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center mb-4 gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#3DFDFF] to-[#F5DF4D] rounded-full text-white">
              <EarIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D] bg-clip-text text-transparent">
              3 Things You Can Hear
            </h2>
          </div>
          <p className="text-gray-700 mb-6">
            Pause. What's making noise around you? A fan? Your breath? Birds? Your phone buzzing?
          </p>
          
          <Tabs value={inputType} onValueChange={setInputType} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="text" className="flex items-center gap-1.5">
                <span className="hidden sm:inline">Text</span>
                <span className="sm:hidden">📝</span>
              </TabsTrigger>
              <TabsTrigger value="drawing" className="flex items-center gap-1.5">
                <span className="hidden sm:inline">Draw</span>
                <span className="sm:hidden">🎨</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-1.5">
                <span className="hidden sm:inline">Audio</span>
                <span className="sm:hidden">🎤</span>
              </TabsTrigger>
              <TabsTrigger value="select" className="flex items-center gap-1.5">
                <span className="hidden sm:inline">Select</span>
                <span className="sm:hidden">📋</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type sounds you hear..."
                    maxLength={50}
                    disabled={textItems.length >= 3}
                  />
                  <Button 
                    onClick={addTextItem} 
                    disabled={!currentText.trim() || textItems.length >= 3}
                  >
                    Add
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {textItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-[#3DFDFF]/10 rounded-lg"
                    >
                      <span>{index + 1}. {item}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTextItem(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        ×
                      </Button>
                    </motion.div>
                  ))}
                  
                  {textItems.length === 0 && (
                    <p className="text-center text-gray-400 py-6">
                      Add three things you can hear around you right now
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drawing" className="mt-4">
              <DrawingJournal 
                onDrawingChange={(blob) => setDrawingBlob(blob)}
                onTitleChange={(title) => setDrawingTitle(title)}
                title={drawingTitle}
              />
            </TabsContent>

            <TabsContent value="audio" className="mt-4">
              <AudioJournal 
                onAudioChange={(blob) => setAudioBlob(blob)}
                onTitleChange={(title) => setAudioTitle(title)}
                title={audioTitle}
              />
            </TabsContent>

            <TabsContent value="select" className="mt-4">
              <ObjectDragDrop 
                objects={HEARING_OBJECTS} 
                selectedItems={selectedObjects}
                onItemsChange={setSelectedObjects}
                maxItems={3}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-8">
            <div className="space-x-2">
              <Button onClick={onBack} variant="outline">
                Back
              </Button>
              <Button onClick={resetSection} variant="outline">
                Reset
              </Button>
            </div>
            
            <Button 
              onClick={handleOnComplete} 
              disabled={!isComplete()}
              className={`${isComplete() ? 'bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D] text-black' : ''}`}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HearSection;
