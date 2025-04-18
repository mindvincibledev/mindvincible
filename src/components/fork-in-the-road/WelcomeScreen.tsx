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
              scale: [0.7, 1.1, 0.9, 1], 
              opacity: 1,
              rotate: [-5, 5, -3, 3, 0],
              y: [0, -10, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 1]
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img 
              src="/lovable-uploads/26b93893-5c35-4903-b3d9-a74d20fa676c.png" 
              alt="Confused Student" 
              className="max-w-full max-h-full object-contain transform-gpu"
            />
          </motion.div>
          
          {/* Floating bubbles background effect */}
          <motion.div 
            className="absolute w-20 h-20 rounded-full bg-[#3DFDFF]/10"
            animate={{ 
              x: [0, 30, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              left: '20%',
              top: '30%'
            }}
          />
          
          <motion.div 
            className="absolute w-16 h-16 rounded-full bg-[#2AC20E]/10"
            animate={{ 
              x: [0, -20, 30, 0],
              y: [0, 20, -30, 0],
              scale: [1, 0.8, 1.2, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              right: '25%',
              bottom: '20%'
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
