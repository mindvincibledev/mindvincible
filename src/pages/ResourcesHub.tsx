import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Heart, ArrowRight, GitFork, MessageSquare, UserPlus, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BarChart2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import ActivityStatsChart from '@/components/charts/ActivityStatsChart';

const ResourcesHub = () => {
  const { user } = useAuth();
  const [weeklyCompletions, setWeeklyCompletions] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<{id: string, title: string, count: number, color: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date());
  const [weekEndDate, setWeekEndDate] = useState<Date>(new Date());

  const activities = [
    {
      id: "digital-detox",
      title: "Digital Detox",
      description: "Give yourself a mental break by unplugging from electronic devices.",
      icon: <X className="h-8 w-8 text-[#FF8A48]" />,
      link: "/emotional-hacking/digital-detox",
      color: "from-[#FC68B3] to-[#FF8A48]",
      bgColor: "bg-[#FFF5F8]",
      chartColor: "#FF8A48",
    },
    {
      id: "mirror-mirror",
      title: "Mirror Mirror",
      description: "Because how you speak to yourself matters.",
      icon: <MessageSquare className="h-8 w-8 text-[#FC68B3]" />,
      link: "/emotional-hacking/mirror-mirror",
      color: "from-[#FC68B3] to-[#9b87f5]",
      bgColor: "bg-[#E5DEFF]",
      chartColor: "#9b87f5",
    },
    {
      id: "power-of-hi",
      title: "Power of Hi",
      description: "Small moments. Big confidence.",
      icon: <UserPlus className="h-8 w-8 text-[#2AC20E]" />,
      link: "/emotional-hacking/power-of-hi",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#E5FFF2]",
      chartColor: "#2AC20E",
    },
    {
      id: "fork-in-the-road",
      title: "Fork in Road",
      description: "Explore your options. Choose with clarity.",
      icon: <GitFork className="h-8 w-8 text-[#3DFDFF]" />,
      link: "/emotional-hacking/fork-in-the-road",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#E5FFF2]",
      chartColor: "#3DFDFF",
    },
    {
      id: "emotional-airbnb",
      title: "Emotional Airbnb",
      description: "Because understanding yourself is the ultimate glow-up ✨🧠",
      icon: <Brain className="h-8 w-8 text-[#FF8A48]" />,
      link: "/emotional-airbnb",
      color: "from-[#FF8A48] to-[#FC68B3]",
      bgColor: "bg-[#FFF5F8]",
      chartColor: "#FC68B3",
    },
    {
      id: "emotional-hacking",
      title: "Emotional Hacking",
      description: "Learn tricks to stay chill when emotions get extra.",
      icon: <Heart className="h-8 w-8 text-[#3DFDFF]" />,
      link: "/emotional-hacking",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#F0FFFE]",
      chartColor: "#3DFDFF",
    }
  ];

  const isActivityCompleted = (activityId: string): boolean => {
    if (activityId === 'emotional-hacking') {
      // For emotional hacking, check if both sub-activities are completed this week
      const hasGrounding = weeklyCompletions.some(c => c.activity_id === 'grounding-technique');
      const hasBoxBreathing = weeklyCompletions.some(c => c.activity_id === 'box-breathing');
      return hasGrounding && hasBoxBreathing;
    }
    // For regular activities, check if they've been completed at least once this week
    return weeklyCompletions.some(completion => completion.activity_id === activityId);
  };

  useEffect(() => {
    if (user?.id) {
      fetchWeeklyCompletions();
    }
  }, [user]);

  const fetchWeeklyCompletions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Calculate week start and end dates
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      setWeekStartDate(startOfWeek);
      setWeekEndDate(endOfWeek);

      // Fetch completions for current week
      const { data: completions, error } = await supabase
        .from('activity_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', startOfWeek.toISOString())
        .lte('completed_at', endOfWeek.toISOString());
        
      if (error) throw error;
      
      setWeeklyCompletions(completions || []);

      // Process data for stats
      const stats = activities.map(activity => ({
        id: activity.id,
        title: activity.title,
        count: (completions || []).filter(c => c.activity_id === activity.id).length,
        color: activity.chartColor
      }));

      // Add Emotional Hacking sub-activities to stats
      stats.push(
        {
          id: 'grounding-technique',
          title: '5-4-3-2-1: The Grounding Quest',
          count: (completions || []).filter(c => c.activity_id === 'grounding-technique').length,
          color: '#3DFDFF'
        },
        {
          id: 'box-breathing',
          title: 'Box Breathing',
          count: (completions || []).filter(c => c.activity_id === 'box-breathing').length,
          color: '#2AC20E'
        }
      );

      setWeeklyStats(stats);
      
      // Calculate progress
      const totalActivities = activities.length + 1; // Adding 2 for sub-activities
      console.log(activities.length)
      const uniqueCompletedActivities = new Set();
      
      // Count unique completed activities
      completions?.forEach(completion => {
        uniqueCompletedActivities.add(completion.activity_id);
      });
      
      // For emotional hacking, check if both sub-activities are completed
      const hasCompletedGrounding = uniqueCompletedActivities.has('grounding-technique');
      const hasCompletedBoxBreathing = uniqueCompletedActivities.has('box-breathing');
      if (hasCompletedGrounding && hasCompletedBoxBreathing) {
        uniqueCompletedActivities.add('emotional-hacking');
      }
      
      const progressPercentage = (uniqueCompletedActivities.size / totalActivities) * 100;
      setProgress(Math.min(progressPercentage, 100)); // Ensure progress doesn't exceed 100%
      
    } catch (error: any) {
      console.error('Error fetching completions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">
              Resources Hub
            </h1>
            <p className="text-black text-lg max-w-2xl mx-auto">
              Explore our collection of tools and activities to support your emotional well-being journey.
            </p>
          </motion.div>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md"
            >
              <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="flex items-center mb-4 md:mb-0">
                  <ArrowRight className="h-6 w-6 text-[#FC68B3] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">This Week's Progress</h2>
                </div>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-[#3DFDFF] text-[#3DFDFF] hover:bg-[#3DFDFF]/10">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      View Weekly Stats
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[90%] sm:max-w-md bg-white">
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-bold text-black">Weekly Activity Stats</SheetTitle>
                      <SheetDescription className="text-gray-700">
                        Activities completed from {weekStartDate.toLocaleDateString()} to {weekEndDate.toLocaleDateString()}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                      <ActivityStatsChart 
                        weeklyStats={weeklyStats} 
                        weekStartDate={weekStartDate}
                        weekEndDate={weekEndDate}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{Math.round(progress)}% Complete</span>
                  <span>
                    {new Set(weeklyCompletions.map(c => c.activity_id)).size} of {activities.length} Activities
                  </span>
                </div>
                <Progress value={progress} className="h-3 bg-gray-200" />
                
                <p className="mt-2 text-sm text-gray-600">
                  {progress < 100 ? 
                    `Try to complete all activities this week (${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()})` : 
                    'Great job! You\'ve completed all activities this week!'
                  }
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {activities.map((activity, index) => {
              const completedThisWeek = user && weeklyCompletions.some(c => c.activity_id === activity.id);
              const completionCount = user ? weeklyCompletions.filter(c => c.activity_id === activity.id).length : 0;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${activity.bgColor}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-full bg-white shadow-md w-fit">
                          {activity.icon}
                        </div>
                        {isActivityCompleted(activity.id) && (
                          <div className="text-xs font-medium px-3 py-1 rounded-full bg-[#2AC20E]/20 text-[#2AC20E] flex items-center">
                            <span className="mr-1">✓</span>
                            Completed this week
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-2xl font-bold mt-4">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-6">{activity.description}</CardDescription>
                      <Link to={activity.link}>
                        <Button 
                          className={`w-full bg-gradient-to-r ${activity.color} text-white hover:opacity-90 flex items-center justify-center gap-2`}
                        >
                          <span>Open {activity.title}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ResourcesHub;
