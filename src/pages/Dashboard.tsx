import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import DailyMoodChart from '@/components/charts/DailyMoodChart';
import MoodDistributionChart from '@/components/charts/MoodDistributionChart';
import MoodTagsTable from '@/components/charts/MoodTagsTable';
import DateFilter, { DateFilterOption } from '@/components/filters/DateFilter';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import StreakCounter from '@/components/StreakCounter';
import RecentMoodJars from '@/components/jar/RecentMoodJars';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  subMonths,
} from 'date-fns';

// Type definitions for mood data
interface MoodData {
  date: string;
  mood: string;
  time: string;
}

interface MoodDistribution {
  name: string;
  value: number;
}

interface MoodTagCount {
  mood: string;
  tag: string;
  count: number;
}

type MoodEntry = Database['public']['Tables']['mood_data']['Row'];

const Dashboard = () => {
  const [weeklyMoodData, setWeeklyMoodData] = useState<MoodData[]>([]);
  const [filteredMoodDistribution, setFilteredMoodDistribution] = useState<MoodDistribution[]>([]);
  const [filteredMoodTags, setFilteredMoodTags] = useState<MoodTagCount[]>([]);
  const [allMoodEntries, setAllMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
    }
  }, [session, navigate]);

  // Fetch all mood data on initial load
  useEffect(() => {
    if (user) {
      fetchAllMoodData();
    }
  }, [user]);

  // Process filtered data when filter changes or all data is loaded
  useEffect(() => {
    if (allMoodEntries.length > 0) {
      processFilteredData();
      processWeeklyData();
    }
  }, [allMoodEntries, dateFilter, selectedDate]);

  // Fetch all mood data
  const fetchAllMoodData = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching mood data for user:', user?.id);
      
      // Fetch all mood entries for the user
      const { data: moodEntries, error } = await supabase
        .from('mood_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching mood data:', error);
        throw error;
      }
      
      console.log('Fetched mood entries:', moodEntries);
      
      if (moodEntries) {
        setAllMoodEntries(moodEntries);
      } else {
        setAllMoodEntries([]);
      }
    } catch (err) {
      console.error('Error processing mood data:', err);
      toast({
        variant: "destructive",
        title: "Failed to load data",
        description: "There was an error loading your mood data.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate filter date range
  const getDateRange = () => {
    switch (dateFilter) {
      case 'day':
        return {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate)
        };
      case 'week':
        return {
          start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate)
        };
      case 'year':
        return {
          start: startOfYear(selectedDate),
          end: endOfYear(selectedDate)
        };
      default:
        // For 'all', we'll get the last 6 months of data as a reasonable default
        return {
          start: subMonths(new Date(), 6),
          end: new Date()
        };
    }
  };

  // Process weekly data for the DailyMoodChart (not affected by filters)
  const processWeeklyData = () => {
    // Always use a week of data for the DailyMoodChart regardless of filter
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Filter entries for the current week
    const weekEntries = allMoodEntries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    // Process data for daily chart
    const groupedByDay: Record<string, MoodData[]> = {};
    
    weekEntries.forEach(entry => {
      const date = new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }
      
      const timeString = new Date(entry.created_at).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
      
      groupedByDay[date].push({
        date,
        mood: entry.mood,
        time: timeString
      });
    });
    
    // Convert grouped data to array format for chart
    const dailyData: MoodData[] = Object.values(groupedByDay)
      .flat()
      .slice(0, 20); // Limit to 20 most recent mood entries for chart clarity
    
    setWeeklyMoodData(dailyData);
  };

  // Process filtered data based on date filter
  const processFilteredData = () => {
    if (allMoodEntries.length === 0) return;
    
    const { start, end } = getDateRange();
    
    // Filter entries based on the selected date range
    const filteredEntries = dateFilter === 'all' 
      ? allMoodEntries 
      : allMoodEntries.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate >= start && entryDate <= end;
        });
    
    // Calculate mood distribution
    const distribution: Record<string, number> = {};
    filteredEntries.forEach(entry => {
      if (distribution[entry.mood]) {
        distribution[entry.mood]++;
      } else {
        distribution[entry.mood] = 1;
      }
    });
    
    const distributionData = Object.entries(distribution).map(([name, count]) => {
      const percentage = Math.round((count / filteredEntries.length) * 100);
      return { name, value: percentage };
    });
    
    // Process tags by mood
    const tagsByMood: Record<string, Record<string, number>> = {};
    
    filteredEntries.forEach(entry => {
      const mood = entry.mood;
      
      if (!tagsByMood[mood]) {
        tagsByMood[mood] = {};
      }
      
      // Process tags if they exist
      if (entry.tags && entry.tags.length > 0) {
        entry.tags.forEach(tag => {
          if (tagsByMood[mood][tag]) {
            tagsByMood[mood][tag]++;
          } else {
            tagsByMood[mood][tag] = 1;
          }
        });
      }
    });
    
    // Convert tag data to array format for table
    const tagCountsData: MoodTagCount[] = [];
    
    Object.entries(tagsByMood).forEach(([mood, tags]) => {
      Object.entries(tags).forEach(([tag, count]) => {
        tagCountsData.push({ mood, tag, count });
      });
    });
    
    // Sort by count (descending)
    tagCountsData.sort((a, b) => b.count - a.count);
    
    setFilteredMoodDistribution(distributionData);
    setFilteredMoodTags(tagCountsData);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
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
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Your Mood Dashboard</h1>
                <p className="text-white mt-2">Welcome, {user.name}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Add StreakCounter here */}
                <div className="md:hidden w-full sm:w-auto">
                  <StreakCounter userId={user.id} />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Link to="/mood-entry" className="w-full sm:w-auto">
                    <Button className="flex items-center gap-2 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white w-full">
                      <PlusCircle size={18} />
                      <span>New Mood Entry</span>
                    </Button>
                  </Link>
                  
                  <Link to="/mood-jar" className="w-full sm:w-auto">
                    <Button className="flex items-center gap-2 bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:opacity-90 text-black font-medium w-full">
                      <Archive size={18} />
                      <span>Mood Jar</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Streak counter for medium and larger screens */}
            <div className="hidden md:block max-w-xs">
              <StreakCounter userId={user.id} />
            </div>
            
            {/* Display recent mood jars */}
            <div className="mb-6">
              <RecentMoodJars userId={user.id} />
            </div>
            
            {/* Date filter - affects only MoodDistributionChart and MoodTagsTable */}
            <div className="flex justify-end">
              <DateFilter 
                filterOption={dateFilter}
                selectedDate={selectedDate}
                onFilterChange={setDateFilter}
                onDateChange={setSelectedDate}
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-[#F5DF4D] text-lg">Loading your mood data...</div>
              </div>
            ) : allMoodEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-xl border border-[#3DFDFF]/30 p-8 my-8">
                <div className="text-[#F5DF4D] text-lg mb-6 text-center">
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
                {/* Daily Mood Chart - Always shows weekly data regardless of filter */}
                <DailyMoodChart moodData={weeklyMoodData} />
                
                {/* Mood Distribution Pie Chart - Changes based on filter */}
                {filteredMoodDistribution.length > 0 ? (
                  <MoodDistributionChart moodDistribution={filteredMoodDistribution} />
                ) : (
                  <div className="bg-black/60 backdrop-blur-lg border border-[#FC68B3]/30 shadow-xl rounded-lg p-6 flex items-center justify-center">
                    <p className="text-[#D5D5F1]">No mood data for this period</p>
                  </div>
                )}
                
                {/* Mood Tags Table - Changes based on filter */}
                {filteredMoodTags.length > 0 ? (
                  <MoodTagsTable moodTags={filteredMoodTags} />
                ) : (
                  <div className="col-span-1 md:col-span-3 bg-black/60 backdrop-blur-lg border border-[#FC68B3]/30 shadow-xl rounded-lg p-6 flex items-center justify-center">
                    <p className="text-[#D5D5F1]">No tag data for this period</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default Dashboard;
