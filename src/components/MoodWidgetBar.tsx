import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, ThumbsUp, Heart, CloudRain, Zap, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import MoodButton from './mood/MoodButton';
import MoodDisplay from './mood/MoodDisplay';
import { getMoodColor, mapWidgetMoodToEnum } from '@/utils/moodUtils';

const MoodWidgetBar = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const { user } = useAuth();
  
  const moodOptions = [
    { icon: <Smile className="h-8 w-8 text-[#2AC20E]" />, name: 'Happy', color: '#2AC20E' },
    { icon: <Heart className="h-8 w-8 text-[#FC68B3]" />, name: 'Loved', color: '#FC68B3' },
    { icon: <Zap className="h-8 w-8 text-[#F5DF4D]" />, name: 'Excited', color: '#F5DF4D' },
    { icon: <ThumbsUp className="h-8 w-8 text-[#3DFDFF]" />, name: 'Good', color: '#3DFDFF' },
    { icon: <Meh className="h-8 w-8 text-[#D5D5F1]" />, name: 'Okay', color: '#D5D5F1' },
    { icon: <CloudRain className="h-8 w-8 text-[#5081D1]" />, name: 'Sad', color: '#5081D1' },
    { icon: <Frown className="h-8 w-8 text-[#FF8A48]" />, name: 'Awful', color: '#FF8A48' }
  ];

  const handleSelectMood = (mood: string) => {
    setSelectedMood(mood);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1500);
  };

  const handleSubmit = async () => {
    if (!selectedMood || !user) {
      toast({
        variant: "destructive",
        title: "Cannot record mood",
        description: user ? "Please select a mood first." : "You must be logged in to record your mood.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Saving mood to database:", selectedMood, "for user:", user.id);
      
      // First, save to the mood_widget_selections table
      const { error: widgetError } = await supabase
        .from('mood_widget_selections')
        .insert({
          user_id: user.id,
          mood: selectedMood
        });
        
      if (widgetError) {
        console.error('Error saving to mood_widget_selections:', widgetError);
        throw widgetError;
      }
      
      // Then, also save to the mood_data table with proper type conversion
      // Using the mapWidgetMoodToEnum function to ensure only valid enum values are used
      const enumMood = mapWidgetMoodToEnum(selectedMood);
      
      const { error } = await supabase
        .from('mood_data')
        .insert({
          user_id: user.id,
          mood: enumMood, // Now using the properly mapped enum value
          notes: `Mood recorded from widget: ${selectedMood}`,
          tags: [selectedMood]
        });
        
      if (error) {
        console.error('Error recording mood in mood_data:', error);
        throw error;
      }
      
      // Show success animation
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        // Reset selection after successful submission
        setSelectedMood('');
      }, 1500);
      
      toast({
        title: "Mood recorded!",
        description: `You're feeling ${selectedMood} today.`,
      });
      
    } catch (error: any) {
      console.error('Error recording mood:', error);
      toast({
        variant: "destructive",
        title: "Failed to record mood",
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // No longer need the old mapWidgetMoodToEnum function since we moved it to utils
  
  // Get the current mood color for styling
  const currentMoodColor = selectedMood ? getMoodColor(selectedMood) : 'transparent';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto rounded-xl p-6 mb-12 shadow-lg relative overflow-hidden"
        style={{
          background: selectedMood 
            ? `linear-gradient(135deg, ${currentMoodColor}20, ${currentMoodColor}40, white)`
            : 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.9))', 
          backdropFilter: 'blur(8px)',
          border: `1px solid ${selectedMood ? `${currentMoodColor}50` : 'rgba(255,255,255,0.3)'}`
        }}
      >
        {/* Animated sparkles when interaction happens */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div 
              className="absolute inset-0 pointer-events-none z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    scale: 0,
                    opacity: 1,
                    rotate: Math.random() * 360
                  }}
                  animate={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`, 
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: 0,
                    rotate: Math.random() * 360 + 180
                  }}
                  transition={{
                    duration: Math.random() * 1 + 0.5,
                    ease: 'easeOut'
                  }}
                >
                  <Sparkles 
                    className="h-6 w-6" 
                    style={{ color: currentMoodColor || '#FC68B3' }} 
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative wave background with mood color */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            className="absolute inset-x-0 bottom-0 h-32"
            style={{
              background: `linear-gradient(to top, ${currentMoodColor || '#3DFDFF'}10, transparent)`,
              opacity: selectedMood ? 1 : 0.3,
            }}
            animate={{
              y: [5, -5, 5],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute inset-x-0 top-0 h-32"
            style={{
              background: `linear-gradient(to bottom, ${currentMoodColor || '#FC68B3'}10, transparent)`,
              opacity: selectedMood ? 1 : 0.3,
            }}
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#000000] to-[#000000] bg-clip-text text-transparent">
            How are we feeling today?
          </h2>
          
          {!selectedMood ? (
            <div className="flex flex-wrap justify-center gap-4">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.name}
                  onClick={() => handleSelectMood(mood.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/80 shadow-md border border-white/50 w-24 transition-all duration-200"
                  style={{ boxShadow: `0 4px 12px ${mood.color}30` }}
                >
                  <div className="p-2 rounded-full bg-white shadow-sm mb-2">
                    {mood.icon}
                  </div>
                  <span className="text-sm font-medium">{mood.name}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MoodDisplay selectedMood={selectedMood} />
              
              <div className="flex space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood('')}
                  className="px-6 py-2 rounded-full bg-white/80 border border-gray-200 shadow-sm text-gray-700 font-medium"
                >
                  Change
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-full text-white font-medium shadow-md disabled:opacity-70"
                  style={{
                    background: `linear-gradient(to right, ${currentMoodColor || '#FC68B3'}, ${currentMoodColor || '#3DFDFF'})`
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Mood'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoodWidgetBar;
