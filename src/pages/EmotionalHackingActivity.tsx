import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Play, RotateCcw, Moon, Sun, Smartphone, Coffee, Check, Heart, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Affirmation from '@/components/Affirmation';

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
    description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold again for 4 seconds. This rhythmic breathing pattern can calm your nervous system. (Imagine tracing a box in the air as you do this!)",
    color: "from-[#3DFDFF] to-[#2AC20E]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "expressive-writing": {
    title: "Expressive Writing",
    description: "Take a moment to write down whatever you're feeling. Don't censor yourself, just let the words flow. This can help you process your emotions and clear your mind.",
    color: "from-[#3DFDFF] to-[#FC68B3]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "grounding-technique": {
    title: "5-4-3-2-1 Technique",
    description: "Name 5 things you can see, Name 4 things you can touch, Name 3 things you can hear, Name 2 things you can smell, Name 1 thing you can taste.",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "music-mindfulness": {
    title: "Music Mindfulness",
    description: "Put on your favourite song and really focus on the lyrics, beats, or instruments. Try to hum along or tap your fingers to the rhythm.",
    color: "from-[#FC68B3] to-[#F5DF4D]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "sensory-focus": {
    title: "Sensory Focus",
    description: "Pop a piece of gum or a mint in your mouth and focus on the flavour, texture, and how it feels as you chew.",
    color: "from-[#F5DF4D] to-[#FC68B3]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
  "walk-it-out": {
    title: "Walk It Out",
    description: "Take a walk, even if it's just around your room. Notice the feeling of your feet hitting the ground. Bonus: Walk barefoot on grass!",
    color: "from-[#2AC20E] to-[#3DFDFF]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
  "color-hunt": {
    title: "Color Hunt",
    description: "Pick a colour and find 5 things around you that match it. This distracts your brain and brings you back to the present.",
    color: "from-[#3DFDFF] to-[#F5DF4D]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
  "rewinding-rewiring": {
    title: "Rewinding-Rewiring",
    description: "Think of a happy or funny memory and walk yourself through the details—what were you wearing? Who was there? What did it smell like?",
    color: "from-[#FC68B3] to-[#2AC20E]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
  "grounding": {
    title: "Grounding Techniques",
    description: "When emotions start to feel too intense, grounding techniques can help bring you back to the present moment. Grounding is like hitting a mental reset button, shifting your focus away from overwhelming thoughts and back to what's happening right now. It helps you pause and then take actions.",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
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

// Add a celebration dialog component
const CelebrationDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const emojis = ["✨", "🎉", "🌟", "💫", "🙌", "🎊", "💯", "🏆", "🥇", "👏"];
  const affirmations = [
    "Amazing job taking a break from your screens!",
    "Your mind thanks you for the digital break!",
    "Well done on prioritizing your mental well-being!",
    "Congratulations on completing your digital detox!",
    "You've just given your brain a wonderful gift!",
    "Taking time away from screens is a sign of self-care mastery!",
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
  const { activityId } = useParams<ActivityParams>();
  const activity = activityId ? activities[activityId as keyof typeof activities] as Activity : null;
  
  // Digital Detox specific states
  const [isDetoxActive, setIsDetoxActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [initialTime, setInitialTime] = useState(5); // 5 minutes
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  // New state for the celebration dialog
  const [showCelebration, setShowCelebration] = useState(false);

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
          setShowCelebration(true); // Show celebration when timer completes
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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Activity Not Found</h1>
          <Link to="/emotional-hacking">
            <Button>Back to Emotional Hacking</Button>
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
                
                {/* Celebration dialog */}
                <CelebrationDialog 
                  isOpen={showCelebration} 
                  onClose={() => setShowCelebration(false)} 
                />
                
              </Card>
            </motion.div>
          </div>
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
                >
                  Start Activity
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default EmotionalHackingActivity;
