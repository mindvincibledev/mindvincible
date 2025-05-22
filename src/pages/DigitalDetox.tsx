
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, BatteryMedium, Clock, Play, RotateCcw, Check, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Affirmation from '@/components/Affirmation';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';

const DigitalDetox = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  
  // Digital Detox specific states
  const [isDetoxActive, setIsDetoxActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [initialTime, setInitialTime] = useState(5); // 5 minutes
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Activity completion states
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const steps = [
    {
      title: "Recognize Digital Overload",
      description: "Notice how being constantly connected affects your mood and attention span.",
      tips: [
        "Notice how much time you spend looking at screens",
        "Be aware of how you feel after long digital sessions",
        "Pay attention to when you reach for your device automatically"
      ]
    },
    {
      title: "Set Digital Boundaries",
      description: "Create tech-free times and spaces in your daily routine.",
      tips: [
        "No phones during meals",
        "No screens 1 hour before bedtime",
        "Designate tech-free zones in your home"
      ]
    },
    {
      title: "Practice Mindful Usage",
      description: "Be intentional about how and why you use technology.",
      tips: [
        "Ask yourself if this screen time is necessary right now",
        "Set a timer when you go online for leisure",
        "Take regular breaks - 5 minutes every 25 minutes"
      ]
    },
    {
      title: "Begin Your Digital Detox",
      description: "Take a complete break from screens with a timed activity.",
      tips: [
        "Set aside your devices for a specific period",
        "Focus on being present in the moment",
        "Notice how you feel during this break from technology"
      ]
    }
  ];

  useEffect(() => {
    setProgress((currentStep / (steps.length - 1)) * 100);
  }, [currentStep, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
          activity_name: 'Digital Detox',
          activity_id: 'digital-detox',
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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  // Updated feedback dialog component
  const FeedbackDialog = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (feedback: string) => void }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              How was your experience?
            </DialogTitle>
            <CardDescription className="text-center">
              Your feedback helps us improve our activities
            </CardDescription>
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
    onClose
  }: { 
    isOpen: boolean, 
    onClose: () => void
  }) => {
    const emojis = ["✨", "🎉", "🌟", "💫", "🙌", "🎊", "💯", "🏆", "🥇", "👏"];
    const affirmations = [
      "Amazing job completing your Digital Detox!",
      "Your mind thanks you for taking this break!",
      "Well done on prioritizing your mental well-being!",
      "Congratulations on completing your Digital Detox!",
      "You've just given your brain a wonderful gift!",
      "Taking time for self-care is a sign of strength!",
      "That's how you recharge your mental batteries!",
      "Fantastic work creating space for your mind to breathe!"
    ];
    
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              Digital Detox Complete!
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

  // Animated device icons component
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
        
        {/* Wavy background effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#3DFDFF]/5 to-[#FC68B3]/5"
          style={{ 
            backgroundSize: "400% 400%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
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
            <div className="h-12 w-8 border-2 border-[#FC68B3] rounded-lg relative">
              <div className="w-4 h-1 bg-[#FC68B3] rounded absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
              <div className="h-1 w-1 bg-[#FC68B3] rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
            </div>
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
              <div className="w-8 h-10 border-2 border-[#2AC20E] rounded relative">
                <div className="absolute w-2 h-2 border-2 border-t-0 border-l-0 border-[#2AC20E] top-0 right-0"></div>
                <div className="absolute w-2 h-2 border-2 border-t-0 border-r-0 border-[#2AC20E] top-0 left-0"></div>
                <div className="absolute w-6 h-0.5 bg-[#2AC20E] top-5 left-1/2 transform -translate-x-1/2"></div>
                <div className="absolute w-6 h-0.5 bg-[#2AC20E] top-7 left-1/2 transform -translate-x-1/2"></div>
              </div>
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
              <div className="w-10 h-6 rounded-full border-2 border-[#F5DF4D] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-[#F5DF4D]"></div>
              </div>
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
              <div className="w-8 h-8 rounded-full border-2 border-[#3DFDFF] relative overflow-hidden">
                <div className="absolute w-5 h-5 rounded-full border-2 border-[#3DFDFF] -top-2 -right-2"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
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
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] bg-clip-text text-transparent mb-4">
              Digital Detox
            </h1>
            <p className="text-black text-lg max-w-3xl mx-auto">
              Reconnect with yourself by disconnecting from your devices
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto mb-8">
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Start</span>
              <span>Progress</span>
              <span>Complete</span>
            </div>
          </div>
          
          {currentStep < steps.length - 1 ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-white/90 backdrop-blur-md border border-[#D5D5F1]/20 shadow-lg">
                <CardHeader className="border-b border-[#D5D5F1]/20 pb-4">
                  <div className="flex items-center mb-2">
                    {currentStep === 0 && <Moon className="h-6 w-6 text-[#3DFDFF] mr-2" />}
                    {currentStep === 1 && <BatteryMedium className="h-6 w-6 text-[#F5DF4D] mr-2" />}
                    {currentStep === 2 && <Moon className="h-6 w-6 text-[#2AC20E] mr-2" />}
                    <CardTitle className="text-2xl font-bold">
                      Step {currentStep + 1}: {steps[currentStep].title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    {steps[currentStep].description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <DetoxAnimation />
                  </div>
                  
                  <h3 className="text-xl font-medium mb-4">Try these tips:</h3>
                  <ul className="space-y-4">
                    {steps[currentStep].tips.map((tip, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-start"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-between mt-10">
                    <Button 
                      onClick={handlePrev} 
                      disabled={currentStep === 0}
                      variant="outline"
                      className="border-[#D5D5F1]"
                    >
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={handleNext} 
                      className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:opacity-90"
                    >
                      {currentStep === steps.length - 2 ? "Start Digital Detox" : "Next Step"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Final step with timer implementation
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-lg shadow-xl">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">
                    Let's Take a Digital Detox!
                  </h1>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    Give yourself a mental break by unplugging from all electronic devices. Taking a 'vacation' from screens can help you reset and refocus. Use this time to connect with yourself or the physical world around you.
                  </p>
                  
                  <p className="text-xl font-medium text-gray-800">
                    Give your mind a mini vacation. Let's relax, reset, and recharge!
                  </p>
                </div>
                
                <div className="mb-6">
                  <img 
                    src="/lovable-uploads/2d3c8c79-869a-4a45-93df-090b11ed3962.png" 
                    alt="Digital Detox" 
                    className="mx-auto max-w-full h-auto rounded-lg"
                  />
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
          )}
          
          {/* Celebration dialog */}
          <CelebrationDialog 
            isOpen={showCelebration} 
            onClose={handleCelebrationClose}
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

export default DigitalDetox;
