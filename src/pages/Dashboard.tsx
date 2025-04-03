
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { PlusCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import DailyMoodChart from '@/components/charts/DailyMoodChart';
import MoodDistributionChart from '@/components/charts/MoodDistributionChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Type definitions for mood data
interface MoodData {
  date: string;
  mood: string;
  value: number;
}

interface MoodDistribution {
  name: string;
  value: number;
}

interface WeeklyTrend {
  week: string;
  average: number;
}

const Dashboard = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<MoodDistribution[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
    }
  }, [session, navigate]);

  useEffect(() => {
    if (user) {
      fetchMoodData();
    }
  }, [user]);

  // Fetch mood data from Supabase
  const fetchMoodData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent mood entries
      const { data: moodEntries, error } = await supabase
        .from('mood_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(7);
      
      if (error) throw error;
      
      if (moodEntries && moodEntries.length > 0) {
        // Process data for charts
        const dailyData = moodEntries.map(entry => ({
          date: new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
          mood: entry.mood,
          value: entry.mood_value
        })).reverse();
        
        // Calculate mood distribution
        const distribution: Record<string, number> = {};
        moodEntries.forEach(entry => {
          if (distribution[entry.mood]) {
            distribution[entry.mood]++;
          } else {
            distribution[entry.mood] = 1;
          }
        });
        
        const distributionData = Object.entries(distribution).map(([name, count]) => {
          const percentage = Math.round((count / moodEntries.length) * 100);
          return { name, value: percentage };
        });
        
        // Calculate weekly averages (using the available data)
        // In a real app, you'd want to query data for a longer period and group by week
        const weeklyAverages = [
          { week: 'This Week', average: calculateAverageMood(moodEntries) }
        ];
        
        // Last week could be approximated or fetched separately in a real app
        // For now, we'll just add some simulated data for visualization purposes
        if (moodEntries.length > 0) {
          const currentAvg = calculateAverageMood(moodEntries);
          weeklyAverages.push({ week: 'Last Week', average: Math.max(1, Math.min(10, currentAvg + (Math.random() * 2 - 1))) });
          weeklyAverages.push({ week: '2 Weeks Ago', average: Math.max(1, Math.min(10, currentAvg + (Math.random() * 2 - 1))) });
          weeklyAverages.push({ week: '3 Weeks Ago', average: Math.max(1, Math.min(10, currentAvg + (Math.random() * 2 - 1))) });
        }
        
        setMoodData(dailyData);
        setMoodDistribution(distributionData);
        setWeeklyTrend(weeklyAverages);
      } else {
        // If no data, set empty arrays
        setMoodData([]);
        setMoodDistribution([]);
        setWeeklyTrend([]);
      }
    } catch (err) {
      console.error('Error fetching mood data:', err);
      toast({
        variant: "destructive",
        title: "Failed to load data",
        description: "There was an error loading your mood data.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to calculate average mood value
  const calculateAverageMood = (entries: any[]) => {
    if (entries.length === 0) return 5;
    const sum = entries.reduce((acc, entry) => acc + entry.mood_value, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Guard clause for unauthenticated users
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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
      
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Your Mood Dashboard</h1>
              <p className="text-white/70 mt-2">Welcome back, {user.email}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/mood-entry">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white">
                  <PlusCircle size={18} />
                  <span>New Mood Entry</span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-white/20 text-white/90 hover:bg-white/10" 
                onClick={handleSignOut}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-white/70 text-lg">Loading your mood data...</div>
            </div>
          ) : moodData.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-8 my-8">
              <div className="text-white text-lg mb-6 text-center">
                You haven't recorded any moods yet. Start tracking your emotional well-being today!
              </div>
              <Link to="/mood-entry">
                <Button className="bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white">
                  Record Your First Mood
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Daily Mood Chart */}
              <DailyMoodChart moodData={moodData} />
              
              {/* Mood Distribution Pie Chart */}
              <MoodDistributionChart moodDistribution={moodDistribution} />
              
              {/* Monthly Trend Chart */}
              <MonthlyTrendChart weeklyTrend={weeklyTrend} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
