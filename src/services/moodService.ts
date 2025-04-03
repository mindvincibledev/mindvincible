
import { supabase } from '@/integrations/supabase/client';

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: string;
  value: number;
  notes?: string;
  tags?: string[];
  created_at: string;
};

export type MoodDistributionItem = {
  name: string;
  value: number;
};

export type MoodTrendItem = {
  week: string;
  average: number;
};

export type DailyMoodItem = {
  date: string;
  mood: string;
  value: number;
};

// Fetch all mood entries for the current user
export const fetchUserMoods = async (): Promise<MoodEntry[]> => {
  // Use type assertion to bypass TypeScript's strict typing
  const { data, error } = await (supabase
    .from('mood_entries') as any)
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching moods:', error);
    throw error;
  }
  
  return data || [];
};

// Get daily mood data for chart display
export const getDailyMoodData = async (): Promise<DailyMoodItem[]> => {
  const moods = await fetchUserMoods();
  
  // Get the 7 most recent entries
  const recentMoods = moods.slice(0, 7).reverse();
  
  return recentMoods.map(mood => {
    const date = new Date(mood.created_at);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      mood: mood.mood,
      value: mood.value
    };
  });
};

// Get mood distribution data
export const getMoodDistribution = async (): Promise<MoodDistributionItem[]> => {
  const moods = await fetchUserMoods();
  
  // Count occurrences of each mood
  const moodCounts: Record<string, number> = {};
  
  moods.forEach(mood => {
    if (moodCounts[mood.mood]) {
      moodCounts[mood.mood]++;
    } else {
      moodCounts[mood.mood] = 1;
    }
  });
  
  // Convert to array format needed for chart
  return Object.entries(moodCounts).map(([name, value]) => ({
    name,
    value
  }));
};

// Get weekly mood trend data
export const getWeeklyTrend = async (): Promise<MoodTrendItem[]> => {
  const moods = await fetchUserMoods();
  
  // Group moods by week
  const weeklyMoods: Record<string, number[]> = {};
  
  moods.forEach(mood => {
    const date = new Date(mood.created_at);
    const weekNum = getWeekNumber(date);
    const weekKey = `Week ${weekNum}`;
    
    if (weeklyMoods[weekKey]) {
      weeklyMoods[weekKey].push(mood.value);
    } else {
      weeklyMoods[weekKey] = [mood.value];
    }
  });
  
  // Calculate average for each week
  return Object.entries(weeklyMoods).map(([week, values]) => {
    const sum = values.reduce((a, b) => a + b, 0);
    const average = Math.round((sum / values.length) * 10) / 10; // Round to 1 decimal
    
    return {
      week,
      average
    };
  }).slice(0, 4);
};

// Helper function to get week number
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
