
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Play, RotateCcw, Moon, Sun, Smartphone, Coffee, Check, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Affirmation from '@/components/Affirmation';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import BoxBreathingActivity from './BoxBreathingActivity';

// Added activity content details for each activity
const activities = {
  "digital-detox": {
    title: "Digital Detox",
    description: "Give yourself a mental break by unplugging from all electronic devices. Taking a 'vacation' from screens can help you reset and refocus. Use this time to connect with yourself or the physical world around you.",
    detailedDescription: "A digital detox is a period of time during which a person voluntarily refrains from using digital devices such as smartphones, computers, and social media platforms. The goal is to reduce stress and focus on real-life social interactions without distractions. This practice can improve mental health, reduce anxiety, and help you reconnect with the physical world around you.",
    color: "from-[#FC68B3] to-[#FF8A48]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "box-breathing": {
    title: "Box Breathing",
    description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold again for 4 seconds. This rhythmic breathing pattern can calm your nervous system.",
    color: "from-[#3DFDFF] to-[#2AC20E]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "grounding-technique": {
    title: "5-4-3-2-1 Technique",
    description: "Name 5 things you can see, Name 4 things you can touch, Name 3 things you can hear, Name 2 things you can smell, Name 1 thing you can taste.",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "mirror-mirror": {
    title: "Mirror Mirror On the Wall",
    description: "Because how you speak to yourself matters.",
    color: "from-[#FC68B3] to-[#2AC20E]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  }
};

// Define a TypeScript interface for the activities
interface Activity {
  title: string;
  description: string;
  detailedDescription?: string; // Make this property optional
  color: string;
  image: string;
}

type ActivityParams = {
  activityId: string;
};

// Updated feedback dialog component
const FeedbackDialog = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (feedback: string) => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
            How was your experience?
          </DialogTitle>
          <DialogDescription className="text-center">
            Your feedback helps us improve our activities
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-10 px-4">
          <Button 
            onClick={() => onSubmit('positive')} 
            variant="outline" 
            className="flex flex-col items-center p-4 hover:bg-emerald-100 hover:border-emerald-200 transition-colors h-auto"
          >
            <ThumbsUp size={32} className="text-green-500 mb-2" />
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
            <ThumbsDown size={32} className="text-red-500 mb-2" />
            <span>Not helpful</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add a celebration dialog component
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

// Animation component to replace the static image
const DetoxAnimation = () => {
  return (
    <div className="relative h-64 w-full max-w-md mx-auto flex items-center justify-center bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 rounded-lg overflow-hidden">
      {/* Animated circles in the background */}
      <motion.div 
        className="absolute w-20 h-20 rounded-full bg-[#3DFDFF]/30"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 20, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-16 h-16 rounded-full bg-[#F5DF4D]/30"
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [20, -10, 20],
          y: [-20, 10, -20] 
        }}
        transition={{ 
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-12 h-12 rounded-full bg-[#FC68B3]/30"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [-10, 30, -10],
          y: [10, -20, 10] 
        }}
        transition={{ 
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated device icons */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="mb-5"
          animate={{ 
            y: [0, -10, 0],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <Smartphone size={48} className="text-[#FC68B3]" />
        </motion.div>
        
        <motion.div
          className="flex items-center gap-10"
          animate={{ 
            y: [0, 5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut"
            }}
          >
            <Coffee size={32} className="text-[#2AC20E]" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, -10, 0, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Sun size={32} className="text-[#F5DF4D]" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Moon size={32} className="text-[#3DFDFF]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const EmotionalHackingActivity = () => {
  const { user } = useAuth();
  const { activityId } = useParams<ActivityParams>();
  const activity = activityId ? activities[activityId as keyof typeof activities] as Activity : null;
  
  // If the activityId is box-breathing, redirect to the dedicated component
  if (activityId === "box-breathing") {
    return <BoxBreathingActivity />;
  }
  
  // Digital Detox specific states
  const [isDetoxActive, setIsDetoxActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [initialTime, setInitialTime] = useState(5); // 5 minutes
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Activity completion states
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Start the detox timer
  const startDetox = () => {
    setIsDetoxActive(true);
    setTimeRemaining(initialTime * 60); // Convert minutes to seconds
    
    toast.success("Digital detox started! Take a break from your devices and relax.");
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDetoxActive(false);
          setActivityCompleted(true);
          setShowCelebration(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(interval);
  };

  // Reset the detox timer
  const resetDetox = () => {
    if (timer) clearInterval(timer);
    setIsDetoxActive(false);
    setTimeRemaining(initialTime * 60);
    toast.info("Digital detox reset.");
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Record activity completion in the database
  const recordActivityCompletion = async (feedback?: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_name: activity?.title || '',
          activity_id: activityId || '',
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

  // Handle activity completion - show celebration and then feedback dialog
  const handleActivityComplete = () => {
    setActivityCompleted(true);
    setShowCelebration(true);
  };

  // Handle closing the celebration dialog
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    setShowFeedback(true); // Show feedback dialog after celebration
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  // Complete activity without feedback (for non-digital-detox activities)
  const completeGenericActivity = () => {
    handleActivityComplete();
  };

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Activity Not Found</h1>
          <Link to="/resources">
            <Button>Back to Resources Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render digital detox content if the activity is digital-detox
  if (activityId === "digital-detox") {
    return (
      <BackgroundWithEmojis>
        <div className="min-h-screen relative">
          <Navbar />
          
          <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
            <Link to="/resources" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources Hub
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-lg shadow-xl">
                <div className="text-center mb-8">
                  <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${activity.color} bg-clip-text text-transparent mb-4`}>
                    Let's Take a Digital Detox!
                  </h1>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    {activity.detailedDescription || activity.description}
                  </p>
                  
                  <p className="text-xl font-medium text-gray-800">
                    Give your mind a mini vacation. Let's relax, reset, and recharge!
                  </p>
                </div>
                
                <div className="mb-6">
                  <DetoxAnimation />
                </div>
                
                {isDetoxActive ? (
                  <div className="flex flex-col items-center mt-10 mb-8">
                    <div className="text-6xl font-bold bg-gradient-to-r from-[#3DFDFF] to-[#FC68B3] bg-clip-text text-transparent mb-6">
                      {formatTime(timeRemaining)}
                    </div>
                    <p className="text-gray-600 mb-8">
                      Put down your devices and take a break. Time remaining for your digital detox.
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-[#F5DF4D] to-[#FF8A48] text-white px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300"
                      onClick={resetDetox}
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Reset Detox
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mt-10">
                    <p className="text-gray-700 mb-2">Set your detox time (minutes):</p>
                    <div className="w-full max-w-xs mb-4">
                      <Slider 
                        defaultValue={[initialTime]} 
                        min={1} 
                        max={30} 
                        step={1}
                        onValueChange={(value) => setInitialTime(value[0])}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1 min</span>
                        <span>{initialTime} mins</span>
                        <span>30 mins</span>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6"
                    >
                      <Button 
                        className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-black font-medium text-lg px-10 py-6 rounded-full hover:opacity-90 transition-all duration-300"
                        onClick={startDetox}
                      >
                        <Play className="mr-3 h-6 w-6" />
                        Begin Reset
                      </Button>
                    </motion.div>
                    
                    <p className="text-gray-500 mt-6 text-sm">
                      <Clock className="inline-block mr-1 h-4 w-4" />
                      Take {initialTime} minutes away from all screens
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
            activityName={activity.title}
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
  }

  // Default render for other activities
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <Link to="/resources" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources Hub
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-lg shadow-xl">
              <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${activity.color} bg-clip-text text-transparent mb-6`}>
                {activity.title}
              </h1>
              
              <div className="mb-6">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
              </div>
              
              <div className="text-lg text-gray-700 mb-8">
                <p className="mb-4">{activity.description}</p>
                <p>This activity will be implemented in detail soon. For now, try following the instructions above!</p>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  className={`bg-gradient-to-r ${activity.color} text-white px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300`}
                  onClick={completeGenericActivity}
                >
                  Complete Activity
                </Button>
              </div>
            </Card>
          </motion.div>
          
          {/* Celebration dialog */}
          <CelebrationDialog 
            isOpen={showCelebration} 
            onClose={handleCelebrationClose}
            activityName={activity.title}
          />
          
          {/* Feedback dialog */}
          <FeedbackDialog 
            isOpen={showFeedback} 
            onClose={() => setShowFeedback(false)} 
            onSubmit={handleFeedback}
          />
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default EmotionalHackingActivity;
