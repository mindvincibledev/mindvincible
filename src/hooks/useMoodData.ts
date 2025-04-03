
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

interface Mood {
  id: string;
  mood_type: string;
  mood_value: number;
  tags: string[];
  notes: string;
  created_at: string;
}

interface UseMoodDataResult {
  moodData: Mood[];
  moodDistribution: { name: string; value: number }[];
  weeklyTrend: { week: string; average: number }[];
  isLoading: boolean;
  error: Error | null;
  saveMood: (mood: string, value: number, tags: string[], notes: string) => Promise<void>;
}

export const useMoodData = (): UseMoodDataResult => {
  const [moodData, setMoodData] = useState<Mood[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Transform raw mood data into chart formats
  const moodDistribution = calculateMoodDistribution(moodData);
  const weeklyTrend = calculateWeeklyTrend(moodData);

  // Fetch mood data from Supabase
  useEffect(() => {
    const fetchMoodData = async () => {
      if (!user) {
        setMoodData([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('moods')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setMoodData(data || []);
      } catch (error: any) {
        console.error('Error fetching mood data:', error);
        setError(error);
        toast.error('Failed to load mood data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
  }, [user]);

  // Save a new mood entry
  const saveMood = async (mood: string, value: number, tags: string[], notes: string) => {
    if (!user) {
      toast.error('You must be logged in to save moods');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('moods')
        .insert({
          user_id: user.id,
          mood_type: mood,
          mood_value: value,
          tags,
          notes,
        });

      if (error) throw error;
      
      toast.success('Mood saved successfully!');
      
      // Refresh data
      const { data, error: fetchError } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      setMoodData(data || []);
      
    } catch (error: any) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save mood');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    moodData,
    moodDistribution,
    weeklyTrend,
    isLoading,
    error,
    saveMood,
  };
};

// Helper function to calculate mood distribution for pie chart
function calculateMoodDistribution(moodData: Mood[]): { name: string; value: number }[] {
  const distribution: Record<string, number> = {};
  
  moodData.forEach(entry => {
    if (distribution[entry.mood_type]) {
      distribution[entry.mood_type]++;
    } else {
      distribution[entry.mood_type] = 1;
    }
  });
  
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0) || 1;
  
  return Object.entries(distribution).map(([name, count]) => ({
    name,
    value: Math.round((count / total) * 100)
  }));
}

// Helper function to calculate weekly mood trends
function calculateWeeklyTrend(moodData: Mood[]): { week: string; average: number }[] {
  if (moodData.length === 0) {
    return [
      { week: 'Week 1', average: 0 },
      { week: 'Week 2', average: 0 },
      { week: 'Week 3', average: 0 },
      { week: 'Week 4', average: 0 },
    ];
  }
  
  // Group by week
  const now = new Date();
  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  
  const weeks: { [key: string]: number[] } = {
    'Week 1': [],
    'Week 2': [],
    'Week 3': [],
    'Week 4': [],
  };
  
  moodData.forEach(entry => {
    const entryDate = new Date(entry.created_at);
    const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      weeks['Week 4'].push(entry.mood_value);
    } else if (daysDiff <= 14) {
      weeks['Week 3'].push(entry.mood_value);
    } else if (daysDiff <= 21) {
      weeks['Week 2'].push(entry.mood_value);
    } else if (daysDiff <= 28) {
      weeks['Week 1'].push(entry.mood_value);
    }
  });
  
  return Object.entries(weeks).map(([week, values]) => ({
    week,
    average: values.length ? 
      Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 
      0
  }));
}
