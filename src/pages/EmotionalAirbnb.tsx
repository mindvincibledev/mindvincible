
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowLeftIcon, Clock, Play, RotateCcw, Moon, Sun, Smartphone, Coffee, Check, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import IntroSection from '@/components/emotional-airbnb/IntroSection';
import EmotionSection from '@/components/emotional-airbnb/EmotionSection';
import LocationSection from '@/components/emotional-airbnb/LocationSection';
import AppearanceSection from '@/components/emotional-airbnb/AppearanceSection';
import IntensitySection from '@/components/emotional-airbnb/IntensitySection';
import SoundSection from '@/components/emotional-airbnb/SoundSection';
import MessageSection from '@/components/emotional-airbnb/MessageSection';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { WavyBackground } from '@/components/ui/wavy-background';
import { ChevronLeft, ChevronRight, Save, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';
import CompletionAnimation from '@/components/grounding/CompletionAnimation';

import { useParams, Link, Navigate } from 'react-router-dom';
import { generateEmotionalAirbnbFilename } from '@/utils/emotionalAirbnbFileUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PastEntries from '@/components/emotional-airbnb/PastEntries';
import VisibilityToggle from '@/components/ui/VisibilityToggle';

const EmotionalAirbnb = () => {
  const { user, loading } = useAuth(); // Add loading state
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Changed default to false
  
  // State for storing emotional airbnb data
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
    visibility: false // Changed default to false to match isVisible state
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // If still loading auth context, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Save data from the current step
  const handleSaveStep = (type: string, value: string | Blob | null) => {
    setFormData(prev => {
      switch (currentStep) {
        case 1: // Emotion step
          return type === 'text' 
            ? { ...prev, emotionText: value as string }
            : { ...prev, emotionDrawing: value as Blob };
        case 2: // Location in body step
          return type === 'text'
            ? { ...prev, locationText: value as string }
            : { ...prev, locationDrawing: value as Blob };
        case 3: // Appearance step
          return type === 'text'
            ? { ...prev, appearanceText: value as string }
            : { ...prev, appearanceDrawing: value as Blob };
        case 4: // Intensity step
          return type === 'text'
            ? { ...prev, intensityText: value as string }
            : { ...prev, intensityDrawing: value as Blob };
        case 5: // Sound step
          return type === 'text'
            ? { ...prev, soundText: value as string }
            : { ...prev, soundDrawing: value as Blob };
        case 6: // Message step
          return type === 'text'
            ? { ...prev, messageText: value as string }
            : { ...prev, messageDrawing: value as Blob };
        default:
          return prev;
      }
    });
  };

  // Handle going to the next step
  const handleNext = () => {
    // Don't allow proceeding if no input on the current step
    if (currentStep >= 1) {
      const hasTextInput = (() => {
        switch (currentStep) {
          case 1: return !!formData.emotionText;
          case 2: return !!formData.locationText;
          case 3: return !!formData.appearanceText;
          case 4: return !!formData.intensityText;
          case 5: return !!formData.soundText;
          case 6: return !!formData.messageText;
          default: return true;
        }
      })();

      const hasDrawingInput = (() => {
        switch (currentStep) {
          case 1: return !!formData.emotionDrawing;
          case 2: return !!formData.locationDrawing;
          case 3: return !!formData.appearanceDrawing;
          case 4: return !!formData.intensityDrawing;
          case 5: return !!formData.soundDrawing;
          case 6: return !!formData.messageDrawing;
          default: return true;
        }
      })();

      if (!hasTextInput && !hasDrawingInput) {
        toast.error("Missing input", {
          description: "Please provide either text or a drawing before proceeding.",
        });
        return;
      }
    }

    setCurrentStep(prev => prev < 7 ? prev + 1 : prev);
  };

  // Handle going to the previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev > 0 ? prev - 1 : prev);
  };

  // Handle feedback submission
  const handleFeedback = async (feedback: string) => {
    if (!user?.id) {
      toast.error("You need to be logged in to complete this activity");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Record activity completion in the database
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_id: 'emotional-airbnb',
          activity_name: 'Emotional Airbnb',
          feedback: feedback
        });
      
      if (error) {
        console.error("Error completing activity:", error);
        toast.error("Failed to record activity completion");
        return;
      }
      
      toast.success("Activity completed successfully!");
      setShowFeedback(false);
      console.log("after feedback", isVisible);
      handleSubmit();
      // Navigate to resources hub after completion
      navigate('/resources');
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle closing the celebration dialog
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    setShowFeedback(true); // Show feedback dialog after celebration
  };

  // Update handleSubmit to include correct user_id and ensure proper folder structure
  const handleSubmit = async () => {
    if (!user) {
      toast.error("Not logged in", {
        description: "You must be logged in to save your emotional airbnb.",
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
        
        // Ensure we have the correct folder structure that matches our RLS policy
        const fileName = generateEmotionalAirbnbFilename(user.id, section);
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
      
      console.log(isVisible)
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

      // Show celebration instead of navigating immediately
      
    } catch (error: any) {
      console.error('Error saving emotional airbnb:', error);
      toast.error("Error saving", {
        description: error.message || "There was a problem saving your emotional airbnb entry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save to local storage when formData changes
  useEffect(() => {
    // Only save text data to local storage
    const dataToStore = {
      emotionText: formData.emotionText,
      locationText: formData.locationText,
      appearanceText: formData.appearanceText,
      intensityText: formData.intensityText,
      soundText: formData.soundText,
      messageText: formData.messageText,
      currentStep
    };
    
    localStorage.setItem('emotional_airbnb_cache', JSON.stringify(dataToStore));
  }, [formData, currentStep]);

  // Load from local storage on initial render
  useEffect(() => {
    const cachedData = localStorage.getItem('emotional_airbnb_cache');
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setFormData(prev => ({
          ...prev,
          emotionText: parsed.emotionText || '',
          locationText: parsed.locationText || '',
          appearanceText: parsed.appearanceText || '',
          intensityText: parsed.intensityText || '',
          soundText: parsed.soundText || '',
          messageText: parsed.messageText || ''
        }));
        
        // Optionally restore the step
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep);
        }
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    }
  }, []);

  // Clear cache when completing or abandoning the flow
  const clearCache = () => {
    localStorage.removeItem('emotional_airbnb_cache');
  };

  // Handle leaving the page
  const handleExit = () => {
    clearCache();
    navigate('/home');
  };

  // Determine the current section based on step
  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return <IntroSection />;
      case 1:
        return (
          <EmotionSection 
            textValue={formData.emotionText}
            drawingBlob={formData.emotionDrawing}
            onSaveText={(text) => handleSaveStep('text', text)}
            onSaveDrawing={(blob) => handleSaveStep('drawing', blob)}
          />
        );
      case 2:
        return (
          <LocationSection 
            textValue={formData.locationText}
            drawingBlob={formData.locationDrawing}
            onSaveText={(text) => handleSaveStep('text', text)}
            onSaveDrawing={(blob) => handleSaveStep('drawing', blob)}
          />
        );
      case 3:
        return (
          <AppearanceSection 
            textValue={formData.appearanceText}
            drawingBlob={formData.appearanceDrawing}
            onSaveText={(text) => handleSaveStep('text', text)}
            onSaveDrawing={(blob) => handleSaveStep('drawing', blob)}
          />
        );
      case 4:
        return (
          <IntensitySection 
            textValue={formData.intensityText}
            drawingBlob={formData.intensityDrawing}
            onSaveText={(text) => handleSaveStep('text', text)}
            onSaveDrawing={(blob) => handleSaveStep('drawing', blob)}
          />
        );
      case 5:
        return (
          <SoundSection 
            textValue={formData.soundText}
            drawingBlob={formData.soundDrawing}
            onSaveText={(text) => handleSaveStep('text', text)}
            onSaveDrawing={(blob) => handleSaveStep('drawing', blob)}
          />
        );
      case 6:
        return (
          <MessageSection 
            textValue={formData.messageText}
            drawingBlob={formData.messageDrawing}
            onSaveText={(text) => handleSaveStep('text', text)}
            onSaveDrawing={(blob) => handleSaveStep('drawing', blob)}
          />
        );
      case 7:
        return (
          <div className="text-center p-6">
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              All Done!
            </motion.h2>
            
            <motion.div 
              className="bubble-container mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="bubble p-6 rounded-3xl bg-gradient-to-br from-[#FF8A48]/20 to-[#FC68B3]/20 border-2 border-[#FC68B3]/30 shadow-lg relative overflow-hidden">
                <div className="bubble-dots absolute top-2 right-2">
                  <motion.span 
                    className="inline-block h-2 w-2 rounded-full bg-[#FC68B3] mr-1"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                  ></motion.span>
                  <motion.span 
                    className="inline-block h-2 w-2 rounded-full bg-[#FF8A48] mr-1"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                  ></motion.span>
                  <motion.span 
                    className="inline-block h-2 w-2 rounded-full bg-[#3DFDFF]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
                  ></motion.span>
                </div>
                <motion.p 
                  className="text-lg font-medium text-gray-700 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  You're all done! We are so proud of you for expressing your emotions! 
                  <motion.span 
                    className="block mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Understanding your feelings are really the first step, and you did it!
                  </motion.span>
                  <motion.span 
                    className="block mt-2 font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Wohoo! <span className="animate-bounce inline-block">🎉</span> <span className="animate-pulse inline-block">✨</span> <span className="animate-float inline-block">🌟</span>
                  </motion.span>
                </motion.p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            >
              <Button
                onClick={() => {setShowFeedback(true);}}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] text-white hover:shadow-lg transition-all"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Responses'}
              </Button>
              <Button
                onClick={handleExit}
                variant="outline"
                className="hover:shadow-md transition-all"
              >
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </motion.div>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Link to="/resources" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Resources Hub
          </Link>

          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="journey" className="w-full">
              <TabsList className="w-full grid grid-cols-2 gap-2 p-1.5 mb-8">
                <TabsTrigger value="journey" className="text-lg">
                  New Journey
                </TabsTrigger>
                <TabsTrigger value="past" className="text-lg">
                  Past Entries
                </TabsTrigger>
              </TabsList>

              <TabsContent value="journey" className="space-y-6">
                {/* Progress indicator */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
                      M(in)dvincible
                    </h1>
                    <span className="text-sm text-gray-500">
                      Step {currentStep}/7
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Main content card with wavy background */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative mb-6 overflow-hidden"
                >
                  <Card className="p-6 relative overflow-hidden bg-white/95 backdrop-blur-sm border border-[#D5D5F1]/50 shadow-lg">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <WavyBackground 
                        colors={['#FF8A4820', '#D5D5F120', '#3DFDFF20', '#F5DF4D20', '#FC68B320']}
                        blur={5}
                        speed="fast"
                        backgroundFill="#FFFFFF"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="relative z-10">
                      {renderCurrentSection()}
                    </div>
                  </Card>
                </motion.div>

                {/* Navigation buttons */}
                <div className="flex justify-between">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep < 7 ? (
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] gap-2"
                    >
                      {currentStep === 0 ? 'Start' : 'Next'}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </TabsContent>

              <TabsContent value="past">
                <PastEntries />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Celebration dialog */}
        <Dialog open={showCelebration} onOpenChange={handleCelebrationClose}>
          <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
            <div className="relative py-10">
              <CompletionAnimation />
              <Button 
                className="mt-6 bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
                onClick={handleCelebrationClose}
              >
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Feedback dialog */}
        <Dialog open={showFeedback} onOpenChange={() => setShowFeedback(false)}>
          <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
                How was your experience?
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 py-6 px-4">
                <Button 
                  onClick={() => handleFeedback('positive')} 
                  variant="outline" 
                  className="flex flex-col items-center p-4 hover:bg-emerald-100 hover:border-emerald-200 transition-colors h-auto"
                  disabled={isSubmitting}
                >
                  <div className="text-3xl mb-2">👍</div>
                  <span>Helpful</span>
                </Button>
                
                <Button 
                  onClick={() => handleFeedback('neutral')} 
                  variant="outline" 
                  className="flex flex-col items-center p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors h-auto"
                  disabled={isSubmitting}
                >
                  <div className="text-3xl mb-2">😐</div>
                  <span>Neutral</span>
                </Button>
                
                <Button 
                  onClick={() => handleFeedback('negative')} 
                  variant="outline" 
                  className="flex flex-col items-center p-4 hover:bg-red-50 hover:border-red-200 transition-colors h-auto"
                  disabled={isSubmitting}
                >
                  <div className="text-3xl mb-2">👎</div>
                  <span>Not helpful</span>
                </Button>
              </div>

              <div className="px-4">
                <VisibilityToggle
                  isVisible={isVisible}
                  onToggle={setIsVisible}
                  
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BackgroundWithEmojis>
  );
};

export default EmotionalAirbnb;
