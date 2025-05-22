
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, ChevronUp, Layers, Award, BookOpen, Star, Video } from 'lucide-react';
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
  const [totalProgress, setTotalProgress] = useState(0);
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date());
  const [weekEndDate, setWeekEndDate] = useState<Date>(new Date());

  // All the activities go inside Self Awareness now
  const selfAwarenessActivities = [
    {
      id: "emotional-airbnb",
      title: "Emotional Airbnb",
      description: "Because understanding yourself is the ultimate glow-up ✨🧠",
      icon: <Layers className="h-8 w-8 text-[#FF8A48]" />, // Changed Layer to Layers
      link: "/emotional-airbnb",
      color: "from-[#FF8A48] to-[#FC68B3]",
      bgColor: "bg-[#FFF5F8]",
      chartColor: "#FC68B3",
    },
    {
      id: "emotional-hacking",
      title: "Emotional Hacking",
      description: "Learn tricks to stay chill when emotions get extra.",
      icon: <Layers className="h-8 w-8 text-[#3DFDFF]" />, // Changed Layer to Layers
      link: "/emotional-hacking",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#F0FFFE]",
      chartColor: "#3DFDFF",
    },
    {
      id: "power-of-hi",
      title: "Power of Hi",
      description: "Small moments. Big confidence.",
      icon: <Layers className="h-8 w-8 text-[#2AC20E]" />, // Changed Layer to Layers
      link: "/emotional-hacking/power-of-hi",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#E5FFF2]",
      chartColor: "#2AC20E",
    },
    {
      id: "mirror-mirror",
      title: "Mirror Mirror",
      description: "Because how you speak to yourself matters.",
      icon: <Layers className="h-8 w-8 text-[#FC68B3]" />, // Changed Layer to Layers
      link: "/emotional-hacking/mirror-mirror",
      color: "from-[#FC68B3] to-[#9b87f5]",
      bgColor: "bg-[#E5DEFF]",
      chartColor: "#9b87f5",
    },
    {
      id: "fork-in-the-road",
      title: "Fork in Road",
      description: "Explore your options. Choose with clarity.",
      icon: <Layers className="h-8 w-8 text-[#3DFDFF]" />, // Changed Layer to Layers
      link: "/emotional-hacking/fork-in-the-road",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#E5FFF2]",
      chartColor: "#3DFDFF",
    },
    {
      id: "digital-detox",
      title: "Digital Detox",
      description: "Give yourself a mental break by unplugging from electronic devices.",
      icon: <Layers className="h-8 w-8 text-[#FF8A48]" />, // Changed Layer to Layers
      link: "/emotional-hacking/digital-detox",
      color: "from-[#FC68B3] to-[#FF8A48]",
      bgColor: "bg-[#FFF5F8]",
      chartColor: "#FF8A48",
    },
    {
      id: "self-awareness-videos",
      title: "Self Awareness Videos",
      description: "Learn through watching videos about self awareness and emotional growth.",
      icon: <Video className="h-8 w-8 text-[#F5DF4D]" />,
      link: "/self-awareness-videos",
      color: "from-[#F5DF4D] to-[#FF8A48]",
      bgColor: "bg-[#FFFAE5]",
      chartColor: "#F5DF4D",
    }
  ];

  // New Self Confidence and Self Worth activities
  const selfConfidenceActivities = [
    {
      id: "flip-the-script",
      title: "Let's Flip the Script",
      description: "Learn how to reframe your talk",
      icon: <BookOpen className="h-8 w-8 text-[#FC68B3]" />,
      link: "/self-confidence/flip-the-script",
      color: "from-[#FC68B3] to-[#D5D5F1]",
      bgColor: "bg-[#FFF5F8]",
      chartColor: "#FC68B3",
    },
    {
      id: "confidence-tree",
      title: "Grow Your Confidence Tree",
      description: "See how your confidence has grown — and where you want it to bloom next.",
      icon: <Star className="h-8 w-8 text-[#F5DF4D]" />,
      link: "/self-confidence/confidence-tree",
      color: "from-[#F5DF4D] to-[#3DFDFF]",
      bgColor: "bg-[#FEF7CD]",
      chartColor: "#F5DF4D",
    },
    {
      id: "battery-boost",
      title: "Battery Boost",
      description: "Can your scroll charge you up or leave you drained? Let's find out.",
      icon: <Award className="h-8 w-8 text-[#3DFDFF]" />,
      link: "/self-confidence/battery-boost",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#F0FFFE]",
      chartColor: "#3DFDFF",
    },
  ];

  // All activities combined for tracking
  const allActivities = [...selfAwarenessActivities, ...selfConfidenceActivities];

  const isActivityCompleted = (activityId: string): boolean => {
    if (!weeklyCompletions || weeklyCompletions.length === 0) return false;
    
    if (activityId === 'emotional-hacking') {
      const hasGrounding = weeklyCompletions.some(c => c.activity_id === 'grounding-technique');
      const hasBoxBreathing = weeklyCompletions.some(c => c.activity_id === 'box-breathing');
      return hasGrounding && hasBoxBreathing;
    }
    return weeklyCompletions.some(completion => completion.activity_id === activityId);
  };

  useEffect(() => {
    if (user?.id) {
      fetchWeeklyCompletions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchWeeklyCompletions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Calculate week start and end
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

      // Using strict per-user access -- enforce RLS by always adding `eq('user_id', user.id)`
      const { data: completions, error } = await supabase
        .from('activity_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', startOfWeek.toISOString())
        .lte('completed_at', endOfWeek.toISOString());

      if (error) throw error;

      setWeeklyCompletions(completions || []);
      console.log("Weekly completions:", completions);

      // Process data for stats chart (all activities and sub-activities still go to chart)
      const stats = [
        ...selfAwarenessActivities.map(activity => ({
          id: activity.id,
          title: activity.title,
          count: (completions || []).filter(c => c.activity_id === activity.id).length,
          color: activity.chartColor
        })),
        ...selfConfidenceActivities.map(activity => ({
          id: activity.id,
          title: activity.title,
          count: (completions || []).filter(c => c.activity_id === activity.id).length,
          color: activity.chartColor
        }))
      ];
      
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

      // Calculate total completed activities count across all sections
      const totalCompletedCount = allActivities.reduce((count, activity) => {
        return isActivityCompleted(activity.id) ? count + 1 : count;
      }, 0);
      
      // Update total progress percentage
      const progressPercentage = (totalCompletedCount / allActivities.length) * 100;
      setTotalProgress(progressPercentage);
      
    } catch (error: any) {
      console.error('Error fetching completions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle self awareness module open/close
  const [selfAwarenessOpen, setSelfAwarenessOpen] = useState(true);
  
  // Toggle self confidence module open/close
  const [selfConfidenceOpen, setSelfConfidenceOpen] = useState(true);

  // Count completed activities for display
  const completedCount = allActivities.reduce((count, activity) => {
    return isActivityCompleted(activity.id) ? count + 1 : count;
  }, 0);

  // Add useEffect to ensure the progress is recomputed when weeklyCompletions changes
  useEffect(() => {
    if (weeklyCompletions.length > 0) {
      const totalCompletedCount = allActivities.reduce((count, activity) => {
        return isActivityCompleted(activity.id) ? count + 1 : count;
      }, 0);
      
      const progressPercentage = (totalCompletedCount / allActivities.length) * 100;
      setTotalProgress(progressPercentage);
    }
  }, [weeklyCompletions]);

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />

        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-3xl">
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
              All your activities grouped together
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
                  <User className="h-6 w-6 text-[#FC68B3] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">M(in)dvincible Progress</h2>
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
                  <span>
                    <b className="font-bold">{completedCount}/{allActivities.length}</b> Complete
                  </span>
                </div>
                
                <Progress value={totalProgress} className="h-3 bg-gray-200" />
                
                <p className="mt-2 text-sm text-gray-600">
                  {totalProgress < 100 ? 
                    `Try to complete all activities this week (${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()})` : 
                    'Great job! You\'ve completed all activities this week!'
                  }
                </p>
              </div>
            </motion.div>
          )}

          {/* Self Awareness module (expandable) */}
          <div className="max-w-2xl mx-auto">  
            <Card className="mb-8 shadow-lg border border-[#FC68B3]/20">
              <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer"
                onClick={() => setSelfAwarenessOpen(open => !open)}
              >
                <div className="flex items-center gap-4">
                  <span className="p-3 rounded-full bg-[#F5DF4D]/10">
                    <User className="h-8 w-8 text-[#F5DF4D]" />
                  </span>
                  <CardTitle className="text-2xl text-black">Self Awareness</CardTitle>
                </div>
                <div>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    tabIndex={-1}
                    aria-label={selfAwarenessOpen ? "Collapse" : "Expand"}
                  >
                    {selfAwarenessOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                  </Button>
                </div>
              </CardHeader>
              <AnimatePresence>
                {selfAwarenessOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CardContent>
                      <CardDescription className="mb-5 text-base text-gray-700">
                      Because understanding yourself is the ultimate glow-up!
                      </CardDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {selfAwarenessActivities.map((activity, index) => {
                          const completedThisWeek = user && isActivityCompleted(activity.id);

                          return (
                            <Card key={activity.id} className={`h-full ${activity.bgColor} border border-white/70`}>
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="p-3 rounded-full bg-white shadow-md w-fit">
                                    {activity.icon}
                                  </div>
                                  {completedThisWeek && (
                                    <div className="text-xs font-medium px-3 py-1 rounded-full bg-[#2AC20E]/20 text-[#2AC20E] flex items-center">
                                      <span className="mr-1">✓</span>
                                      Completed this week
                                    </div>
                                  )}
                                </div>
                                <CardTitle className="text-lg font-bold mt-2">{activity.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <CardDescription className="mb-5">{activity.description}</CardDescription>
                                <Link to={activity.link}>
                                  <Button
                                    className={`w-full bg-gradient-to-r ${activity.color} text-white hover:opacity-90 flex items-center justify-center gap-2`}
                                  >
                                    <span>Open {activity.title}</span>
                                  </Button>
                                </Link>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
            
            {/* Self Confidence and Self Worth module (expandable) */}
            <Card className="mb-8 shadow-lg border border-[#D5D5F1]/20">
              <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer"
                onClick={() => setSelfConfidenceOpen(open => !open)}
              >
                <div className="flex items-center gap-4">
                  <span className="p-3 rounded-full bg-[#FC68B3]/10">
                    <Award className="h-8 w-8 text-[#FC68B3]" />
                  </span>
                  <CardTitle className="text-2xl text-black">Self Confidence & Self Worth</CardTitle>
                </div>
                <div>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    tabIndex={-1}
                    aria-label={selfConfidenceOpen ? "Collapse" : "Expand"}
                  >
                    {selfConfidenceOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                  </Button>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {selfConfidenceOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CardContent>
                      <CardDescription className="mb-5 text-base text-gray-700">
                        Build your confidence and recognize your self-worth with these engaging activities.
                      </CardDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {selfConfidenceActivities.map((activity, index) => {
                          const completedThisWeek = user && isActivityCompleted(activity.id);

                          return (
                            <Card key={activity.id} className={`h-full ${activity.bgColor} border border-white/70`}>
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="p-3 rounded-full bg-white shadow-md w-fit">
                                    {activity.icon}
                                  </div>
                                  {completedThisWeek && (
                                    <div className="text-xs font-medium px-3 py-1 rounded-full bg-[#2AC20E]/20 text-[#2AC20E] flex items-center">
                                      <span className="mr-1">✓</span>
                                      Completed this week
                                    </div>
                                  )}
                                </div>
                                <CardTitle className="text-lg font-bold mt-2">{activity.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <CardDescription className="mb-5">{activity.description}</CardDescription>
                                <Link to={activity.link}>
                                  <Button
                                    className={`w-full bg-gradient-to-r ${activity.color} text-white hover:opacity-90 flex items-center justify-center gap-2`}
                                  >
                                    <span>Open {activity.title}</span>
                                  </Button>
                                </Link>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ResourcesHub;
