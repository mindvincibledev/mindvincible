
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { WavyBackground } from '@/components/ui/wavy-background';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import AnimatedWelcome from '@/components/grounding/AnimatedWelcome';
import SeeSection from '@/components/grounding/SeeSection';
import TouchSection from '@/components/grounding/TouchSection';
import HearSection from '@/components/grounding/HearSection';
import SmellSection from '@/components/grounding/SmellSection';
import TasteSection from '@/components/grounding/TasteSection';
import CompletionAnimation from '@/components/grounding/CompletionAnimation';

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
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<GroundingStep>(GroundingStep.Welcome);
  
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
  
  const handleCompleteActivity = async () => {
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
          feedback: 'completed'
        });
      
      if (error) throw error;
      
      toast.success("Activity completed successfully!");
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    }
  };
  
  const renderContent = () => {
    switch (currentStep) {
      case GroundingStep.Welcome:
        return <AnimatedWelcome onBegin={handleBegin} />;
      case GroundingStep.See:
        return <SeeSection onComplete={handleContinue} onBack={handleBack} />;
      case GroundingStep.Touch:
        return <TouchSection onComplete={handleContinue} onBack={handleBack} />;
      case GroundingStep.Hear:
        return <HearSection onComplete={handleContinue} onBack={handleBack} />;
      case GroundingStep.Smell:
        return <SmellSection onComplete={handleContinue} onBack={handleBack} />;
      case GroundingStep.Taste:
        return <TasteSection onComplete={handleContinue} onBack={handleBack} />;
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
                  onClick={handleCompleteActivity}
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
            Back to All Activities
          </Link>
          
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default GroundingTechniqueActivity;
