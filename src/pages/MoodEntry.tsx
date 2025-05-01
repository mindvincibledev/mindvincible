
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import MoodMeter from '@/components/MoodMeter';
import { getMoodColor } from '@/utils/moodUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';

type MoodType = Database['public']['Enums']['mood_type'];

const MoodEntry = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [moodReason, setMoodReason] = useState('');
  const [moodFeeling, setMoodFeeling] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isRequestingCheckIn, setIsRequestingCheckIn] = useState(false);
  
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
    }
  }, [session, navigate]);

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

  const handleSaveMood = async () => {
    if (!currentMood || !user) return;
    
    try {
      setIsSaving(true);
      
      const now = new Date();
      const currentTime = now.toTimeString().split(' ')[0]; // Format: HH:MM:SS
      
      console.log('Saving mood data:', {
        user_id: user.id,
        mood: currentMood,
        notes: moodFeeling,
        tags: selectedTags,
        time_of_day: currentTime
      });
      
      const { error } = await supabase
        .from('mood_data')
        .insert({
          user_id: user.id, // This is required by RLS
          mood: currentMood as MoodType,
          notes: moodFeeling,
          tags: selectedTags.length > 0 ? selectedTags : null,
          time_of_day: currentTime
        });
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      toast({
        title: "Mood saved!",
        description: "Your mood has been recorded successfully.",
      });
      
      // Updated to navigate to home page instead of dashboard
      navigate('/home');
      
    } catch (err) {
      console.error('Error saving mood:', err);
      toast({
        variant: "destructive",
        title: "Failed to save mood",
        description: "There was an error saving your mood. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle the check-in request
  const handleCheckInRequest = async () => {
    if (!user) return;
    
    try {
      setIsRequestingCheckIn(true);
      
      console.log('Requesting check-in for user:', user.id);
      
      // Use the supabase.functions.invoke method instead of direct fetch
      const { data, error } = await supabase.functions.invoke('check-in-request', {
        body: {
          userId: user.id,
          userName: user.name,
          userEmail: user.email
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to request check-in');
      }
      
      toast({
        title: "Check-in requested",
        description: "A notification has been sent to our team. Someone will reach out to you soon.",
        duration: 6000,
      });
      
    } catch (err) {
      console.error('Error requesting check-in:', err);
      toast({
        variant: "destructive",
        title: "Failed to request check-in",
        description: "There was an error sending your check-in request. Please try again or contact support.",
        duration: 6000,
      });
    } finally {
      setIsRequestingCheckIn(false);
    }
  };

  // Guard clause for unauthenticated users
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
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
                  <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-visible">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-8">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-700 hover:bg-gray-100" 
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
                              boxShadow: `0 0 30px ${getMoodColor(currentMood || 'neutral')}aa`
                            }}
                          >
                            <div className="h-16 w-16 rounded-full bg-white/70 backdrop-blur-sm"></div>
                          </motion.div>
                        </div>
                        
                        <div className="w-10"></div>
                      </div>
                      
                      <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl text-black mb-6 font-medium text-center"
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
                        <h3 className="text-gray-800 text-sm font-medium mb-3 text-center">What's contributing to these feelings?</h3>
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
                          className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 min-h-[100px] focus:border-opacity-100 transition-colors"
                          style={{ borderColor: `${getMoodColor(currentMood || 'neutral')}80` }}
                          value={moodFeeling} 
                          onChange={e => setMoodFeeling(e.target.value)} 
                        />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6"
                      >
                        {/* Check-in request button */}
                        <Button
                          variant="outline"
                          className="w-full mb-4 py-3 text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                          onClick={handleCheckInRequest}
                          disabled={isRequestingCheckIn}
                        >
                          <AlertCircle className="h-5 w-5" />
                          <span>
                            {isRequestingCheckIn ? "Sending request..." : "I'd like to be checked in on"}
                          </span>
                        </Button>

                        <Button 
                          className="w-full py-6 transition-all duration-300 relative overflow-hidden group"
                          style={{
                            background: `linear-gradient(135deg, ${getMoodColor(currentMood || 'neutral')}, ${getMoodColor(currentMood || 'neutral')}cc)`,
                            color: currentMood === 'Happy' || currentMood === 'Surprised' ? '#000000' : '#FFFFFF'
                          }}
                          onClick={handleSaveMood}
                          disabled={isSaving}
                        >
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <span className="relative z-10 font-medium text-lg">
                            {isSaving ? 'Saving...' : 'Save mood'}
                          </span>
                        </Button>
                        
                        <div className="mt-4 flex justify-center">
                          <Link to="/dashboard" className="text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors">
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
    </BackgroundWithEmojis>
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
      className={`px-4 py-2 rounded-full border-2 text-sm transition-all duration-300 font-medium`}
      style={{
        borderColor: isSelected ? moodColor : `${moodColor}60`,
        backgroundColor: isSelected ? `${moodColor}40` : 'transparent',
        color: isSelected ? 'black' : '#444444',
        boxShadow: isSelected ? `0 0 8px ${moodColor}50` : 'none'
      }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};

export default MoodEntry;
