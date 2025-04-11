
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Pencil, Mic, Hand, Type, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import DrawingJournal from '@/components/journal/DrawingJournal';
import AudioJournal from '@/components/journal/AudioJournal';
import ObjectDragDrop from './ObjectDragDrop';
import { Progress } from '@/components/ui/progress';

interface SeeSectionProps {
  onComplete: () => void;
  onBack: () => void;
}

type InputMethod = 'type' | 'draw' | 'speak' | 'select';

const SeeSection: React.FC<SeeSectionProps> = ({ onComplete, onBack }) => {
  const { user } = useAuth();
  
  // State for input method
  const [inputMethod, setInputMethod] = useState<InputMethod>('type');
  
  // State for each input type
  const [textInput, setTextInput] = useState('');
  
  // Drawing state
  const [drawingBlob, setDrawingBlob] = useState<Blob | null>(null);
  const [drawingPreviewURL, setDrawingPreviewURL] = useState<string | null>(null);
  const [drawingTitle, setDrawingTitle] = useState('Things I Can See');
  
  // Audio state
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewURL, setAudioPreviewURL] = useState<string | null>(null);
  const [audioTitle, setAudioTitle] = useState('Things I Can See');
  
  // Selected items state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // UI state
  const [saving, setSaving] = useState(false);
  
  // Common objects for selection method
  const commonObjects = [
    'lights', 'books', 'plants', 'window', 'desk', 'cup', 'clock', 'phone', 
    'person', 'door', 'pen', 'shoes', 'chair', 'shadow', 'wall', 'ceiling', 
    'floor', 'art', 'screen', 'keyboard', 'mouse', 'dog', 'cat', 'trees', 'clouds'
  ];
  
  // Handlers for input methods
  const handleDrawingChange = (blob: Blob) => {
    // Clean up old URL if exists to prevent memory leaks
    if (drawingPreviewURL) {
      URL.revokeObjectURL(drawingPreviewURL);
    }
    
    // Create new URL and save blob
    const newPreviewURL = URL.createObjectURL(blob);
    setDrawingPreviewURL(newPreviewURL);
    setDrawingBlob(blob);
  };
  
  const handleAudioChange = (blob: Blob) => {
    // Clean up old URL if exists
    if (audioPreviewURL) {
      URL.revokeObjectURL(audioPreviewURL);
    }
    
    // Create new URL and save blob
    const newPreviewURL = URL.createObjectURL(blob);
    setAudioPreviewURL(newPreviewURL);
    setAudioBlob(blob);
  };
  
  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (drawingPreviewURL) {
        URL.revokeObjectURL(drawingPreviewURL);
      }
      if (audioPreviewURL) {
        URL.revokeObjectURL(audioPreviewURL);
      }
    };
  }, []);
  
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
        const fileName = `see_section_${user.id}_${Date.now()}.png`;
        const { data: drawingData, error: drawingError } = await supabase
          .storage
          .from('grounding_drawings')
          .upload(fileName, drawingBlob, {
            contentType: 'image/png',
            upsert: true
          });
          
        if (drawingError) throw drawingError;
        drawingPath = drawingData.path;
      }
      
      // Upload audio if any
      if (audioBlob) {
        const fileName = `see_section_${user.id}_${Date.now()}.webm`;
        const { data: audioData, error: audioError } = await supabase
          .storage
          .from('grounding_audio')
          .upload(fileName, audioBlob, {
            contentType: 'audio/webm',
            upsert: true
          });
          
        if (audioError) throw audioError;
        audioPath = audioData.path;
      }
      
      // Save to database
      const { error } = await supabase
        .from('grounding_responses')
        .insert({
          user_id: user.id,
          activity_id: 'grounding-technique',
          section_name: 'see',
          response_text: inputMethod === 'type' ? textInput : null,
          response_drawing_path: drawingPath,
          response_audio_path: audioPath,
          response_selected_items: inputMethod === 'select' ? selectedItems : null
        });
        
      if (error) throw error;
      
      toast.success("Response saved successfully!");
      onComplete();
    } catch (error) {
      console.error("Error saving response:", error);
      toast.error("Failed to save your response. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  
  const isValid = () => {
    switch (inputMethod) {
      case 'type':
        return textInput.trim().length > 0;
      case 'draw':
        return drawingBlob !== null;
      case 'speak':
        return audioBlob !== null;
      case 'select':
        return selectedItems.length > 0;
      default:
        return false;
    }
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
          <span>20% Complete</span>
        </div>
        <Progress value={20} className="h-2" />
      </div>
      
      {/* Section Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="p-3 bg-[#F5DF4D]/20 rounded-full">
          <Eye className="h-8 w-8 text-[#F5DF4D]" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#F5DF4D] to-[#3DFDFF] bg-clip-text text-transparent mb-4">
        5 Things You Can See
      </h2>
      
      <div className="bg-[#F5DF4D]/10 p-4 rounded-lg mb-6">
        <p className="text-center text-gray-700">
          Look around you. What's something you notice that you usually overlook?
          <br/>
          <span className="font-medium">List 5 things you can see right now.</span>
        </p>
      </div>
      
      {/* Input Method Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button 
          variant={inputMethod === 'type' ? 'default' : 'outline'} 
          onClick={() => setInputMethod('type')}
          className={inputMethod === 'type' ? 'bg-[#3DFDFF] hover:bg-[#3DFDFF]/90' : ''}
        >
          <Type className="h-4 w-4 mr-2" />
          Type
        </Button>
        
        <Button 
          variant={inputMethod === 'draw' ? 'default' : 'outline'} 
          onClick={() => setInputMethod('draw')}
          className={inputMethod === 'draw' ? 'bg-[#FC68B3] hover:bg-[#FC68B3]/90' : ''}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Draw
        </Button>
        
        <Button 
          variant={inputMethod === 'speak' ? 'default' : 'outline'} 
          onClick={() => setInputMethod('speak')}
          className={inputMethod === 'speak' ? 'bg-[#2AC20E] hover:bg-[#2AC20E]/90' : ''}
        >
          <Mic className="h-4 w-4 mr-2" />
          Speak
        </Button>
        
        <Button 
          variant={inputMethod === 'select' ? 'default' : 'outline'} 
          onClick={() => setInputMethod('select')}
          className={inputMethod === 'select' ? 'bg-[#FF8A48] hover:bg-[#FF8A48]/90' : ''}
        >
          <Hand className="h-4 w-4 mr-2" />
          Select
        </Button>
      </div>
      
      {/* Input Area */}
      <div className="min-h-[300px] mb-6">
        <AnimatePresence mode="wait">
          {inputMethod === 'type' && (
            <motion.div 
              key="type-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label htmlFor="see-input">What do you see around you?</Label>
              <Textarea 
                id="see-input"
                placeholder="Enter what you see..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="h-[200px] mt-2 focus:border-[#F5DF4D] focus:ring-[#F5DF4D]"
              />
            </motion.div>
          )}
          
          {inputMethod === 'draw' && (
            <motion.div 
              key="draw-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DrawingJournal 
                onDrawingChange={handleDrawingChange}
                onTitleChange={setDrawingTitle}
                title={drawingTitle}
              />
            </motion.div>
          )}
          
          {inputMethod === 'speak' && (
            <motion.div 
              key="speak-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AudioJournal
                onAudioChange={handleAudioChange}
                onTitleChange={setAudioTitle}
                title={audioTitle}
              />
            </motion.div>
          )}
          
          {inputMethod === 'select' && (
            <motion.div 
              key="select-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <ObjectDragDrop 
                objects={commonObjects}
                selectedItems={selectedItems}
                onItemsChange={setSelectedItems}
                maxItems={5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={onComplete}
          >
            Skip
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={!isValid() || saving}
            className="bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D] hover:opacity-90 text-black font-medium"
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

export default SeeSection;
