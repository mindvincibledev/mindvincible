
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EarIcon, Pencil, Mic, ListFilter, Type, Save, ArrowLeft } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import DrawingCanvas from './DrawingCanvas';
import AudioJournal from '../journal/AudioJournal';
import ObjectDragDrop from './ObjectDragDrop';
import { generateGroundingFilename, uploadGroundingFile } from '@/utils/groundingFileUtils';

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
  const { user } = useAuth();
  const [inputType, setInputType] = useState<string>("text");
  const [textItems, setTextItems] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState<string>("");
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  
  // Audio and drawing states
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioTitle, setAudioTitle] = useState<string>("Sounds I Can Hear");
  const [drawingBlob, setDrawingBlob] = useState<Blob | null>(null);
  
  // UI state
  const [saving, setSaving] = useState(false);
  
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
  
  const handleSave = async () => {
    if (!user?.id) {
      toast.error("You need to be logged in to save your response");
      return;
    }

    try {
      setSaving(true);
      let drawingPath = null;
      let audioPath = null;

      // Upload drawing if any
      if (drawingBlob) {
        const result = await uploadGroundingFile(user.id, 'hear', drawingBlob, 'drawing');
        if (result) {
          drawingPath = result.path;
        }
      }

      // Upload audio if any
      if (audioBlob) {
        const result = await uploadGroundingFile(user.id, 'hear', audioBlob, 'audio');
        if (result) {
          audioPath = result.path;
        }
      }

      // Save to database
      const { error } = await supabase
        .from('grounding_responses')
        .insert({
          user_id: user.id,
          activity_id: 'grounding-technique',
          section_name: 'hear',
          response_text: inputType === 'text' ? textItems.join(', ') : null,
          response_drawing_path: drawingPath,
          response_audio_path: audioPath,
          response_selected_items: inputType === 'select' ? selectedObjects : null
        });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      toast.success("Response saved successfully!");
      onComplete();
    } catch (error) {
      console.error("Error saving response:", error);
      toast.error("Failed to save your response. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  
  // Skip this section
  const handleSkip = () => {
    toast.info("Section skipped");
    onComplete();
  };
  
  // Determine if the current section is "complete" based on the active input method
  const isValid = () => {
    switch (inputType) {
      case "text":
        return textItems.length > 0;
      case "select":
        return selectedObjects.length > 0;
      case "audio":
        return audioBlob !== null;
      case "draw":
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
    setAudioTitle("Sounds I Can Hear");
    setDrawingBlob(null);
    
    // Clear cached data
    localStorage.removeItem('groundingHearData');
    toast.info("Reset complete");
  };

  return (
    <motion.div 
      className="p-6 rounded-xl bg-white/90 backdrop-blur-md shadow-lg max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Beginning</span>
          <span>60% Complete</span>
        </div>
        <Progress value={60} className="h-2" />
      </div>
      
      {/* Section Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="p-3 bg-[#3DFDFF]/20 rounded-full">
          <EarIcon className="h-8 w-8 text-[#3DFDFF]" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] bg-clip-text text-transparent mb-4">
        3 Things You Can Hear
      </h2>
      
      <div className="bg-[#3DFDFF]/10 p-4 rounded-lg mb-6">
        <p className="text-center text-gray-700">
          Pause. What's making noise around you? A fan? Your breath? Birds? Your phone buzzing?
          <br/>
          <span className="font-medium">List 3 things you can hear right now.</span>
        </p>
      </div>
      
      {/* Input Method Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button 
          variant={inputType === 'text' ? 'default' : 'outline'} 
          onClick={() => setInputType('text')}
          className={inputType === 'text' ? 'bg-[#3DFDFF] hover:bg-[#3DFDFF]/90' : ''}
        >
          <Type className="h-4 w-4 mr-2" />
          Type
        </Button>
        
        <Button 
          variant={inputType === 'draw' ? 'default' : 'outline'} 
          onClick={() => setInputType('draw')}
          className={inputType === 'draw' ? 'bg-[#FC68B3] hover:bg-[#FC68B3]/90' : ''}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Draw
        </Button>
        
        <Button 
          variant={inputType === 'audio' ? 'default' : 'outline'} 
          onClick={() => setInputType('audio')}
          className={inputType === 'audio' ? 'bg-[#2AC20E] hover:bg-[#2AC20E]/90' : ''}
        >
          <Mic className="h-4 w-4 mr-2" />
          Speak
        </Button>
        
        <Button 
          variant={inputType === 'select' ? 'default' : 'outline'} 
          onClick={() => setInputType('select')}
          className={inputType === 'select' ? 'bg-[#FF8A48] hover:bg-[#FF8A48]/90' : ''}
        >
          <ListFilter className="h-4 w-4 mr-2" />
          Select
        </Button>
      </div>
      
      {/* Input Area */}
      <div className="min-h-[300px] mb-6">
        <Tabs value={inputType} onValueChange={setInputType} className="w-full">
          <TabsContent value="text" className="mt-0">
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
                    Add things you can hear around you right now
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="draw" className="mt-0">
            <DrawingCanvas 
              onDrawingChange={setDrawingBlob}
              initialColor="#3DFDFF"
            />
          </TabsContent>

          <TabsContent value="audio" className="mt-0">
            <AudioJournal 
              onAudioChange={setAudioBlob}
              onTitleChange={setAudioTitle}
              title={audioTitle}
            />
          </TabsContent>

          <TabsContent value="select" className="mt-0">
            <ObjectDragDrop 
              objects={HEARING_OBJECTS} 
              selectedItems={selectedObjects}
              onItemsChange={setSelectedObjects}
              maxItems={3}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button 
            variant="outline"
            onClick={resetSection}
          >
            Reset
          </Button>
        </div>
        
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={handleSkip}
          >
            Skip
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={!isValid() || saving}
            className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:opacity-90 text-black font-medium"
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save & Continue
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default HearSection;
