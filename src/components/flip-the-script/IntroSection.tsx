
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface IntroSectionProps {
  onComplete: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  return (
    <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0 flex flex-col items-center">
        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FC68B3]/30 to-[#D5D5F1]/30 rounded-lg" />
          
          {/* Animation of flipping cards */}
          <motion.div
            className="relative z-10 w-56 h-56 mx-auto mb-8 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-full h-full">
              {/* Static card */}
              <motion.div 
                className="absolute inset-0 rounded-lg shadow-lg bg-gradient-to-r from-[#FC68B3]/20 to-[#D5D5F1]/20 backdrop-blur-sm flex items-center justify-center border-4 border-[#FC68B3]/30"
                animate={{ 
                  rotateY: [0, 180, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center backface-hidden">
                  <p className="text-[#FC68B3] text-xl font-bold">Negative Thought</p>
                </div>
                <div 
                  className="absolute inset-0 flex items-center justify-center backface-hidden"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <p className="text-[#D5D5F1] text-xl font-bold">Positive Reframe</p>
                </div>
              </motion.div>
              
              {/* Floating particles */}
              {Array(6).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#FC68B3]/30"
                  style={{
                    width: 4 + Math.random() * 8,
                    height: 4 + Math.random() * 8,
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    y: [0, -30, 0],
                    x: [0, Math.random() * 20 - 10, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5 + Math.random() * 5,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#D5D5F1] bg-clip-text text-transparent mb-6">
            Flip the Script
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed max-w-xl mx-auto">
            Our inner voice can be our biggest critic, but it doesn't have to be. Critical thoughts aren't facts, they're stories we tell ourselves.
            "Flip the Script" helps you identify these negative thoughts and replace them with empowering ones. By shifting your mindset, you can build confidence, self-worth and, ultimately, improve the way you approach life.
            <br /><br /> 
            Ready to take control of your narrative and unlock your true potential? Let's flip the script!
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button 
            onClick={onComplete}
            className="bg-gradient-to-r from-[#FC68B3] to-[#D5D5F1] text-white hover:opacity-90 transition-all duration-300 px-8 py-6 text-lg rounded-full flex items-center gap-2"
          >
            <BookOpen size={20} />
            Let's Begin
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default IntroSection;
