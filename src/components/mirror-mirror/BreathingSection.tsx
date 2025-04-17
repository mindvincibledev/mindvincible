
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BreathingSectionProps {
  onComplete: () => void;
}

const BreathingSection: React.FC<BreathingSectionProps> = ({ onComplete }) => {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [autoBreathingActive, setAutoBreathingActive] = useState(true);
  const [breathCount, setBreathCount] = useState(0);
  
  // Manage breathing animation cycle
  useEffect(() => {
    if (!autoBreathingActive) return;
    
    let timer: NodeJS.Timeout;
    
    if (breathPhase === 'inhale') {
      timer = setTimeout(() => {
        setBreathPhase('hold');
      }, 4000); // 4 seconds inhale
    } else if (breathPhase === 'hold') {
      timer = setTimeout(() => {
        setBreathPhase('exhale');
      }, 4000); // 4 seconds hold
    } else {
      timer = setTimeout(() => {
        setBreathPhase('inhale');
        setBreathCount(prev => prev + 1);
      }, 4000); // 4 seconds exhale
    }
    
    return () => clearTimeout(timer);
  }, [breathPhase, autoBreathingActive]);

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Take a deep breath. Let's be fully present.
          </h2>
        </div>
        
        <div className="relative w-64 h-64 mb-10">
          {/* The breathing circle animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="rounded-full bg-gradient-to-r from-[#E5DEFF] to-[#FFDEE2] flex items-center justify-center"
              animate={{
                scale: breathPhase === 'inhale' ? [1, 1.5] :
                       breathPhase === 'hold' ? 1.5 :
                       [1.5, 1],
                opacity: [0.8, 0.9, 0.8]
              }}
              transition={{
                duration: breathPhase === 'hold' ? 0.1 : 4,
                ease: "easeInOut"
              }}
              style={{ width: 200, height: 200 }}
            >
              <div className="text-xl font-medium text-gray-700">
                {breathPhase === 'inhale' ? 'Breathe In' : 
                 breathPhase === 'hold' ? 'Hold' : 
                 'Breathe Out'}
              </div>
            </motion.div>
          </div>
          
          {/* Concentric circles animation */}
          <AnimatePresence>
            {breathPhase === 'inhale' && (
              <>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={`inhale-${i}`}
                    className="absolute rounded-full border-2 border-[#9b87f5]/30"
                    initial={{ 
                      width: 20, 
                      height: 20, 
                      x: "-50%", 
                      y: "-50%",
                      top: "50%",
                      left: "50%",
                      opacity: 0 
                    }}
                    animate={{ 
                      width: 200 + (i * 40), 
                      height: 200 + (i * 40), 
                      opacity: [0, 0.5, 0] 
                    }}
                    transition={{ 
                      repeat: breathPhase === 'inhale' ? Infinity : 0,
                      duration: 4,
                      delay: i * 1,
                      ease: "easeOut" 
                    }}
                    exit={{ opacity: 0 }}
                  />
                ))}
              </>
            )}
            
            {breathPhase === 'exhale' && (
              <>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={`exhale-${i}`}
                    className="absolute rounded-full border-2 border-[#FC68B3]/30"
                    initial={{ 
                      width: 200 + ((3 - i) * 40), 
                      height: 200 + ((3 - i) * 40),
                      x: "-50%", 
                      y: "-50%",
                      top: "50%",
                      left: "50%",
                      opacity: 0.5 
                    }}
                    animate={{ 
                      width: 20, 
                      height: 20, 
                      opacity: [0.5, 0] 
                    }}
                    transition={{ 
                      repeat: breathPhase === 'exhale' ? Infinity : 0,
                      duration: 4,
                      delay: (3 - i) * 1,
                      ease: "easeIn" 
                    }}
                    exit={{ opacity: 0 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button 
            onClick={onComplete}
            className="bg-gradient-to-r from-[#9b87f5] to-[#FC68B3] text-white hover:opacity-90 transition-all duration-300 px-8 py-2"
          >
            I'm Ready
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default BreathingSection;
