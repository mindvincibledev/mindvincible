
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import DailyMoodChart from '@/components/charts/DailyMoodChart';
import MoodDistributionChart from '@/components/charts/MoodDistributionChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import { useMoodData } from '@/hooks/useMoodData';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { moodData, moodDistribution, weeklyTrend, isLoading } = useMoodData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
          
          {isLoading ? (
            <div className="h-[60vh] flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-[#3DFDFF] animate-spin" />
              <span className="ml-4 text-white text-xl">Loading your mood data...</span>
            </div>
          ) : moodData.length === 0 ? (
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-10 text-center border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">No mood entries yet</h2>
              <p className="text-white/70 mb-6">
                Start tracking your moods to see insights and patterns here.
              </p>
              <Link to="/mood-entry">
                <Button className="bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D] text-black hover:opacity-90">
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
