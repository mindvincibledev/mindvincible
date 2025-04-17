
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DecisionInputScreenProps {
  onNext: (choice: string) => void;
  initialValue?: string;
}

const DecisionInputScreen: React.FC<DecisionInputScreenProps> = ({ onNext, initialValue = '' }) => {
  const [choice, setChoice] = useState(initialValue);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (choice.trim().length === 0) {
      setIsError(true);
      return;
    }
    
    onNext(choice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md mx-auto h-48 bg-gradient-to-r from-[#D5D5F1]/20 to-[#3DFDFF]/20 rounded-lg mb-8 flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl">🤔</div>
          </div>
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
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-4">
          What choice are you facing right now?
        </h2>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="space-y-4">
            <div>
              <Label htmlFor="choice" className={isError ? "text-red-500" : ""}>
                Your decision
              </Label>
              <Input
                id="choice"
                value={choice}
                onChange={(e) => {
                  setChoice(e.target.value);
                  if (isError) setIsError(false);
                }}
                placeholder="Example: Should I join the soccer team or stick to my art club?"
                className={`text-lg p-4 ${isError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {isError && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter your decision to continue
                </p>
              )}
            </div>
            
            <Button 
              type="submit"
              className="w-full md:w-auto mt-4 bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default DecisionInputScreen;
