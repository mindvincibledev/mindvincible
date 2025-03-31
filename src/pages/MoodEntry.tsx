
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import MoodMeter from '@/components/MoodMeter';
import { getMoodColor } from '@/utils/moodUtils';

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {!showDetails && (
        <MoodMeter onMoodSelect={handleMoodSelect} />
      )}
      
      {showDetails && (
        <>
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
              <div className="w-full max-w-md bg-black/40 backdrop-blur-lg rounded-2xl p-6 animate-fade-in">
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
                  I'm feeling <span className="text-[#FF8A48] font-bold">{currentMood}</span>
                </h2>
                
                <div className="mt-4 mb-6 space-y-4">
                  <h3 className="text-white/80 text-sm font-medium mb-2 text-center">What's contributing to these feelings?</h3>
                  <div className="flex flex-wrap gap-2">
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
                  
                  <Button className="w-full bg-purple-100/20 hover:bg-purple-100/30 text-purple-200 py-6">
                    Save mood
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper component for mood-related tags
const MoodTag = ({ label }: { label: string }) => (
  <button className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/10 transition-colors">
    {label}
  </button>
);

export default MoodEntry;
