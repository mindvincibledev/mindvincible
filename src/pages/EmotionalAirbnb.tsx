
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VisibilityToggle from '@/components/ui/VisibilityToggle';
import { generateEmotionalAirbnbFilename } from '@/utils/emotionalAirbnbFileUtils';

// Import section components
import IntroSection from '@/components/emotional-airbnb/IntroSection';
import EmotionSection from '@/components/emotional-airbnb/EmotionSection';
import LocationSection from '@/components/emotional-airbnb/LocationSection';
import AppearanceSection from '@/components/emotional-airbnb/AppearanceSection';
import IntensitySection from '@/components/emotional-airbnb/IntensitySection';
import SoundSection from '@/components/emotional-airbnb/SoundSection';
import MessageSection from '@/components/emotional-airbnb/MessageSection';
import PastEntries from '@/components/emotional-airbnb/PastEntries';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import Navbar from '@/components/Navbar';

const EmotionalAirbnb: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('intro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Form data state
  const [formData, setFormData] = useState({
    emotionText: '',
    locationText: '',
    appearanceText: '',
    intensityText: '',
    soundText: '',
    messageText: '',
    emotionDrawing: null as Blob | null,
    locationDrawing: null as Blob | null,
    appearanceDrawing: null as Blob | null,
    intensityDrawing: null as Blob | null,
    soundDrawing: null as Blob | null,
    messageDrawing: null as Blob | null,
  });
  
  // Update handlers for form data
  const handleTextChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleDrawingChange = (field: keyof typeof formData, blob: Blob | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: blob
    }));
  };
  
  // Update handleSubmit to include correct user_id and ensure proper folder structure
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to save your emotional airbnb.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload drawings if they exist
      let emotionDrawingPath = null;
      let locationDrawingPath = null;
      let appearanceDrawingPath = null;
      let intensityDrawingPath = null;
      let soundDrawingPath = null;
      let messageDrawingPath = null;

      // Helper function for uploading drawings with proper folder structure
      const uploadDrawing = async (blob: Blob | null, section: string) => {
        if (!blob || !user) return null;
        
        // Create a structured filename with userId, section type, and timestamp
        const fileName = `${user.id}/${section}_${Date.now()}.png`;
        console.log(`Uploading file to path: ${fileName}`);
        
        const { data, error: uploadError } = await supabase.storage
          .from('emotional_airbnb_drawings')
          .upload(fileName, blob, {
            contentType: 'image/png',
            upsert: true
          });
        
        if (uploadError) {
          console.error(`Error uploading ${section} drawing:`, uploadError);
          throw new Error(`Failed to upload ${section} drawing: ${uploadError.message}`);
        }
        
        // Return just the path for storage in the database
        return fileName;
      };

      // Upload each drawing if it exists - making sure to use the correct folder structure
      if (formData.emotionDrawing) {
        emotionDrawingPath = await uploadDrawing(formData.emotionDrawing, 'emotion');
      }
      
      if (formData.locationDrawing) {
        locationDrawingPath = await uploadDrawing(formData.locationDrawing, 'location');
      }
      
      if (formData.appearanceDrawing) {
        appearanceDrawingPath = await uploadDrawing(formData.appearanceDrawing, 'appearance');
      }
      
      if (formData.intensityDrawing) {
        intensityDrawingPath = await uploadDrawing(formData.intensityDrawing, 'intensity');
      }
      
      if (formData.soundDrawing) {
        soundDrawingPath = await uploadDrawing(formData.soundDrawing, 'sound');
      }
      
      if (formData.messageDrawing) {
        messageDrawingPath = await uploadDrawing(formData.messageDrawing, 'message');
      }
      
      // Insert data into the database
      const { error } = await supabase
        .from('emotional_airbnb')
        .insert({
          user_id: user.id,
          emotion_text: formData.emotionText || null,
          location_in_body_text: formData.locationText || null,
          appearance_description_text: formData.appearanceText || null,
          intensity_description_text: formData.intensityText || null,
          sound_text: formData.soundText || null,
          message_description_text: formData.messageText || null,
          emotion_drawing_path: emotionDrawingPath,
          location_in_body_drawing_path: locationDrawingPath,
          appearance_drawing_path: appearanceDrawingPath,
          intensity_drawing_path: intensityDrawingPath,
          sound_drawing_path: soundDrawingPath,
          message_drawing_path: messageDrawingPath,
          visibility: isVisible
        });

      if (error) {
        throw error;
      }

      // Show a success message
      toast({
        title: "Saved successfully!",
        description: "Your emotional airbnb entry has been saved.",
      });

      // Reset form data after successful submission
      setFormData({
        emotionText: '',
        locationText: '',
        appearanceText: '',
        intensityText: '',
        soundText: '',
        messageText: '',
        emotionDrawing: null,
        locationDrawing: null,
        appearanceDrawing: null,
        intensityDrawing: null,
        soundDrawing: null,
        messageDrawing: null,
      });
      
      // Navigate to past entries view
      setActiveTab('past');
      
    } catch (error: any) {
      console.error('Error saving emotional airbnb:', error);
      toast({
        title: "Error saving",
        description: error.message || "There was a problem saving your emotional airbnb entry.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <BackgroundWithEmojis 
        emojis={['😊', '😢', '😡', '😨', '🤔', '😌', '🙂', '😔']} 
        count={30} 
        waveFrequency={0.5}
      />
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#3DFDFF] bg-clip-text text-transparent">
            Emotional Airbnb
          </h1>
          <p className="mt-2 text-gray-600">
            Give your feelings a place to stay
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8 bg-white/50 backdrop-blur-md">
            <TabsTrigger value="create" className="data-[state=active]:bg-[#FC68B3]/20">Create New</TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-[#3DFDFF]/20">Past Entries</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-8">
            <Tabs defaultValue="intro" className="w-full">
              <TabsList className="flex overflow-x-auto pb-2 mb-6 bg-transparent justify-start">
                <TabsTrigger value="intro" className="rounded-full data-[state=active]:bg-[#FC68B3]/20 px-4">Intro</TabsTrigger>
                <TabsTrigger value="emotion" className="rounded-full data-[state=active]:bg-[#FC68B3]/20 px-4">Emotion</TabsTrigger>
                <TabsTrigger value="location" className="rounded-full data-[state=active]:bg-[#FF8A48]/20 px-4">Location</TabsTrigger>
                <TabsTrigger value="appearance" className="rounded-full data-[state=active]:bg-[#3DFDFF]/20 px-4">Appearance</TabsTrigger>
                <TabsTrigger value="intensity" className="rounded-full data-[state=active]:bg-[#F5DF4D]/20 px-4">Intensity</TabsTrigger>
                <TabsTrigger value="sound" className="rounded-full data-[state=active]:bg-[#D5D5F1]/20 px-4">Sound</TabsTrigger>
                <TabsTrigger value="message" className="rounded-full data-[state=active]:bg-[#2AC20E]/20 px-4">Message</TabsTrigger>
              </TabsList>

              <Card className="p-6 bg-white/90 backdrop-blur-md border-none shadow-lg">
                <TabsContent value="intro">
                  <IntroSection />
                </TabsContent>
                
                <TabsContent value="emotion">
                  <EmotionSection 
                    textValue={formData.emotionText}
                    drawingBlob={formData.emotionDrawing}
                    onSaveText={(text) => handleTextChange('emotionText', text)}
                    onSaveDrawing={(blob) => handleDrawingChange('emotionDrawing', blob)}
                  />
                </TabsContent>
                
                <TabsContent value="location">
                  <LocationSection 
                    textValue={formData.locationText}
                    drawingBlob={formData.locationDrawing}
                    onSaveText={(text) => handleTextChange('locationText', text)}
                    onSaveDrawing={(blob) => handleDrawingChange('locationDrawing', blob)}
                  />
                </TabsContent>
                
                <TabsContent value="appearance">
                  <AppearanceSection 
                    textValue={formData.appearanceText}
                    drawingBlob={formData.appearanceDrawing}
                    onSaveText={(text) => handleTextChange('appearanceText', text)}
                    onSaveDrawing={(blob) => handleDrawingChange('appearanceDrawing', blob)}
                  />
                </TabsContent>
                
                <TabsContent value="intensity">
                  <IntensitySection 
                    textValue={formData.intensityText}
                    drawingBlob={formData.intensityDrawing}
                    onSaveText={(text) => handleTextChange('intensityText', text)}
                    onSaveDrawing={(blob) => handleDrawingChange('intensityDrawing', blob)}
                  />
                </TabsContent>
                
                <TabsContent value="sound">
                  <SoundSection 
                    textValue={formData.soundText}
                    drawingBlob={formData.soundDrawing}
                    onSaveText={(text) => handleTextChange('soundText', text)}
                    onSaveDrawing={(blob) => handleDrawingChange('soundDrawing', blob)}
                  />
                </TabsContent>
                
                <TabsContent value="message">
                  <MessageSection 
                    textValue={formData.messageText}
                    drawingBlob={formData.messageDrawing}
                    onSaveText={(text) => handleTextChange('messageText', text)}
                    onSaveDrawing={(blob) => handleDrawingChange('messageDrawing', blob)}
                  />
                </TabsContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row justify-between mt-8">
                <div className="mb-4 sm:mb-0">
                  <VisibilityToggle 
                    isVisible={isVisible}
                    onToggle={setIsVisible}
                  />
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#FC68B3] to-[#3DFDFF] text-white hover:opacity-90"
                >
                  {isSubmitting ? 'Saving...' : 'Save My Emotional Airbnb'}
                </Button>
              </div>
            </Tabs>
          </TabsContent>

          <TabsContent value="past">
            <PastEntries />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmotionalAirbnb;
