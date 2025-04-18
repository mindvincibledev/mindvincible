
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GitFork } from 'lucide-react';

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
          {/* Emoji and Path Animation */}
          <motion.div
            className="absolute text-6xl"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🤔
          </motion.div>
          
          {/* Left Path */}
          <motion.div
            className="absolute h-1 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] rounded-full"
            initial={{ width: 0, rotate: -30, x: -50, y: 20 }}
            animate={{ width: 100, opacity: [0, 1, 0.8] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          {/* Right Path */}
          <motion.div
            className="absolute h-1 bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] rounded-full"
            initial={{ width: 0, rotate: 30, x: 50, y: 20 }}
            animate={{ width: 100, opacity: [0, 1, 0.8] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Floating decision symbols */}
          <motion.div
            className="absolute text-2xl"
            animate={{
              x: [30, 60],
              y: [0, 30],
              opacity: [0, 1, 0],
              scale: [0.8, 1.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ left: '60%', top: '40%' }}
          >
            ❓
          </motion.div>
          
          <motion.div
            className="absolute text-2xl"
            animate={{
              x: [-30, -60],
              y: [0, 30],
              opacity: [0, 1, 0],
              scale: [0.8, 1.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
            style={{ right: '60%', top: '40%' }}
          >
            ❔
          </motion.div>
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
