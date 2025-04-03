
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { PlusCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import DailyMoodChart from '@/components/charts/DailyMoodChart';
import MoodDistributionChart from '@/components/charts/MoodDistributionChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import { useAuth } from '@/context/AuthContext';
import { 
  getUserMoodEntries, 
  getMoodDistribution, 
  getWeeklyTrend, 
  processDailyMoodData 
} from '@/services/moodService';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [moodData, setMoodData] = useState([]);
  const [moodDistribution, setMoodDistribution] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get user's mood entries
        const entries = await getUserMoodEntries();
        const formattedDailyData = processDailyMoodData(entries);
        setMoodData(formattedDailyData);
        
        // Get mood distribution
        const distribution = await getMoodDistribution();
        setMoodDistribution(distribution);
        
        // Get weekly trend
        const trend = await getWeeklyTrend();
        setWeeklyTrend(trend);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your mood data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user?.id]);

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Your Mood Dashboard</h1>
              {user && (
                <p className="text-white/70 mt-2">Welcome, {user.email?.split('@')[0]}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link to="/mood-entry">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white">
                  <PlusCircle size={18} />
                  <span>New Mood Entry</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[40vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC68B3]"></div>
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
          
          {!isLoading && moodData.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-xl text-white mb-4">No mood data yet</h3>
              <p className="text-white/70 mb-6">Start tracking your moods to see insights here</p>
              <Link to="/mood-entry">
                <Button className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48]">
                  Record Your First Mood
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
