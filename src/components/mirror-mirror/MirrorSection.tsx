
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Eye, CheckCircle } from 'lucide-react';

interface MirrorSectionProps {
  onComplete: () => void;
  completedPrompts: string[];
  onPromptCompleted: (prompt: string) => void;
}

// List of reflection prompts
const REFLECTION_PROMPTS = [
  "What emotion have you been feeling the most lately? Say it out loud to yourself. No judgment.",
  "If your inner critic had a silly name, what would it be? (Now tell it to take a break!)",
  "Name one moment today when you showed strength.",
  "Imagine you wake up with a superpower that makes you instantly kinder to yourself—what would it be?",
  "What's one unkind thing you often tell yourself? Now rephrase it as if talking to a friend.",
  "What's a small \"failure\" you can now laugh about?", // Escaped quotes
  "What's one kind thing you've done for someone else this week?",
  "You're a cartoon character—what's your catchphrase that makes you feel unstoppable?",
  "What's a compliment you've received that you secretly love but don't say out loud?",
  "Imagine your future self just sent you a text. What does it say?",
];

const MirrorSection: React.FC<MirrorSectionProps> = ({ onComplete, completedPrompts, onPromptCompleted }) => {
  const [mirrorOption, setMirrorOption] = useState<'camera' | 'imagine' | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Select a random prompt that hasn't been completed yet
  useEffect(() => {
    const availablePrompts = REFLECTION_PROMPTS.filter(prompt => !completedPrompts.includes(prompt));
    
    // If all prompts have been shown, start over
    const prompts = availablePrompts.length > 0 ? availablePrompts : REFLECTION_PROMPTS;
    
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  }, [completedPrompts]);

  // Handle camera activation
  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setMirrorOption('imagine'); // Fallback to imagination option
    }
  };

  // Handle mirror option selection
  const handleMirrorOptionSelect = (option: 'camera' | 'imagine') => {
    setMirrorOption(option);
    
    if (option === 'camera') {
      activateCamera();
    }
  };

  // Clean up camera when component unmounts or mirror option changes
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle prompt completion
  const handlePromptComplete = () => {
    onPromptCompleted(currentPrompt);
    onComplete();
  };

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl border-none">
      <CardContent className="p-0">
        {!mirrorOption ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
              Look at yourself for just a moment. Be here with you.
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleMirrorOptionSelect('camera')}
                  className="flex items-center gap-3 bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] text-white px-6 py-8 rounded-lg text-lg hover:opacity-90"
                >
                  <Camera size={24} />
                  Use my front camera
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleMirrorOptionSelect('imagine')}
                  className="flex items-center gap-3 bg-gradient-to-r from-[#FC68B3] to-[#FFDEE2] text-white px-6 py-8 rounded-lg text-lg hover:opacity-90"
                >
                  <Eye size={24} />
                  I'll imagine a mirror
                </Button>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8">
              {mirrorOption === 'camera' && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-md h-64 md:h-80 rounded-xl mx-auto object-cover bg-black/10"
                    style={{ transform: 'scaleX(-1)' }} // Mirror effect
                  />
                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                      <p className="text-gray-600">Waiting for camera access...</p>
                    </div>
                  )}
                </div>
              )}
              
              {mirrorOption === 'imagine' && (
                <div className="w-full max-w-md h-64 md:h-80 mx-auto rounded-xl bg-gradient-to-r from-[#E5DEFF]/30 to-[#FFDEE2]/30 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Eye size={48} className="mx-auto mb-4 text-[#9b87f5]/60" />
                    <p className="text-gray-600 italic">
                      Close your eyes for a moment and picture yourself in front of a mirror
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="my-8 p-6 border border-[#9b87f5]/20 rounded-lg bg-white/50 max-w-lg mx-auto"
            >
              <h3 className="text-xl font-medium text-gray-800 mb-1">Reflection Prompt:</h3>
              <p className="text-lg text-gray-700 mb-0">{currentPrompt}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Button 
                onClick={handlePromptComplete}
                className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 transition-all duration-300 mt-4 flex items-center gap-2"
              >
                <CheckCircle size={18} />
                I've Reflected
              </Button>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MirrorSection;
