
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import MoodMeter from '@/components/MoodMeter';
import { getMoodColor } from '@/utils/moodUtils';
import { motion } from 'framer-motion';

const MoodEntry = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [moodReason, setMoodReason] = useState('');
  const [moodFeeling, setMoodFeeling] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    setShowDetails(true);
  };

  const handleGoBack = () => {
    setShowDetails(false);
    setCurrentMood(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      <div className="relative z-10 min-h-[calc(100vh-4rem)]">
        <div className="flex h-full">
          {!showDetails ? (
            <div className="w-full h-[calc(100vh-4rem)]">
              <MoodMeter onMoodSelect={handleMoodSelect} />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full p-4"
              style={{
                background: `linear-gradient(135deg, ${getMoodColor(currentMood || 'neutral')} 0%, ${getMoodColor(currentMood || 'neutral')}99 100%)`
              }}
            >
              <div className="w-full max-w-md mx-auto bg-black/10 backdrop-blur-lg rounded-2xl p-6 mt-4">
                <div className="flex items-center mb-8">
                  <Button variant="ghost" size="icon" className="text-white" onClick={handleGoBack}>
                    <ChevronLeft className="h-6 w-6" />
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
                
                <h2 className="text-2xl text-white mb-4 font-medium text-center">
                  I'm feeling <span className="text-white font-bold">{currentMood}</span>
                </h2>
                
                <div className="mt-4 mb-6 space-y-4">
                  <h3 className="text-white/80 text-sm font-medium mb-2 text-center">What's contributing to these feelings?</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <MoodTag label="Physical or mental health" />
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
                
                <div className="mt-6 mb-4">
                  <Textarea 
                    placeholder="How are you feeling? (optional)" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]" 
                    value={moodFeeling} 
                    onChange={e => setMoodFeeling(e.target.value)} 
                  />
                </div>
                
                <div className="mt-10">
                  <p className="text-white/60 text-xs text-center mb-4">Your mood crew can see this</p>
                  
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white py-6">
                    Save mood
                  </Button>
                </div>
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
  <button className="px-4 py-2 rounded-full border border-white/30 text-white text-sm hover:bg-white/10 transition-colors">
    {label}
  </button>
);

export default MoodEntry;
