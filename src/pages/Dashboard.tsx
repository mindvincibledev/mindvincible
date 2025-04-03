
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import DailyMoodChart from '@/components/charts/DailyMoodChart';
import MoodDistributionChart from '@/components/charts/MoodDistributionChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import { useAuth } from '@/context/AuthContext';
import { getUserMoods, getMoodDistribution, getMonthlyTrend } from '@/services/moodService';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<any[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<any[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch all user mood data
        const moods = await getUserMoods(user.id);
        
        // Format daily mood data
        const formattedMoods = moods.slice(0, 7).map(mood => {
          const date = new Date(mood.created_at);
          return {
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            mood: mood.mood,
            value: mood.value
          };
        });
        
        setMoodData(formattedMoods.length ? formattedMoods : []);
        
        // Fetch mood distribution data
        const distribution = await getMoodDistribution(user.id);
        setMoodDistribution(distribution.length ? distribution : []);
        
        // Fetch monthly trend data
        const trend = await getMonthlyTrend(user.id);
        setWeeklyTrend(trend.length ? trend : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load your mood data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Your Mood Dashboard</h1>
            <Link to="/mood-entry">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white">
                <PlusCircle size={18} />
                <span>New Mood Entry</span>
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC68B3]"></div>
            </div>
          ) : moodData.length === 0 ? (
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mt-6 text-center">
              <h3 className="text-xl text-white mb-4">No mood data yet</h3>
              <p className="text-white/70 mb-6">Start tracking your moods to see your patterns over time.</p>
              <Link to="/mood-entry">
                <Button className="bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] text-white">
                  Log Your First Mood
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
