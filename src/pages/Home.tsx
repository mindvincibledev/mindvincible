import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Typewriter } from '@/components/ui/typewriter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = async () => {
    if (loading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Check user type
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        throw new Error(`Error fetching user type: ${userError.message}`);
      }

      // For admin and clinicians, route directly to their dashboards
      if (userData.user_type === 0) {
        navigate('/admin-dashboard');
        return;
      }
      
      if (userData.user_type === 1) {
        navigate('/clinician-dashboard');
        return;
      }
      
      // For students, check if they've logged a mood today
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
      
      const { data: moodData, error: moodError } = await supabase
        .from('mood_data')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay)
        .lt('created_at', endOfDay)
        .limit(1);
      
      if (moodError) {
        throw new Error(`Error checking mood entries: ${moodError.message}`);
      }

      // Direct students based on mood entry status
      if (!moodData || moodData.length === 0) {
        navigate('/mood-entry');
      } else {
        navigate('/home'); 
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        variant: "destructive",
        title: "Navigation error",
        description: "There was a problem navigating you to the right place."
      });
      // Default to mood-entry for students on error
      navigate('/home');
    }
  };

  
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="mt-8 bg-gradient-to-br from-[#FF8A48] to-[#FC68B3] py-4 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl"
            >
              Welcome to <span className="text-primary">M(in)dvincible</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="mt-6 max-w-2xl mx-auto text-center px-4"
            >
              <div className="text-xl md:text-2xl text-gray-800 backdrop-blur-sm bg-white/70 p-4 rounded-lg mb-10">
                <span className="text-[#F5DF4D]">You're </span>
                <Typewriter 
                  text={[
                    "allowed to feel exactly how you feel.",
                    "more than your struggles.",
                    "growing, even on the hard days.",
                    "not alone, and you never have to be.",
                    "doing better than you think.",
                    "worthy of love and kindness—especially from yourself.",
                    "enough, exactly as you are."
                  ]}
                  speed={70}
                  className="text-[#3DFDFF]"
                  waitTime={1500}
                  deleteSpeed={40}
                  cursorChar="|"
                  cursorClassName="text-[#FC68B3] ml-1"
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.7,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:from-[#FF8A48] hover:to-[#FC68B3] text-white px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default Home;
