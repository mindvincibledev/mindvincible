
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { MoodEntry, MoodDistributionData, MoodTrendData, DailyMoodData } from '@/types/mood';

export const useMoodData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [dailyMoodData, setDailyMoodData] = useState<DailyMoodData[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<MoodDistributionData[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<MoodTrendData[]>([]);

  // Fetch all mood entries for the current user
  const fetchMoodEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMoodEntries(data || []);
      processData(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching mood data');
    } finally {
      setLoading(false);
    }
  };

  // Save a new mood entry
  const saveMoodEntry = async (mood: string, intensity: number, notes?: string, tags?: string[]) => {
    if (!user) return null;
    
    try {
      const newEntry = {
        user_id: user.id,
        mood,
        intensity,
        notes,
        tags,
        created_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('mood_entries')
        .insert([newEntry])
        .select();
      
      if (error) throw error;
      
      toast.success('Mood saved successfully!');
      await fetchMoodEntries(); // Refresh data
      return data?.[0];
    } catch (error: any) {
      toast.error(error.message || 'Error saving mood');
      return null;
    }
  };

  // Process mood data for charts
  const processData = (entries: MoodEntry[]) => {
    if (entries.length === 0) {
      setDailyMoodData([]);
      setMoodDistribution([]);
      setWeeklyTrend([]);
      return;
    }

    // Process daily mood data (last 7 days)
    const last7Days = entries
      .slice(0, 7)
      .map(entry => ({
        date: new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: entry.mood,
        value: entry.intensity
      }));
    setDailyMoodData(last7Days);

    // Process mood distribution
    const distribution: Record<string, number> = {};
    entries.forEach(entry => {
      if (distribution[entry.mood]) {
        distribution[entry.mood]++;
      } else {
        distribution[entry.mood] = 1;
      }
    });
    const distributionData = Object.entries(distribution).map(([name, value]) => ({
      name,
      value
    }));
    setMoodDistribution(distributionData);

    // Process weekly trends
    // Group entries by week and calculate average intensity
    const weekMap: Record<string, number[]> = {};
    entries.forEach(entry => {
      const date = new Date(entry.created_at);
      const weekNum = `Week ${Math.ceil((date.getDate()) / 7)}`;
      
      if (!weekMap[weekNum]) {
        weekMap[weekNum] = [];
      }
      weekMap[weekNum].push(entry.intensity);
    });

    const weeklyData = Object.entries(weekMap).map(([week, intensities]) => ({
      week,
      average: intensities.reduce((sum, val) => sum + val, 0) / intensities.length
    }));
    setWeeklyTrend(weeklyData.slice(0, 4)); // Last 4 weeks
  };

  // Fetch data when user changes or on mount
  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  return {
    moodEntries,
    dailyMoodData,
    moodDistribution,
    weeklyTrend,
    loading,
    saveMoodEntry,
    refreshData: fetchMoodEntries
  };
};
