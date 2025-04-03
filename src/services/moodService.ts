
import { supabase, MoodEntry } from '@/utils/supabase';

// Get mood entries for a specific user
export const getUserMoods = async (userId: string): Promise<MoodEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user moods:', error);
    return [];
  }
};

// Get daily mood entries for a specific user
export const getDailyMoods = async (userId: string): Promise<MoodEntry[]> => {
  try {
    // Get the last 7 days of mood entries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching daily moods:', error);
    return [];
  }
};

// Get mood distribution for a specific user
export const getMoodDistribution = async (userId: string): Promise<{ name: string, value: number }[]> => {
  try {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('mood')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Count occurrences of each mood
    const moodCounts: Record<string, number> = {};
    
    (data || []).forEach((entry) => {
      const mood = entry.mood;
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    // Convert to array of objects
    return Object.entries(moodCounts).map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error('Error fetching mood distribution:', error);
    return [];
  }
};

// Save a new mood entry
export const saveMoodEntry = async (
  userId: string,
  mood: string,
  value: number,
  tags: string[],
  notes: string | null
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mood_entries')
      .insert([
        {
          user_id: userId,
          mood,
          value,
          tags,
          notes,
          created_at: new Date().toISOString(),
        },
      ]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return false;
  }
};

// Get monthly trend data
export const getMonthlyTrend = async (userId: string): Promise<{ week: string, average: number }[]> => {
  try {
    // This is a simplified approach; in a real app, you might want to do this calculation in SQL
    const { data, error } = await supabase
      .from('mood_entries')
      .select('created_at, value')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Group by week and calculate average
    const weeklyData: Record<string, { sum: number, count: number }> = {};
    
    (data || []).forEach((entry) => {
      const date = new Date(entry.created_at);
      const weekNumber = Math.floor(date.getDate() / 7) + 1;
      const monthName = date.toLocaleString('default', { month: 'short' });
      const weekKey = `${monthName} Week ${weekNumber}`;
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { sum: 0, count: 0 };
      }
      
      weeklyData[weekKey].sum += entry.value;
      weeklyData[weekKey].count += 1;
    });
    
    // Calculate averages and return formatted data
    return Object.entries(weeklyData)
      .map(([week, { sum, count }]) => ({
        week,
        average: Math.round((sum / count) * 10) / 10, // Round to 1 decimal place
      }))
      .slice(0, 4); // Last 4 weeks
  } catch (error) {
    console.error('Error fetching monthly trend:', error);
    return [];
  }
};
