
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import WelcomeScreen from '@/components/battery-boost/WelcomeScreen';
import BatteryTracker from '@/components/battery-boost/BatteryTracker';
import ReflectionSection from '@/components/battery-boost/ReflectionSection';
import FeedbackSection from '@/components/battery-boost/FeedbackSection';

type ActivitySection = 'welcome' | 'tracker' | 'reflection' | 'feedback';

interface PostEntry {
  type: 'charging' | 'draining';
  percentage: number;
  category?: string;
  notes?: string;
}

const BatteryBoostActivity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [currentSection, setCurrentSection] = useState<ActivitySection>('welcome');
  const [startingPercentage, setStartingPercentage] = useState<number>(50);
  const [finalPercentage, setFinalPercentage] = useState<number>(50);
  const [activityEntryId, setActivityEntryId] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostEntry[]>([]);
  const [reflectionData, setReflectionData] = useState({
    feeling: '',
    selectedVibes: [] as string[],
    boostTopics: [] as string[],
    drainPatterns: '',
  });

  // Create a new activity entry when first entering tracker section
  const createActivityEntry = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to save your progress");
        return;
      }

      const { data, error } = await supabase
        .from('battery_boost_entries')
        .insert([
          { user_id: user.id, starting_percentage: startingPercentage }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setActivityEntryId(data.id);
    } catch (error) {
      console.error("Error creating activity entry:", error);
      toast.error("Failed to save activity data");
    }
  };

  // Section handlers
  const handleWelcomeComplete = () => {
    setCurrentSection('tracker');
    createActivityEntry();
  };

  const handleAddPost = async (
    type: 'charging' | 'draining', 
    percentage: number, 
    category?: string,
    notes?: string
  ) => {
    // Add post to local state
    const newPost = { type, percentage, category, notes };
    setPosts([...posts, newPost]);
    
    try {
      if (activityEntryId && user) {
        // Save post to database
        await supabase
          .from('battery_boost_posts')
          .insert([
            { 
              entry_id: activityEntryId, 
              user_id: user.id,
              post_type: type,
              percentage_change: type === 'charging' ? percentage : -percentage,
              post_category: category,
              notes: notes
            }
          ]);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      // Continue with local state if database save fails
    }
  };

  const handleTrackerComplete = async (batteryPercentage: number) => {
    setFinalPercentage(batteryPercentage);
    setCurrentSection('reflection');
    
    try {
      if (activityEntryId) {
        // Update entry with final percentage
        await supabase
          .from('battery_boost_entries')
          .update({ final_percentage: batteryPercentage })
          .eq('id', activityEntryId);
      }
    } catch (error) {
      console.error("Error updating final percentage:", error);
    }
  };

  const handleReflectionComplete = async (data) => {
    setReflectionData(data);
    setCurrentSection('feedback');
    
    try {
      if (activityEntryId) {
        // Update entry with reflection data
        await supabase
          .from('battery_boost_entries')
          .update({
            feeling_after_scroll: data.feeling,
            selected_vibes: data.selectedVibes,
            boost_topics: data.boostTopics,
            drain_patterns: data.drainPatterns
          })
          .eq('id', activityEntryId);
      }
    } catch (error) {
      console.error("Error saving reflection data:", error);
    }
  };

  const handleFeedbackComplete = async () => {
    // Record activity completion in activity_completions table
    try {
      if (user) {
        await supabase
          .from('activity_completions')
          .insert([
            {
              user_id: user.id,
              activity_id: 'battery-boost',
              activity_name: 'Battery Boost'
            }
          ]);
      }
    } catch (error) {
      console.error("Error recording activity completion:", error);
    }
    
    // Navigate back to resources hub
    navigate('/resources');
  };
  
  // Render current section
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'welcome':
        return <WelcomeScreen onStart={handleWelcomeComplete} />;
      
      case 'tracker':
        return <BatteryTracker onComplete={handleTrackerComplete} onAddPost={handleAddPost} />;
      
      case 'reflection':
        return <ReflectionSection finalPercentage={finalPercentage} onComplete={handleReflectionComplete} />;
      
      case 'feedback':
        return (
          <FeedbackSection 
            initialBatteryLevel={startingPercentage} 
            finalBatteryLevel={finalPercentage} 
            onComplete={handleFeedbackComplete}
          />
        );
      
      default:
        return <WelcomeScreen onStart={handleWelcomeComplete} />;
    }
  };
  
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-3xl">
          <Link to="/resources" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources Hub
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] bg-clip-text text-transparent mb-4">
              Battery Boost
            </h1>
            <p className="text-gray-800 text-lg max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              Can your scroll charge you up or leave you drained? Let's find out.
            </p>
          </motion.div>
          
          {renderCurrentSection()}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default BatteryBoostActivity;
