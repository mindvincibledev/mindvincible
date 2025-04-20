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
  const [completions, setCompletions] = useState<any[]>([]);
  const [activityStats, setActivityStats] = useState<{[key: string]: {id: string, title: string, shortName: string, count: number, color: string}}>({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const modules = [
    {
      id: "digital-detox",
      title: "Digital Detox",
      description: "Give yourself a mental break by unplugging from electronic devices.",
      icon: <X className="h-8 w-8 text-[#FF8A48]" />,
      link: "/emotional-hacking/digital-detox",
      color: "from-[#FC68B3] to-[#FF8A48]",
      bgColor: "bg-[#FFF5F8]",
      chartColor: "#FF8A48",
      shortName: "Detox"
    },
    {
      id: "mirror-mirror",
      title: "Mirror Mirror On the Wall",
      description: "Because how you speak to yourself matters.",
      icon: <MessageSquare className="h-8 w-8 text-[#FC68B3]" />,
      link: "/emotional-hacking/mirror-mirror",
      color: "from-[#FC68B3] to-[#9b87f5]",
      bgColor: "bg-[#E5DEFF]",
      chartColor: "#9b87f5",
      shortName: "Mirror"
    },
    {
      id: "power-of-hi",
      title: "Power of a Simple Hi",
      description: "Small moments. Big confidence.",
      icon: <UserPlus className="h-8 w-8 text-[#2AC20E]" />,
      link: "/emotional-hacking/power-of-hi",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#E5FFF2]",
      chartColor: "#2AC20E",
      shortName: "Hi"
    },
    {
      id: "fork-in-the-road",
      title: "Fork in the Road",
      description: "Explore your options. Choose with clarity.",
      icon: <GitFork className="h-8 w-8 text-[#3DFDFF]" />,
      link: "/emotional-hacking/fork-in-the-road",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#E5FFF2]",
      chartColor: "#3DFDFF",
      shortName: "Choices"
    },
    {
      title: "Self Awareness",
      description: "Because understanding yourself is the ultimate glow-up ✨🧠",
      icon: <Brain className="h-8 w-8 text-[#FF8A48]" />,
      link: "/emotional-airbnb",
      color: "from-[#FF8A48] to-[#FC68B3]",
      bgColor: "bg-[#FFF5F8]",
    },
    {
      title: "Emotional Hacking",
      description: "Learn tricks to stay chill when emotions get extra.",
      icon: <Heart className="h-8 w-8 text-[#3DFDFF]" />,
      link: "/emotional-hacking",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#F0FFFE]",
    }
  ];

  useEffect(() => {
    if (user?.id) {
      fetchCompletions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCompletions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('activity_completions')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setCompletions(data || []);
      
      // Calculate statistics for each activity
      const stats: {[key: string]: {id: string, title: string, shortName: string, count: number, color: string}} = {};
      modules.forEach(activity => {
        stats[activity.id] = {
          id: activity.id,
          title: activity.title,
          shortName: activity.shortName,
          count: 0,
          color: activity.chartColor
        };
      });
      
      (data || []).forEach((completion: any) => {
        const activityId = completion.activity_id.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (stats[activityId] !== undefined) {
          stats[activityId].count++;
        }
      });
      
      setActivityStats(stats);
      
      // Calculate progress percentage
      const completedActivities = Object.values(stats).filter(stat => stat.count > 0).length;
      const progressPercentage = (completedActivities / modules.length) * 100;
      setProgress(progressPercentage);
      
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
                  <h2 className="text-xl font-semibold text-gray-800">Your Progress</h2>
                </div>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-[#3DFDFF] text-[#3DFDFF] hover:bg-[#3DFDFF]/10">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      View Stats
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[90%] sm:max-w-md bg-white">
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-bold text-black">Activity Completion Stats</SheetTitle>
                      <SheetDescription className="text-gray-700">
                        Track how many times you've completed each activity
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                      <ActivityStatsChart activityStats={activityStats} />
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Complete each activity at least once to reach 100% progress
                    </p>
                  </SheetContent>
                </Sheet>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{Math.round(progress)}% Complete</span>
                  <span>
                    {Object.values(activityStats).filter(c => c.count > 0).length} of {modules.length} Activities
                  </span>
                </div>
                <Progress value={progress} className="h-3 bg-gray-200" />
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${module.bgColor}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-full bg-white shadow-md w-fit">
                        {module.icon}
                      </div>
                      {user && activityStats[module.id]?.count > 0 && (
                        <div className="text-xs font-medium px-3 py-1 rounded-full bg-[#2AC20E]/20 text-[#2AC20E] flex items-center">
                          <span className="mr-1">✓</span>
                          Completed {activityStats[module.id]?.count} {activityStats[module.id]?.count === 1 ? 'time' : 'times'}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold mt-4">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-6">{module.description}</CardDescription>
                    <Link to={module.link}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${module.color} text-white hover:opacity-90 flex items-center justify-center gap-2`}
                      >
                        <span>Open {module.title}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ResourcesHub;
