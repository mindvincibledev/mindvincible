
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
      // If smell section is complete, move to completion screen or next section when available
      return nextStep > GroundingStep.Smell ? GroundingStep.Complete : nextStep;
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
      case GroundingStep.Complete:
        return (
          <motion.div 
            className="p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#3DFDFF] to-[#FC68B3] rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#3DFDFF] to-[#FC68B3] bg-clip-text text-transparent">
              M(in)dvincible Grounding Complete!
            </h2>
            
            <p className="mb-8 text-gray-700">
              Amazing job completing four sections of the grounding exercise! 
              The last section (Taste) will be coming soon.
            </p>
            
            <div className="space-x-4">
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
