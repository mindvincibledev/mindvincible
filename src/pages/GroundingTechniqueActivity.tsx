import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // We already have uuid installed
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AnimatedWelcome from '@/components/grounding/AnimatedWelcome';
import SeeSection from '@/components/grounding/SeeSection';
import TouchSection from '@/components/grounding/TouchSection';
import HearSection from '@/components/grounding/HearSection';
import SmellSection from '@/components/grounding/SmellSection';
import TasteSection from '@/components/grounding/TasteSection';
import CompletionAnimation from '@/components/grounding/CompletionAnimation';
import PastGroundingEntries from '@/components/grounding/PastGroundingEntries';
import VisibilityToggle from '@/components/ui/VisibilityToggle';
enum GroundingStep {
  Welcome,
  See,
  Touch,
  Hear,
  Smell,
  Taste,
  Complete
}

const GroundingTechniqueActivity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<GroundingStep>(GroundingStep.Welcome);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activityId] = useState(() => uuidv4()); // Generate activity ID once when component mounts
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Changed default to false
  
  const handleBegin = () => {
    setCurrentStep(GroundingStep.See);
  };
  
  const handleContinue = () => {
    setCurrentStep(prevStep => {
      const nextStep = prevStep + 1;
      return nextStep;
    });
  };
  
  const handleBack = () => {
    setCurrentStep(prevStep => {
      const nextStep = prevStep - 1;
      return nextStep < GroundingStep.Welcome ? GroundingStep.Welcome : nextStep;
    });
  };

  // Handle feedback submission
  const handleFeedback = async (feedback: string) => {
    if (!user?.id) {
      toast.error("You need to be logged in to complete this activity");
      return;
    }
    
    try {
      // Record activity completion in the database
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_id: 'grounding-technique',
          activity_name: '5-4-3-2-1: The Grounding Quest',
          feedback: feedback
        });
      
      if (error) {
        console.error("Error completing activity:", error);
        toast.error("Failed to record activity completion");
        return;
      }
      
      toast.success("Activity completed successfully!");
      setShowFeedback(false);

      const { error: updateError } = await supabase
            .from('grounding_responses')
            .update({ visibility: isVisible })
            .eq('activity_id', activityId)
            .eq('user_id', user.id);
      
      // Navigate to resources hub after completion
      navigate('/emotional-hacking');
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    }
  };
  
  const handleActivityComplete = () => {
    setActivityCompleted(true);
    setShowFeedback(true);
  };

  // Handle closing the celebration dialog
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    setShowFeedback(true); // Show feedback dialog after celebration
  };
  
  const renderContent = () => {
    switch (currentStep) {
      case GroundingStep.Welcome:
        return <AnimatedWelcome onBegin={handleBegin} />;
      case GroundingStep.See:
        return <SeeSection onComplete={handleContinue} onBack={handleBack} activityId={activityId} />;
      case GroundingStep.Touch:
        return <TouchSection onComplete={handleContinue} onBack={handleBack} activityId={activityId} />;
      case GroundingStep.Hear:
        return <HearSection onComplete={handleContinue} onBack={handleBack} activityId={activityId} />;
      case GroundingStep.Smell:
        return <SmellSection onComplete={handleContinue} onBack={handleBack} activityId={activityId} />;
      case GroundingStep.Taste:
        return <TasteSection onComplete={handleContinue} onBack={handleBack} activityId={activityId} />;
      case GroundingStep.Complete:
        return (
          <motion.div 
            className="p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CompletionAnimation />
            
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5, duration: 1 }}
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#3DFDFF] to-[#FC68B3] bg-clip-text text-transparent">
                M(in)dvincible Grounding Complete!
              </h2>
              
              <div className="space-x-4 mt-6">
                <Link to="/emotional-hacking">
                  <Button variant="outline">
                    Return to Activities
                  </Button>
                </Link>
                
                <Button 
                  className="bg-gradient-to-r from-[#3DFDFF] to-[#FC68B3] hover:opacity-90"
                  onClick={handleActivityComplete}
                >
                  Complete Activity
                </Button>
              </div>
            </motion.div>
          </motion.div>
        );
      default:
        return <div>Coming soon...</div>;
    }
  };
  
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <Link to="/emotional-hacking" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Emotional Hacking
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="journey" className="w-full">
              <TabsList className="w-full grid grid-cols-2 gap-2 p-1.5 mb-8">
                <TabsTrigger value="journey" className="text-lg">
                  New Quest
                </TabsTrigger>
                <TabsTrigger value="past" className="text-lg">
                  Past Quests
                </TabsTrigger>
              </TabsList>

              <TabsContent value="journey" className="space-y-6">
                {/* Progress indicator */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
                      The Grounding Quest
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

                {renderContent()}
              </TabsContent>

              <TabsContent value="past">
                <PastGroundingEntries />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Celebration dialog */}
        <Dialog open={showCelebration} onOpenChange={handleCelebrationClose}>
          <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
            <div className="relative py-10">
              {/* Add celebration content similar to BoxBreathingActivity */}
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

export default GroundingTechniqueActivity;
