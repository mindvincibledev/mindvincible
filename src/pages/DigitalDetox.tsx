
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, BatteryMedium, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { toast } from 'sonner';

const DigitalDetox = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
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
      
      // If this is the last step, redirect to the timer activity
      if (currentStep === steps.length - 2) {
        // We're moving from step 2 to step 3 (the final step)
        navigate('/emotional-hacking/digital-detox');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
                  {currentStep === 3 && <Clock className="h-6 w-6 text-[#FC68B3] mr-2" />}
                  <CardTitle className="text-2xl font-bold">
                    Step {currentStep + 1}: {steps[currentStep].title}
                  </CardTitle>
                </div>
                <CardDescription className="text-lg">
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {currentStep < steps.length - 1 ? (
                  <>
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
                  </>
                ) : (
                  <div className="text-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-8"
                    >
                      <img 
                        src="/lovable-uploads/2d3c8c79-869a-4a45-93df-090b11ed3962.png" 
                        alt="Digital Detox" 
                        className="mx-auto max-w-full h-auto rounded-lg"
                      />
                    </motion.div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-lg mb-6"
                    >
                      You're ready to start your digital detox! Click the button below to begin the timed exercise.
                    </motion.p>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-black px-8 py-6 text-lg rounded-full hover:opacity-90 transition-all duration-300"
                        onClick={() => navigate('/emotional-hacking/digital-detox')}
                      >
                        Begin Digital Detox Timer
                      </Button>
                    </motion.div>
                  </div>
                )}
                
                {currentStep < steps.length - 1 && (
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
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default DigitalDetox;
