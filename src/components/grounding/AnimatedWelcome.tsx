
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Typewriter } from '@/components/ui/typewriter';
import { Eye, Leaf, Wind } from 'lucide-react';

interface AnimatedWelcomeProps {
  onBegin: () => void;
}

const AnimatedWelcome: React.FC<AnimatedWelcomeProps> = ({ onBegin }) => {
  return (
    <motion.div 
      className="p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
        >
          <div className="p-5 bg-gradient-to-br from-[#F5DF4D]/20 to-[#3DFDFF]/20 rounded-full">
            <div className="relative">
              <Leaf className="h-12 w-12 text-[#F5DF4D] absolute" 
                style={{ transform: 'rotate(-30deg) translate(-5px, -5px)' }}/>
              <Eye className="h-12 w-12 text-[#3DFDFF] absolute"
                style={{ transform: 'translate(10px, 0)' }}/>
              <Wind className="h-12 w-12 text-[#FC68B3] relative"
                style={{ transform: 'translate(5px, 5px)' }}/>
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-[#F5DF4D] to-[#3DFDFF] bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          5-4-3-2-1: The Grounding Quest
        </motion.h1>
        
        <div className="mb-8 h-28"> 
          <Typewriter
            text="Feeling anxious or spaced out? This quick quest uses your senses to bring you back to the present moment. Let's ground your mind—one sense at a time."
            speed={20}
            className="text-lg text-gray-700"
            initialDelay={1000}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 4, type: "spring" }}
        >
          <Button 
            onClick={onBegin}
            className="bg-gradient-to-r from-[#3DFDFF] to-[#FC68B3] hover:opacity-90 text-white font-medium text-lg px-8 py-6"
          >
            Begin Grounding Quest
          </Button>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-8 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 5 }}
      >
        <p className="text-sm text-center text-gray-500 italic">
          This exercise helps engage your five senses to ground yourself in the present moment, 
          reducing anxiety and bringing back focus.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedWelcome;
