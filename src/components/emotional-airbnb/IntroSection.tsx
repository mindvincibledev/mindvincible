
import React from 'react';
import { Brain, Heart, MessageCircle } from 'lucide-react';

const IntroSection = () => {
  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent text-center">
        Welcome to Emotional Airbnb
      </h2>
      
      <div className="space-y-4 text-center">
        <p className="text-gray-700">
          Emotional Airbnb is a guided exercise to help you explore, understand, and process your emotions in a creative way.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
          <div className="bg-white/80 p-4 rounded-lg shadow-sm flex flex-col items-center gap-2">
            <div className="p-2 bg-[#FF8A48]/10 rounded-full">
              <Heart className="h-6 w-6 text-[#FF8A48]" />
            </div>
            <h3 className="font-medium">Identify</h3>
            <p className="text-sm text-gray-600">Recognize your emotions and where you feel them</p>
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg shadow-sm flex flex-col items-center gap-2">
            <div className="p-2 bg-[#3DFDFF]/10 rounded-full">
              <Brain className="h-6 w-6 text-[#3DFDFF]" />
            </div>
            <h3 className="font-medium">Explore</h3>
            <p className="text-sm text-gray-600">Examine their characteristics and intensity</p>
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg shadow-sm flex flex-col items-center gap-2">
            <div className="p-2 bg-[#FC68B3]/10 rounded-full">
              <MessageCircle className="h-6 w-6 text-[#FC68B3]" />
            </div>
            <h3 className="font-medium">Listen</h3>
            <p className="text-sm text-gray-600">Understand what your emotions are trying to tell you</p>
          </div>
        </div>
      </div>
      
      <div className="bg-[#F5DF4D]/10 p-4 rounded-lg border border-[#F5DF4D]/20">
        <h3 className="font-medium text-center mb-2">How It Works</h3>
        <p className="text-sm text-gray-700">
          You'll go through 5 simple questions about your emotion. For each question, you can choose
          to respond with text, a drawing, or both. Your answers will be saved at the end, allowing you
          to reflect on them later.
        </p>
      </div>
      
      <p className="text-center text-sm text-gray-500 italic">
        Click 'Start' when you're ready to begin your emotional journey.
      </p>
    </div>
  );
};

export default IntroSection;
