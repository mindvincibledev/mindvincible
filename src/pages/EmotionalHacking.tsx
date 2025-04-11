
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Navigation, Coffee, Music, Palette, Clock, Brain, MessageSquare, Target, BarChart2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ActivityStatsChart from '@/components/charts/ActivityStatsChart';

const activities = [
  {
    id: "digital-detox",
    title: "Digital Detox",
    description: "Give yourself a mental break by unplugging from electronic devices.",
    icon: <svg className="h-8 w-8 text-[#FF8A48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>,
    link: "/emotional-hacking/digital-detox",
    color: "from-[#FC68B3] to-[#FF8A48]",
    bgColor: "bg-[#FFDEE2]",
    chartColor: "#FF8A48"
  },
  {
    id: "box-breathing",
    title: "Breathe in a Box",
    description: "Chill your brain with a rhythmic breathing pattern to calm your nerves.",
    icon: <svg className="h-8 w-8 text-[#2AC20E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>,
    link: "/emotional-hacking/box-breathing",
    color: "from-[#3DFDFF] to-[#2AC20E]",
    bgColor: "bg-[#F2FCE2]",
    chartColor: "#2AC20E"
  },
  {
    id: "grounding-technique",
    title: "5-4-3-2-1: The Grounding Quest",
    description: "Use your senses to ground yourself in the present moment.",
    icon: <Eye className="h-8 w-8 text-[#F5DF4D]" />,
    link: "/emotional-hacking/grounding-technique",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    bgColor: "bg-[#FEF7CD]",
    chartColor: "#F5DF4D"
  },
  {
    id: "mirror-mirror",
    title: "Mirror Mirror On the Wall",
    description: "Because how you speak to yourself matters.",
    icon: <MessageSquare className="h-8 w-8 text-[#FC68B3]" />,
    link: "/emotional-hacking/mirror-mirror",
    color: "from-[#FC68B3] to-[#2AC20E]",
    bgColor: "bg-[#E5DEFF]",
    chartColor: "#D5D5F1"
  }
];

const EmotionalHacking = () => {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<any[]>([]);
  const [activityStats, setActivityStats] = useState<{[key: string]: {id: string, title: string, count: number, color: string}}>({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (user?.id) {
      fetchCompletions();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchCompletions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('activity_completions')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) {
        console.error('Error fetching completions:', error);
        return;
      }
      
      setCompletions(data || []);
      
      // Calculate statistics for each activity
      const stats: {[key: string]: {id: string, title: string, count: number, color: string}} = {};
      activities.forEach(activity => {
        stats[activity.id] = {
          id: activity.id,
          title: activity.title,
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
      // Define completion as having done each activity at least once
      const completedActivities = Object.values(stats).filter(stat => stat.count > 0).length;
      const progressPercentage = (completedActivities / activities.length) * 100;
      setProgress(progressPercentage);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
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
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">
              Hack the Feels, Don't Let Them Hack You
            </h1>
            <p className="text-black text-lg max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              Learn tricks to stay chill when emotions get extra.
            </p>
          </motion.div>
          
          {/* Progress Section */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md"
            >
              <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="flex items-center mb-4 md:mb-0">
                  <Target className="h-6 w-6 text-[#FC68B3] mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Your Emotional Hacking Progress</h2>
                </div>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-[#3DFDFF] text-[#3DFDFF] hover:bg-[#3DFDFF]/10">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      View Stats
                    </Button>
                  </SheetTrigger>
                  <SheetContent size="lg">
                    <SheetHeader>
                      <SheetTitle className="text-2xl bg-gradient-to-r from-[#FC68B3] to-[#3DFDFF] bg-clip-text text-transparent">
                        Activity Completion Stats
                      </SheetTitle>
                      <SheetDescription>
                        Track how many times you've completed each emotional hacking activity
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-6">
                      <ActivityStatsChart activityStats={activityStats} />
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Complete each activity at least once to reach 100% progress
                      </p>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{Math.round(progress)}% Complete</span>
                  <span>{Object.values(activityStats).filter(c => c.count > 0).length} of {activities.length} Activities</span>
                </div>
                <Progress value={progress} className="h-3 bg-gray-200" />
              </div>
            </motion.div>
          )}
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {activities.map((activity, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={activity.link} className="block h-full">
                  <Card className={`h-full border border-gray-100 ${activity.bgColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-full bg-white shadow-md">
                          {activity.icon}
                        </div>
                        {user && activityStats[activity.id]?.count > 0 && (
                          <div className="text-xs font-medium px-3 py-1 rounded-full bg-[#2AC20E]/20 text-[#2AC20E] flex items-center">
                            <span className="mr-1">✓</span>
                            Completed {activityStats[activity.id]?.count} {activityStats[activity.id]?.count === 1 ? 'time' : 'times'}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-black mt-3">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-black">{activity.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-black mb-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg inline-block">
              These activities can help you pause, reset, and then take purposeful action.
            </p>
          </motion.div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default EmotionalHacking;
