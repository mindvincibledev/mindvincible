
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, BatteryMedium } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';

const DigitalDetox = () => {
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  
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
    }
  ];

  React.useEffect(() => {
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
                  <CardTitle className="text-2xl font-bold">
                    Step {currentStep + 1}: {steps[currentStep].title}
                  </CardTitle>
                </div>
                <CardDescription className="text-lg">
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
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
                    disabled={currentStep === steps.length - 1}
                    className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:opacity-90"
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default DigitalDetox;
