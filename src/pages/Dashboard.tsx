
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import DailyMoodChart from '@/components/charts/DailyMoodChart';
import MoodDistributionChart from '@/components/charts/MoodDistributionChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import { useAuth } from '@/hooks/useAuth';
import { 
  getDailyMoodData, 
  getMoodDistribution, 
  getWeeklyTrend, 
  DailyMoodItem, 
  MoodDistributionItem, 
  MoodTrendItem 
} from '@/services/moodService';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [dailyMoods, setDailyMoods] = useState<DailyMoodItem[]>([]);
  const [distribution, setDistribution] = useState<MoodDistributionItem[]>([]);
  const [trend, setTrend] = useState<MoodTrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch mood data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch data in parallel
        const [dailyData, distributionData, trendData] = await Promise.all([
          getDailyMoodData(),
          getMoodDistribution(),
          getWeeklyTrend()
        ]);
        
        setDailyMoods(dailyData);
        setDistribution(distributionData);
        setTrend(trendData);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Your Mood Dashboard</h1>
            <Link to="/mood-entry">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white">
                <PlusCircle size={18} />
                <span>New Mood Entry</span>
              </Button>
            </Link>
          </div>
          
          {dailyMoods.length === 0 ? (
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 text-center">
              <h2 className="text-xl text-white mb-4">No mood data yet</h2>
              <p className="text-white/70 mb-6">Start tracking your moods to see your patterns and trends over time.</p>
              <Link to="/mood-entry">
                <Button className="bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D] text-black font-medium">
                  Record Your First Mood
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Daily Mood Chart */}
              <DailyMoodChart moodData={dailyMoods} />
              
              {/* Mood Distribution Pie Chart */}
              <MoodDistributionChart moodDistribution={distribution} />
              
              {/* Monthly Trend Chart */}
              <MonthlyTrendChart weeklyTrend={trend} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
