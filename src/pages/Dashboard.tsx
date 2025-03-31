
import React, { useState } from 'react';
import { WavyBackground } from '@/components/ui/wavy-background';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import MoodMeter from '@/components/MoodMeter';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [contributingFactors, setContributingFactors] = useState<string[]>([]);
  const [moodReason, setMoodReason] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleMoodSelect = (mood: string, factors: string[]) => {
    setCurrentMood(mood);
    setContributingFactors(factors);
    setShowDetails(true);
  };

  const handleGoBack = () => {
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <WavyBackground 
          colors={["#FF8A48", "#D5D5F1", "#3DFDFF", "#F5DF4D", "#FC68B3", "#2AC20E"]} 
          waveWidth={100} 
          backgroundFill="black" 
          blur={10} 
          speed="fast" 
          waveOpacity={0.5} 
          className="w-full h-full" 
        />
      </div>
      
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex justify-center items-center min-h-[80vh]">
          {!showDetails ? (
            <MoodMeter onMoodSelect={handleMoodSelect} />
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-black/40 backdrop-blur-lg rounded-2xl p-6"
            >
              <div className="flex items-center mb-8">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white" 
                  onClick={handleGoBack}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
                <div className="flex-1 text-center">
                  <div 
                    className="h-20 w-20 rounded-full mx-auto mb-4"
                    style={{ 
                      background: getMoodColor(currentMood || 'neutral'),
                      boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                    }}
                  ></div>
                </div>
                <div className="w-10"></div> {/* For balance */}
              </div>
              
              <h2 className="text-2xl text-white mb-2 font-medium text-center">
                I'm feeling <span className="text-[#FF8A48] font-bold">{currentMood}</span>
              </h2>
              
              {contributingFactors.length > 0 && (
                <div className="mt-4 mb-6">
                  <h3 className="text-white/80 text-sm font-medium mb-2">Contributing factors:</h3>
                  <div className="flex flex-wrap gap-2">
                    {contributingFactors.map(factor => (
                      <span key={factor} className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 mb-4">
                <Input 
                  type="text" 
                  placeholder="Because..." 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  value={moodReason}
                  onChange={(e) => setMoodReason(e.target.value)}
                />
                <p className="text-white/60 text-xs text-center mt-2">Your mood crew can see this</p>
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-white/80 text-sm font-medium mb-2">Add more details:</h3>
                <div className="flex flex-wrap gap-2">
                  <MoodTag label="Physical health" />
                  <MoodTag label="Family" />
                  <MoodTag label="Hobbies" />
                  <MoodTag label="School" />
                  <MoodTag label="Friends" />
                  <MoodTag label="Love life" />
                  <MoodTag label="Body" />
                  <MoodTag label="Identity" />
                  <MoodTag label="Self confidence" />
                  <MoodTag label="Loneliness" />
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-purple-300 text-xl font-bold mb-2">Add a note</h3>
                <p className="text-white/60 text-xs mb-4">Only you can see this</p>
                
                <div className="flex space-x-4 mb-6">
                  <Button className="bg-purple-700 hover:bg-purple-800 text-white flex-1">
                    Guided Questions
                  </Button>
                  <Button variant="outline" className="border-purple-700 text-purple-300 flex-1">
                    Venting Space
                  </Button>
                </div>
                
                <Button className="w-full bg-purple-100/20 hover:bg-purple-100/30 text-purple-200 py-6">
                  Finish check-in
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for mood-related tags
const MoodTag = ({ label }: { label: string }) => (
  <button className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/10 transition-colors">
    {label}
  </button>
);

// Helper function to get color based on mood
const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    'Happy': 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    'Excited': 'linear-gradient(135deg, #FF9800, #FF5722)',
    'Neutral': 'linear-gradient(135deg, #FFC107, #FFEB3B)',
    'Angry': 'linear-gradient(135deg, #F44336, #E91E63)',
    'Sad': 'linear-gradient(135deg, #2196F3, #03A9F4)',
    'neutral': 'linear-gradient(135deg, #9E9E9E, #607D8B)'
  };
  
  return moodColors[mood] || moodColors.neutral;
};

export default Dashboard;
