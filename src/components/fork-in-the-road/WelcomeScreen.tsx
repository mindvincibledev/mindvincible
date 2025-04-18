
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md mx-auto h-64 bg-gradient-to-r from-[#3DFDFF]/10 to-[#2AC20E]/10 rounded-lg mb-8 flex items-center justify-center overflow-hidden relative">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ 
              scale: [0.7, 1.05, 1], 
              opacity: [0, 1, 1],
              rotate: [-5, 5, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img 
              src="/lovable-uploads/26b93893-5c35-4903-b3d9-a74d20fa676c.png" 
              alt="Confused Student" 
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
          
          {/* Wavy background effect */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#3DFDFF]/20 to-transparent"
            animate={{ 
              y: [0, -5, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">
          Big or small, decisions shape our story
        </h2>
        
        <p className="text-gray-700 mb-8 max-w-xl mx-auto">
          Let's explore your options — one thoughtful step at a time.
        </p>
        
        <Button 
          onClick={onNext}
          className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
        >
          Start My Decision Map
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;

