
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check } from 'lucide-react';

interface ExitSectionProps {
  onAnotherPrompt: () => void;
  onComplete: () => void;
  promptsCompleted: number;
}

const ExitSection: React.FC<ExitSectionProps> = ({ onAnotherPrompt, onComplete, promptsCompleted }) => {
  return (
    <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl border-none">
      <CardContent className="p-0 flex flex-col items-center">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] flex items-center justify-center mx-auto mb-6"
          >
            <Check size={36} className="text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#FC68B3] bg-clip-text text-transparent mb-4">
            Great Reflection!
          </h2>
          
          <p className="text-lg text-gray-700">
            You've completed {promptsCompleted} reflection{promptsCompleted !== 1 ? 's' : ''}.
          </p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-lg text-gray-600"
          >
            Want another round?
          </motion.p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onAnotherPrompt}
              className="bg-gradient-to-r from-[#9b87f5] to-[#FC68B3] text-white hover:opacity-90 transition-all duration-300 px-6 py-2 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Yes, give me another card
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onComplete}
              variant="outline"
              className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 px-6 py-2"
            >
              Done for now
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExitSection;
