
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatteryMedium, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0 flex flex-col items-center">
        <motion.div 
          className="relative w-24 h-24 mx-auto mb-8 mt-4"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex items-center justify-center">
            <BatteryMedium size={64} className="text-[#0ABFDF]" />
            <motion.div
              className="absolute"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <Zap size={24} className="text-[#F9A159]" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] bg-clip-text text-transparent mb-6">
            Battery Boost
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl mx-auto">
            Not all scrolling is the same. Some posts boost us, some drain us. Let's see what your feed is doing to your energy.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button 
            onClick={onStart}
            className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white hover:opacity-90 transition-all duration-300 px-8 py-6 text-lg rounded-full"
          >
            Start Scavenger Hunt
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
