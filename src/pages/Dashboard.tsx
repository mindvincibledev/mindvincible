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
  subDays,
} from 'date-fns';

// Type definitions for mood data
interface MoodData {
  date: string;
  mood: string;
  time: string;
  created_at?: string;
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
  
  // Current date formatted nicely
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');
  
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

  // Fetch all mood data -- ENFORCE use of user_id, which is required for RLS
  const fetchAllMoodData = async () => {
    try {
      setLoading(true);
      // Only fetch records belonging to authenticated user (RLS enforced)
      const { data: moodEntries, error } = await supabase
        .from('mood_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mood data:', error);
        throw error;
      }
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
    // We're now getting the last 7 days of data regardless of filter
    const today = new Date();
    const weekStart = subDays(today, 6); // Get data from 6 days ago (7 days total including today)
    
    // Filter entries for the last 7 days
    const weekEntries = allMoodEntries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= weekStart && entryDate <= today;
    });
    
    // Process data for daily chart
    const dailyData: MoodData[] = weekEntries.map(entry => {
      const entryDate = new Date(entry.created_at);
      return {
        date: format(entryDate, 'EEE'), // Short day name (Mon, Tue, etc.)
        mood: entry.mood,
        time: format(entryDate, 'h:mm a'), // Format time as 12-hour with am/pm
        created_at: entry.created_at // Pass through the original date for exact comparison
      };
    });
    
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Your Mood Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome, {user.name}</p>
                <p className="text-gray-500 text-sm mt-1">{currentDate}</p>
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
              <div className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 p-8 my-8 shadow-md">
                <div className="text-gray-700 text-lg mb-6 text-center">
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
                  <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl rounded-lg p-6 flex items-center justify-center">
                    <p className="text-gray-600">No mood data for this period</p>
                  </div>
                )}
                
                {/* Mood Tags Table - Changes based on filter */}
                {filteredMoodTags.length > 0 ? (
                  <MoodTagsTable moodTags={filteredMoodTags} />
                ) : (
                  <div className="col-span-1 md:col-span-3 bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl rounded-lg p-6 flex items-center justify-center">
                    <p className="text-gray-600">No tag data for this period</p>
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
