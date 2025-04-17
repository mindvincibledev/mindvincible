
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface GutCheckScreenProps {
  onComplete: (selection: string) => void;
  decisionData: {
    consideration_path: string;
    other_path: string;
    [key: string]: any;
  };
}

const GutCheckScreen: React.FC<GutCheckScreenProps> = ({ onComplete, decisionData }) => {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'undecided'>('undecided');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (option: 'A' | 'B' | 'undecided') => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedOption(option);
      setIsAnimating(false);
    }, 300);
  };

  const handleComplete = () => {
    console.log("GutCheckScreen - Completing with selection:", selectedOption);
    onComplete(selectedOption);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold mb-4">
        Gut Check: Which Path Feels Right?
      </h2>
      
      <p className="text-gray-600 mb-8">
        Now that you've reflected on both paths, listen to your gut.
        Which option are you leaning toward?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Path A */}
        <motion.div
          animate={selectedOption === 'A' ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card 
            className={`cursor-pointer hover:shadow-lg transition-all p-2 ${
              selectedOption === 'A' 
                ? 'ring-2 ring-[#3DFDFF] bg-gradient-to-r from-[#D5D5F1]/20 to-[#3DFDFF]/20' 
                : ''
            }`}
            onClick={() => handleSelect('A')}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🛣️</div>
              <h3 className="text-xl font-medium mb-2">Road A</h3>
              <p className="font-bold text-lg">{decisionData.consideration_path}</p>
              
              {selectedOption === 'A' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 flex justify-center"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3DFDFF] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Path B */}
        <motion.div
          animate={selectedOption === 'B' ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card 
            className={`cursor-pointer hover:shadow-lg transition-all p-2 ${
              selectedOption === 'B' 
                ? 'ring-2 ring-[#F5DF4D] bg-gradient-to-r from-[#3DFDFF]/20 to-[#F5DF4D]/20' 
                : ''
            }`}
            onClick={() => handleSelect('B')}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🪧</div>
              <h3 className="text-xl font-medium mb-2">Road B</h3>
              <p className="font-bold text-lg">{decisionData.other_path}</p>
              
              {selectedOption === 'B' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 flex justify-center"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F5DF4D] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Separator className="my-6" />
      
      {/* Still undecided option */}
      <Card 
        className={`cursor-pointer hover:shadow-lg transition-all p-2 mb-8 max-w-md mx-auto ${
          selectedOption === 'undecided' 
            ? 'ring-2 ring-[#FC68B3] bg-gradient-to-r from-[#FC68B3]/20 to-[#FF8A48]/20' 
            : ''
        }`}
        onClick={() => handleSelect('undecided')}
      >
        <CardContent className="p-4 text-center">
          <p className="text-lg">I'm still undecided</p>
          
          {selectedOption === 'undecided' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 flex justify-center"
            >
              <div className="w-6 h-6 rounded-full bg-[#FC68B3] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button 
          onClick={handleComplete}
          className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 px-8 py-2"
          disabled={isAnimating}
        >
          Complete My Decision Journey
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default GutCheckScreen;
