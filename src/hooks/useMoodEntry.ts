
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export const useMoodEntry = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [moodReason, setMoodReason] = useState('');
  const [moodFeeling, setMoodFeeling] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const getMoodValue = (mood: string): number => {
    const moodValues: Record<string, number> = {
      'Happy': 8,
      'Excited': 9,
      'Calm': 7,
      'Sad': 3,
      'Angry': 2,
      'Anxious': 4,
      'Overwhelmed': 3,
      'neutral': 5
    };
    return moodValues[mood] || 5;
  };

  const saveMood = async () => {
    if (!currentMood || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const moodEntry = {
        user_id: user.id,
        mood: currentMood,
        value: getMoodValue(currentMood),
        notes: moodFeeling,
        tags: selectedTags
      };
      
      // Use type assertion to bypass TypeScript's strict typing
      const { data, error } = await (supabase
        .from('mood_entries') as any)
        .insert([moodEntry]);
        
      if (error) throw error;
      
      toast({
        title: "Mood saved",
        description: "Your mood has been recorded successfully",
      });
      
      // Reset form and navigate to dashboard
      resetForm();
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error saving mood:', error);
      toast({
        title: "Failed to save mood",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setCurrentMood(null);
    setMoodReason('');
    setMoodFeeling('');
    setShowDetails(false);
    setSelectedTags([]);
  };

  return {
    currentMood,
    moodReason,
    moodFeeling,
    showDetails,
    selectedTags,
    isSubmitting,
    setMoodReason,
    setMoodFeeling,
    handleMoodSelect,
    handleGoBack,
    toggleTag,
    saveMood
  };
};
