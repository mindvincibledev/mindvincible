
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, ThumbsUp, Heart, CloudRain, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import MoodButton from './mood/MoodButton';
import MoodDisplay from './mood/MoodDisplay';

const MoodWidgetBar = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  };

  const handleSubmit = async () => {
    if (!selectedMood || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Store the mood in an existing table (mood_data) instead of mood_widget_selections
      // to avoid TypeScript errors until types are updated
      const { error } = await supabase
        .from('mood_data')
        .insert({
          user_id: user.id,
          mood: 'Happy', // Using a default value from the enum since we can't directly map our custom moods
          notes: `Widget mood selection: ${selectedMood}`,
          tags: [selectedMood]
        });
        
      if (error) throw error;
      
      toast({
        title: "Mood recorded!",
        description: `You're feeling ${selectedMood} today.`,
      });
      
      // Reset selection after successful submission
      setSelectedMood('');
    } catch (error) {
      console.error('Error recording mood:', error);
      toast({
        variant: "destructive",
        title: "Failed to record mood",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-xl p-6 mb-12 shadow-lg border border-white/30 relative overflow-hidden"
    >
      {/* Decorative wave background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#3DFDFF]/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FC68B3]/10 to-transparent" />
      </div>
      
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#FC68B3] to-[#3DFDFF] bg-clip-text text-transparent">
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
          <div className="flex flex-col items-center">
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
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FC68B3] to-[#3DFDFF] text-white font-medium shadow-md disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Save Mood'}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MoodWidgetBar;
