import React from 'react';
import { Link } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import DailyMoodChart from '@/components/charts/DailyMoodChart';
import MoodDistributionChart from '@/components/charts/MoodDistributionChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import { useAuth } from '@/context/AuthContext';
import { useMoodData } from '@/hooks/useMoodData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMoodColor } from '@/utils/moodUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const { dailyMoodData, moodDistribution, weeklyTrend, loading, moodEntries } = useMoodData();

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
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-[#FC68B3]"></div>
          </div>
        ) : (
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
            
            {moodEntries.length === 0 ? (
              <div className="mt-12 p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-center">
                <h2 className="text-2xl text-white mb-4">Welcome to M(in)dvincible!</h2>
                <p className="text-white/70 mb-6">
                  You haven't recorded any moods yet. Start tracking how you feel to see insights here.
                </p>
                <Link to="/mood-entry">
                  <Button className="bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D] text-black font-medium hover:opacity-90">
                    Record Your First Mood
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Daily Mood Chart */}
                  <DailyMoodChart moodData={dailyMoodData} />
                  
                  {/* Mood Distribution Pie Chart */}
                  <MoodDistributionChart moodDistribution={moodDistribution} />
                  
                  {/* Monthly Trend Chart */}
                  <MonthlyTrendChart weeklyTrend={weeklyTrend} />
                </div>
                
                {/* Recent Mood Entries */}
                <div className="mt-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl text-white mb-4">Recent Mood Entries</h2>
                  <ScrollArea className="h-64 rounded-md">
                    <div className="space-y-4">
                      {moodEntries.slice(0, 10).map((entry) => (
                        <div 
                          key={entry.id} 
                          className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="h-10 w-10 rounded-full" 
                              style={{ 
                                background: `radial-gradient(circle at center, ${getMoodColor(entry.mood)}, ${getMoodColor(entry.mood)}99)`,
                                boxShadow: `0 0 10px ${getMoodColor(entry.mood)}66` 
                              }}
                            ></div>
                            <div>
                              <h3 className="text-white font-medium">{entry.mood}</h3>
                              <p className="text-white/60 text-sm">
                                {new Date(entry.created_at).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 max-w-[50%] justify-end">
                              {entry.tags.slice(0, 2).map((tag) => (
                                <span 
                                  key={tag} 
                                  className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/70"
                                >
                                  {tag}
                                </span>
                              ))}
                              {entry.tags.length > 2 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/70">
                                  +{entry.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
