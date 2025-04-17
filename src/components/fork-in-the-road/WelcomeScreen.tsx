
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
        {/* Placeholder for illustration */}
        <div className="w-full max-w-md mx-auto h-64 bg-gradient-to-r from-[#3DFDFF]/10 to-[#2AC20E]/10 rounded-lg mb-8 flex items-center justify-center">
          <p className="text-gray-500">Illustration Placeholder</p>
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
