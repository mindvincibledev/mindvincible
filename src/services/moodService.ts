
import { supabase, MoodEntry } from '../lib/supabase';

export const moodValues: Record<string, number> = {
  'Happy': 8,
  'Excited': 9,
  'Calm': 7,
  'Sad': 3,
  'Angry': 2,
  'Anxious': 4,
  'Overwhelmed': 3,
  'neutral': 5
};

// Save a new mood entry
export const saveMoodEntry = async (
  mood: string,
  tags: string[] = [],
  notes: string = ''
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('mood_entries')
    .insert({
      user_id: user.id,
      mood,
      value: moodValues[mood] || 5,
      tags,
      notes,
      created_at: new Date().toISOString()
    })
    .select();
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Get mood entries for current user (last 7 days by default)
export const getUserMoodEntries = async (days: number = 7) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });
    
  if (error) {
    throw error;
  }
  
  return data as MoodEntry[];
};

// Get mood distribution for current user
export const getMoodDistribution = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood')
    .eq('user_id', user.id);
    
  if (error) {
    throw error;
  }
  
  const distribution: Record<string, number> = {};
  (data as MoodEntry[]).forEach(entry => {
    distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
  });
  
  // Convert to the expected format
  const result = Object.keys(distribution).map(mood => ({
    name: mood,
    value: distribution[mood]
  }));
  
  return result;
};

// Get weekly trend for current user (last 4 weeks)
export const getWeeklyTrend = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28); // Last 4 weeks
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('created_at, value')
    .eq('user_id', user.id)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });
    
  if (error) {
    throw error;
  }
  
  // Group by week
  const weeklyData: Record<string, number[]> = {};
  (data as MoodEntry[]).forEach(entry => {
    const date = new Date(entry.created_at);
    const weekNumber = Math.floor((date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const weekLabel = `Week ${weekNumber + 1}`;
    
    if (!weeklyData[weekLabel]) {
      weeklyData[weekLabel] = [];
    }
    
    weeklyData[weekLabel].push(entry.value);
  });
  
  // Calculate averages
  const result = Object.keys(weeklyData).map(week => ({
    week,
    average: parseFloat((weeklyData[week].reduce((sum, val) => sum + val, 0) / weeklyData[week].length).toFixed(1))
  }));
  
  return result;
};

// Process mood data for daily chart
export const processDailyMoodData = (entries: MoodEntry[]) => {
  // Create a map for the last 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dayName = days[date.getDay()];
    
    // Find entries for this day
    const dayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate.getDate() === date.getDate() &&
             entryDate.getMonth() === date.getMonth() &&
             entryDate.getFullYear() === date.getFullYear();
    });
    
    if (dayEntries.length > 0) {
      // Use the most recent entry for that day
      const latestEntry = dayEntries[dayEntries.length - 1];
      result.push({
        date: dayName,
        mood: latestEntry.mood,
        value: latestEntry.value
      });
    } else {
      // No entry for this day
      result.push({
        date: dayName,
        mood: 'neutral',
        value: 0
      });
    }
  }
  
  return result;
};
