import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react'; // Replace Mirror with Eye

interface IntroSectionProps {
  onComplete: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  return (
    <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0 flex flex-col items-center">
        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E5DEFF]/30 to-[#FFDEE2]/30 rounded-lg" />
          
          {/* Mirror animation */}
          <motion.div
            className="relative z-10 w-56 h-56 mx-auto mb-8 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-full h-full">
              {/* Mirror frame */}
              <motion.div 
                className="absolute inset-0 rounded-full border-8 border-[#9b87f5]/30 bg-gradient-to-r from-[#E5DEFF]/20 to-[#FFDEE2]/20 backdrop-blur-sm"
                animate={{ 
                  boxShadow: ["0 0 10px rgba(155, 135, 245, 0.2)", "0 0 20px rgba(155, 135, 245, 0.4)", "0 0 10px rgba(155, 135, 245, 0.2)"],
                  scale: [1, 1.03, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut"
                }}
              />
              
              {/* Reflection icon */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.95, 1, 0.95]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  ease: "easeInOut"
                }}
              >
                <Eye size={80} className="text-[#9b87f5]/60" /> {/* Changed from Mirror to Eye */}
              </motion.div>
              
              {/* Floating particles */}
              {Array(6).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#9b87f5]/30"
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#9b87f5] bg-clip-text text-transparent mb-6">
            Mirror Mirror On the Wall
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed max-w-xl mx-auto">
            Ever say things to yourself you'd never say to a friend?
            Let's flip that. This is your time to reflect, reframe, and speak with kindness.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button 
            onClick={onComplete}
            className="bg-gradient-to-r from-[#9b87f5] to-[#FC68B3] text-white hover:opacity-90 transition-all duration-300 px-8 py-6 text-lg rounded-full"
          >
            Let's Begin
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default IntroSection;
