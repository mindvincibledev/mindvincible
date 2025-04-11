
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Play, RotateCcw, Check, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Affirmation from '@/components/Affirmation';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import BoxBreathingAnimation from '@/components/breathing/BoxBreathingAnimation';

// Celebration dialog component
const CelebrationDialog = ({ 
  isOpen, 
  onClose, 
  activityName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  activityName: string 
}) => {
  const emojis = ["✨", "🎉", "🌟", "💫", "🙌", "🎊", "💯", "🏆", "🥇", "👏"];
  const affirmations = [
    `Amazing job completing ${activityName}!`,
    `Your mind thanks you for taking this break!`,
    `Well done on prioritizing your mental well-being!`,
    `Congratulations on completing ${activityName}!`,
    `You've just given your brain a wonderful gift!`,
    `Taking time for self-care is a sign of strength!`,
    `That's how you recharge your mental batteries!`,
    `Fantastic work creating space for your mind to breathe!`
  ];
  
  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
            {activityName} Complete!
          </DialogTitle>
        </DialogHeader>
        <div className="relative py-10">
          {/* Background emoji animations */}
          <div className="absolute inset-0 overflow-hidden">
            {emojis.map((emoji, index) => (
              <motion.div
                key={index}
                className="absolute text-2xl md:text-3xl"
                initial={{ 
                  y: 150, 
                  x: Math.random() * 300 - 150,
                  opacity: 0 
                }}
                animate={{ 
                  y: -100, 
                  opacity: [0, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3
                }}
                style={{
                  left: `${10 + (index * 8)}%`
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
          
          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div
              className="mb-6 p-4 rounded-full bg-gradient-to-r from-[#3DFDFF] to-[#FC68B3] shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Check className="h-12 w-12 text-white" />
            </motion.div>
            
            <motion.p 
              className="text-center text-lg font-medium mb-6 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {randomAffirmation}
            </motion.p>

            <div className="w-full max-w-sm mb-6">
              <Affirmation />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
                onClick={onClose}
              >
                <Heart className="mr-2 h-4 w-4" />
                Continue My Journey
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Feedback dialog component
const FeedbackDialog = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (feedback: string) => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
            How was your experience?
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-10 px-4">
          <Button 
            onClick={() => onSubmit('positive')} 
            variant="outline" 
            className="flex flex-col items-center p-4 hover:bg-green-50 hover:border-green-200 transition-colors h-auto"
          >
            <div className="text-3xl mb-2">👍</div>
            <span>Helpful</span>
          </Button>
          
          <Button 
            onClick={() => onSubmit('neutral')} 
            variant="outline" 
            className="flex flex-col items-center p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors h-auto"
          >
            <div className="text-3xl mb-2">😐</div>
            <span>Neutral</span>
          </Button>
          
          <Button 
            onClick={() => onSubmit('negative')} 
            variant="outline" 
            className="flex flex-col items-center p-4 hover:bg-red-50 hover:border-red-200 transition-colors h-auto"
          >
            <div className="text-3xl mb-2">👎</div>
            <span>Not helpful</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BoxBreathingActivity = () => {
  const { user } = useAuth();
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  
  const activityName = "Box Breathing";
  const activityId = "box-breathing";
  const activityColor = "from-[#3DFDFF] to-[#2AC20E]";
  
  // Start the breathing exercise
  const startBreathing = () => {
    setIsBreathingActive(true);
    toast.success("Breathing exercise started. Follow the animation and breathe along.");
  };

  // Reset the breathing exercise
  const resetBreathing = () => {
    setIsBreathingActive(false);
    setCycleCount(0);
    toast.info("Breathing exercise reset.");
  };
  
  // Handle breathing exercise completion
  const handleBreathingComplete = () => {
    setIsBreathingActive(false);
    setActivityCompleted(true);
    setShowCelebration(true);
  };

  // Record activity completion in the database
  const recordActivityCompletion = async (feedback?: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_name: activityName,
          activity_id: activityId,
          feedback: feedback
        });
      
      if (error) {
        console.error('Error recording activity completion:', error);
        toast.error('Failed to record your activity completion');
        return;
      }
      
      toast.success('Activity completion recorded!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Handle feedback submission
  const handleFeedback = (feedback: string) => {
    recordActivityCompletion(feedback);
    setShowFeedback(false);
    toast.success('Thanks for your feedback!');
  };

  // Handle closing the celebration dialog
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    setShowFeedback(true); // Show feedback dialog after celebration
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-lg shadow-xl">
              <div className="text-center mb-8">
                <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${activityColor} bg-clip-text text-transparent mb-4`}>
                  Box Breathing
                </h1>
                
                <p className="text-lg text-gray-700 mb-6">
                  Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold again for 4 seconds. 
                  This rhythmic breathing pattern can calm your nervous system.
                </p>
                
                <p className="text-xl font-medium text-gray-800">
                  Follow the animation below and breathe along with it.
                </p>
              </div>
              
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#0f1729]/80 to-[#111827]/80 backdrop-blur mb-8">
                <BoxBreathingAnimation 
                  isActive={isBreathingActive}
                  onComplete={handleBreathingComplete}
                />
              </div>
              
              {isBreathingActive ? (
                <div className="flex justify-center">
                  <Button 
                    className="bg-gradient-to-r from-[#F5DF4D] to-[#FF8A48] text-black font-medium px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300"
                    onClick={resetBreathing}
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reset Exercise
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-black font-medium text-lg px-10 py-6 rounded-full hover:opacity-90 transition-all duration-300"
                      onClick={startBreathing}
                    >
                      <Play className="mr-3 h-6 w-6" />
                      Begin Breathing
                    </Button>
                  </motion.div>
                  
                  <p className="text-gray-500 mt-6 text-sm">
                    <Clock className="inline-block mr-1 h-4 w-4" />
                    Complete 3 cycles (about 48 seconds)
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
        
        {/* Celebration dialog */}
        <CelebrationDialog 
          isOpen={showCelebration} 
          onClose={handleCelebrationClose}
          activityName={activityName}
        />
        
        {/* Feedback dialog */}
        <FeedbackDialog 
          isOpen={showFeedback} 
          onClose={() => setShowFeedback(false)} 
          onSubmit={handleFeedback}
        />
      </div>
    </BackgroundWithEmojis>
  );
};

export default BoxBreathingActivity;
