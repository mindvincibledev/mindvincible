
import React from 'react';
import { Link } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import DailyMoodChart from '@/components/charts/DailyMoodChart';
import MoodDistributionChart from '@/components/charts/MoodDistributionChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import { moodData, moodDistribution, weeklyTrend } from '@/utils/moodUtils';

const Dashboard = () => {
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Daily Mood Chart */}
            <DailyMoodChart moodData={moodData} />
            
            {/* Mood Distribution Pie Chart */}
            <MoodDistributionChart moodDistribution={moodDistribution} />
            
            {/* Monthly Trend Chart */}
            <MonthlyTrendChart weeklyTrend={weeklyTrend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
