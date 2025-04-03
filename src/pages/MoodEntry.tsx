
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
import { Card, CardContent } from '@/components/ui/card';

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
      {/* Common background with wavy animation for consistent design language */}
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
      
      {/* Consistent navbar */}
      <Navbar />
      
      <AnimatePresence mode="wait">
        {!showDetails ? (
          <motion.div
            key="mood-meter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full pt-16"
          >
            <MoodMeter onMoodSelect={handleMoodSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="mood-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <div className="relative z-10 container mx-auto px-4 py-20">
              <div className="flex justify-center items-center min-h-[80vh]">
                <Card className="w-full max-w-md bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 overflow-visible">
                  <CardContent className="p-6">
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
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20,
                            rotate: { duration: 1.5, ease: "easeInOut" }
                          }}
                          className="h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center" 
                          style={{
                            background: `radial-gradient(circle at center, ${getMoodColor(currentMood || 'neutral')}, ${getMoodColor(currentMood || 'neutral')}99)`,
                            boxShadow: `0 0 30px ${getMoodColor(currentMood || 'neutral')}66`
                          }}
                        >
                          <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
                        </motion.div>
                      </div>
                      
                      <div className="w-10"></div>
                    </div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl text-white mb-6 font-medium text-center"
                    >
                      I'm feeling <span 
                        className="font-bold"
                        style={{ color: getMoodColor(currentMood || 'neutral') }}
                      >{currentMood}</span>
                    </motion.h2>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 mb-6 space-y-4"
                    >
                      <h3 className="text-white/90 text-sm font-medium mb-3 text-center">What's contributing to these feelings?</h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <MoodTag 
                          label="Physical health" 
                          isSelected={selectedTags.includes("Physical health")}
                          onClick={() => toggleTag("Physical health")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="Mental health" 
                          isSelected={selectedTags.includes("Mental health")}
                          onClick={() => toggleTag("Mental health")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="Family" 
                          isSelected={selectedTags.includes("Family")}
                          onClick={() => toggleTag("Family")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="Hobbies" 
                          isSelected={selectedTags.includes("Hobbies")}
                          onClick={() => toggleTag("Hobbies")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="School" 
                          isSelected={selectedTags.includes("School")}
                          onClick={() => toggleTag("School")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="Friends" 
                          isSelected={selectedTags.includes("Friends")}
                          onClick={() => toggleTag("Friends")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="Love life" 
                          isSelected={selectedTags.includes("Love life")}
                          onClick={() => toggleTag("Love life")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="Body" 
                          isSelected={selectedTags.includes("Body")}
                          onClick={() => toggleTag("Body")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="Identity" 
                          isSelected={selectedTags.includes("Identity")}
                          onClick={() => toggleTag("Identity")}
                          mood={currentMood || 'neutral'}
                        />
                        <MoodTag 
                          label="Self confidence" 
                          isSelected={selectedTags.includes("Self confidence")}
                          onClick={() => toggleTag("Self confidence")}
                          mood={currentMood || 'neutral'}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8 mb-4"
                    >
                      <Textarea 
                        placeholder="How are you feeling? (optional)" 
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px] focus:border-opacity-100 transition-colors"
                        style={{ borderColor: `${getMoodColor(currentMood || 'neutral')}44` }}
                        value={moodFeeling} 
                        onChange={e => setMoodFeeling(e.target.value)} 
                      />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-10"
                    >
                      <p className="text-white/60 text-xs text-center mb-4">Your mood crew can see this</p>
                      
                      <Button 
                        className="w-full py-6 transition-all duration-300 relative overflow-hidden group"
                        style={{
                          background: `linear-gradient(135deg, ${getMoodColor(currentMood || 'neutral')}99, ${getMoodColor(currentMood || 'neutral')}66)`,
                        }}
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10 text-white font-medium">Save mood</span>
                      </Button>
                      
                      <div className="mt-4 flex justify-center">
                        <Link to="/dashboard" className="text-white/70 text-sm hover:text-white transition-colors">
                          Back to dashboard
                        </Link>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
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
  mood: string;
}

const MoodTag = ({ label, isSelected = false, onClick, mood }: MoodTagProps) => {
  const moodColor = getMoodColor(mood);
  return (
    <motion.button 
      whileHover={{ scale: isSelected ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-full border text-sm transition-all duration-300`}
      style={{
        borderColor: isSelected ? moodColor : `${moodColor}30`,
        backgroundColor: isSelected ? `${moodColor}20` : 'transparent',
        color: isSelected ? 'white' : `${moodColor}aa`
      }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};

export default MoodEntry;
