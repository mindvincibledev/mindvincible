
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import MoodMeter from '@/components/MoodMeter';
import { getMoodColor } from '@/utils/moodUtils';
import { motion, AnimatePresence } from 'framer-motion';

const MoodEntry = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [moodReason, setMoodReason] = useState('');
  const [moodFeeling, setMoodFeeling] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    setShowDetails(true);
  };

  const handleGoBack = () => {
    setShowDetails(false);
    setCurrentMood(null);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!showDetails ? (
          <motion.div
            key="mood-meter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <MoodMeter onMoodSelect={handleMoodSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="mood-details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
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
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-full max-w-md bg-black/40 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10"
                >
                  <div className="flex items-center mb-8">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/10" 
                      onClick={handleGoBack}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div className="flex-1 text-center">
                      <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center" 
                        style={{
                          background: `radial-gradient(circle at center, ${getMoodColor(currentMood || 'neutral')}, ${getMoodColor(currentMood || 'neutral')}99)`,
                          boxShadow: `0 0 30px ${getMoodColor(currentMood || 'neutral')}66`
                        }}
                      >
                        <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
                      </motion.div>
                    </div>
                    <div className="w-10"></div> {/* For balance */}
                  </div>
                  
                  <h2 className="text-2xl text-white mb-6 font-medium text-center">
                    I'm feeling <span 
                      className="font-bold"
                      style={{ color: getMoodColor(currentMood || 'neutral') }}
                    >{currentMood}</span>
                  </h2>
                  
                  <div className="mt-6 mb-6 space-y-4">
                    <h3 className="text-white/90 text-sm font-medium mb-3 text-center">What's contributing to these feelings?</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <MoodTag 
                        label="Physical health" 
                        isSelected={selectedTags.includes("Physical health")}
                        onClick={() => toggleTag("Physical health")}
                      />
                      <MoodTag 
                        label="Mental health" 
                        isSelected={selectedTags.includes("Mental health")}
                        onClick={() => toggleTag("Mental health")}
                      />
                      <MoodTag 
                        label="Family" 
                        isSelected={selectedTags.includes("Family")}
                        onClick={() => toggleTag("Family")}
                      />
                      <MoodTag 
                        label="Hobbies" 
                        isSelected={selectedTags.includes("Hobbies")}
                        onClick={() => toggleTag("Hobbies")}
                      />
                      <MoodTag 
                        label="School" 
                        isSelected={selectedTags.includes("School")}
                        onClick={() => toggleTag("School")}
                      />
                      <MoodTag 
                        label="Friends" 
                        isSelected={selectedTags.includes("Friends")}
                        onClick={() => toggleTag("Friends")}
                      />
                      <MoodTag 
                        label="Love life" 
                        isSelected={selectedTags.includes("Love life")}
                        onClick={() => toggleTag("Love life")}
                      />
                      <MoodTag 
                        label="Body" 
                        isSelected={selectedTags.includes("Body")}
                        onClick={() => toggleTag("Body")}
                      />
                      <MoodTag 
                        label="Identity" 
                        isSelected={selectedTags.includes("Identity")}
                        onClick={() => toggleTag("Identity")}
                      />
                      <MoodTag 
                        label="Self confidence" 
                        isSelected={selectedTags.includes("Self confidence")}
                        onClick={() => toggleTag("Self confidence")}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 mb-4">
                    <Textarea 
                      placeholder="How are you feeling? (optional)" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px] focus:border-purple-400 transition-colors" 
                      value={moodFeeling} 
                      onChange={e => setMoodFeeling(e.target.value)} 
                    />
                  </div>
                  
                  <div className="mt-10">
                    <p className="text-white/60 text-xs text-center mb-4">Your mood crew can see this</p>
                    
                    <Button 
                      className="w-full py-6 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${getMoodColor(currentMood || 'neutral')}99, ${getMoodColor(currentMood || 'neutral')}66)`,
                        borderColor: `${getMoodColor(currentMood || 'neutral')}33`,
                        color: 'white'
                      }}
                    >
                      Save mood
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper component for mood-related tags
interface MoodTagProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const MoodTag = ({ label, isSelected = false, onClick }: MoodTagProps) => (
  <button 
    className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
      isSelected 
        ? 'border-purple-500 bg-purple-500/20 text-purple-100' 
        : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default MoodEntry;
