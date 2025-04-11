import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wind, Pencil, Mic, ListFilter, Type } from 'lucide-react';
import AudioJournal from '../journal/AudioJournal';
import DrawingJournal from '../journal/DrawingJournal';
import ObjectDragDrop from './ObjectDragDrop';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface SmellSectionProps {
  onComplete: () => void;
  onBack: () => void;
}

const SMELL_OBJECTS = [
  "Food", "Candle", "Shampoo", "Air", "Coffee", "Perfume", 
  "Flowers", "Fresh Bread", "Soap", "Spices", "Laundry", 
  "Cleaning Products", "Fruit", "Books", "Grass", "Dessert", 
  "Fire", "Essential Oil"
];

const SmellSection: React.FC<SmellSectionProps> = ({ onComplete, onBack }) => {
  const { user } = useAuth();
  const [inputType, setInputType] = useState<string>("text");
  const [textItems, setTextItems] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState<string>("");
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  
  // Audio and drawing states
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioTitle, setAudioTitle] = useState<string>("Smells I Can Sense");
  const [drawingBlob, setDrawingBlob] = useState<Blob | null>(null);
  const [drawingTitle, setDrawingTitle] = useState<string>("Smells I Can Sense");
  
  // UI state
  const [saving, setSaving] = useState(false);
  
  // Load cached data if available
  useEffect(() => {
    const cachedSmellData = localStorage.getItem('groundingSmellData');
    if (cachedSmellData) {
      try {
        const parsedData = JSON.parse(cachedSmellData);
        setTextItems(parsedData.textItems || []);
        setSelectedObjects(parsedData.selectedObjects || []);
        setInputType(parsedData.inputType || "text");
      } catch (err) {
        console.error("Error loading cached smell data:", err);
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
    
    localStorage.setItem('groundingSmellData', JSON.stringify(dataToCache));
  }, [textItems, selectedObjects, inputType]);
  
  const addTextItem = () => {
    if (currentText.trim() && textItems.length < 2) {
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
    
    // Check if current input type has valid data
    if (!isComplete()) {
      toast.error("Please complete the section before saving");
      return;
    }
    
    try {
      setSaving(true);
      let drawingPath = null;
      let audioPath = null;
      
      // Upload drawing if any
      if (drawingBlob) {
        try {
          const fileName = `smell_section_${user.id}_${Date.now()}.png`;
          
          // Instead of trying to create a bucket which requires admin permissions,
          // Let's check if it exists and only try to upload
          const { data: existingBuckets } = await supabase.storage.listBuckets();
          
          // Try to find grounding_drawings bucket
          const groundingDrawingsBucket = existingBuckets?.find(bucket => 
            bucket.name === 'grounding_drawings'
          );
          
          if (groundingDrawingsBucket) {
            const { data: drawingData, error: drawingError } = await supabase
              .storage
              .from('grounding_drawings')
              .upload(fileName, drawingBlob, {
                contentType: 'image/png',
                upsert: true
              });
              
            if (drawingError) throw drawingError;
            
            // Get the public URL for the uploaded file
            const { data: publicUrlData } = supabase
              .storage
              .from('grounding_drawings')
              .getPublicUrl(fileName);
              
            drawingPath = publicUrlData.publicUrl;
            console.log("Drawing saved successfully:", drawingPath);
          } else {
            console.warn("grounding_drawings bucket doesn't exist, skipping drawing upload");
          }
        } catch (error) {
          console.error("Error uploading drawing:", error);
          toast.error("Failed to upload drawing. Continuing with other data...");
        }
      }
      
      // Upload audio if any
      if (audioBlob) {
        try {
          const fileName = `smell_section_${user.id}_${Date.now()}.webm`;
          
          // Instead of trying to create a bucket, check if it exists
          const { data: existingBuckets } = await supabase.storage.listBuckets();
          
          // Try to find grounding_audio bucket
          const groundingAudioBucket = existingBuckets?.find(bucket => 
            bucket.name === 'grounding_audio'
          );
          
          if (groundingAudioBucket) {
            const { data: audioData, error: audioError } = await supabase
              .storage
              .from('grounding_audio')
              .upload(fileName, audioBlob, {
                contentType: 'audio/webm',
                upsert: true
              });
              
            if (audioError) throw audioError;
            
            // Get the public URL for the uploaded file
            const { data: publicUrlData } = supabase
              .storage
              .from('grounding_audio')
              .getPublicUrl(fileName);
              
            audioPath = publicUrlData.publicUrl;
            console.log("Audio saved successfully:", audioPath);
          } else {
            console.warn("grounding_audio bucket doesn't exist, skipping audio upload");
          }
        } catch (error) {
          console.error("Error uploading audio:", error);
          toast.error("Failed to upload audio. Continuing with other data...");
        }
      }
      
      // Prepare the data to save to the database
      let responseData = {
        user_id: user.id,
        activity_id: 'grounding-technique',
        section_name: 'smell',
        response_text: inputType === 'text' ? textItems.join(', ') : null,
        response_drawing_path: drawingPath,
        response_audio_path: audioPath,
        response_selected_items: inputType === 'select' ? selectedObjects : null
      };
      
      console.log("Saving to database:", responseData);
      
      // Save to database
      const { error } = await supabase
        .from('grounding_responses')
        .insert(responseData);
        
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Response saved successfully!");
      toast.success("Response saved successfully!");
      
      // Clear the local storage cache since we've saved successfully
      localStorage.removeItem('groundingSmellData');
      
      // Move to next section
      onComplete();
    } catch (error: any) {
      console.error("Error saving response:", error);
      toast.error(`Failed to save your response: ${error.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };
  
  // Determine if the current section is "complete" based on the active input method
  const isComplete = () => {
    switch (inputType) {
      case "text":
        return textItems.length >= 1;
      case "select":
        return selectedObjects.length >= 1;
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
    setAudioTitle("Smells I Can Sense");
    setDrawingBlob(null);
    setDrawingTitle("Smells I Can Sense");
    
    // Clear cached data
    localStorage.removeItem('groundingSmellData');
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
          <span>80% Complete</span>
        </div>
        <Progress value={80} className="h-2" />
      </div>
      
      {/* Section Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="p-3 bg-[#F5DF4D]/20 rounded-full">
          <Wind className="h-8 w-8 text-[#F5DF4D]" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#F5DF4D] to-[#FF8A48] bg-clip-text text-transparent mb-4">
        2 Things You Can Smell
      </h2>
      
      <div className="bg-[#F5DF4D]/10 p-4 rounded-lg mb-6">
        <p className="text-center text-gray-700">
          Take a deep breath. Do you smell food, a candle, your shampoo, the air? 
          <br/>
          <span className="font-medium">If you can't smell anything, think of a smell you like!</span>
        </p>
      </div>
      
      {/* Input Method Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button 
          variant={inputType === 'text' ? 'default' : 'outline'} 
          onClick={() => setInputType('text')}
          className={inputType === 'text' ? 'bg-[#F5DF4D] hover:bg-[#F5DF4D]/90 text-black' : ''}
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
                  placeholder="Type smells you sense..."
                  maxLength={50}
                  disabled={textItems.length >= 2}
                />
                <Button 
                  onClick={addTextItem} 
                  disabled={!currentText.trim() || textItems.length >= 2}
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
                    className="flex items-center justify-between p-3 bg-[#F5DF4D]/10 rounded-lg"
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
                    Add two things you can smell or want to smell
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="draw" className="mt-0">
            <DrawingJournal 
              onDrawingChange={(blob) => setDrawingBlob(blob)}
              onTitleChange={(title) => setDrawingTitle(title)}
              title={drawingTitle}
            />
          </TabsContent>

          <TabsContent value="audio" className="mt-0">
            <AudioJournal 
              onAudioChange={(blob) => setAudioBlob(blob)}
              onTitleChange={(title) => setAudioTitle(title)}
              title={audioTitle}
            />
          </TabsContent>

          <TabsContent value="select" className="mt-0">
            <ObjectDragDrop 
              objects={SMELL_OBJECTS} 
              selectedItems={selectedObjects}
              onItemsChange={setSelectedObjects}
              maxItems={2}
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
            onClick={onComplete}
          >
            Skip
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={!isComplete() || saving}
            className="bg-gradient-to-r from-[#F5DF4D] to-[#FF8A48] hover:opacity-90 text-black font-medium"
          >
            {saving ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SmellSection;
