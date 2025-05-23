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
import BonusChallenge from '@/components/battery-boost/BonusChallenge';
import FeedbackSection from '@/components/battery-boost/FeedbackSection';

type ActivitySection = 'welcome' | 'tracker' | 'reflection' | 'bonus' | 'feedback';

interface PostEntry {
  type: 'charging' | 'draining';
  percentage: number;
  category?: string;
  notes?: string;
}

interface BatteryEntry {
  id: string;
  starting_percentage: number;
  final_percentage: number;
  feeling_after_scroll?: string;
  selected_vibes?: string[];
  boost_topics?: string[];
  drain_patterns?: string;
  accounts_to_unfollow?: string;
  accounts_to_follow_more?: string;
  next_scroll_strategy?: string;
  shared_post_description?: string;
  shared_post_impact?: string;
  bonus_completed?: boolean;
  created_at: string;
  visible_to_clinicians: boolean;
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
  const [pastEntries, setPastEntries] = useState<BatteryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reflectionData, setReflectionData] = useState({
    feeling: '',
    selectedVibes: [] as string[],
    boostTopics: [] as string[],
    drainPatterns: '',
    accountsToUnfollow: '',
    accountsToFollow: '',
    nextScrollStrategy: '',
  });
  const [bonusData, setBonusData] = useState({
    completed: false,
    sharedPostDescription: '',
    sharedPostImpact: '',
  });
  
  // Fetch past entries when component mounts
  useEffect(() => {
    if (user) {
      fetchPastEntries();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPastEntries = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('battery_boost_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPastEntries(data || []);
    } catch (error) {
      console.error("Error fetching past entries:", error);
      toast.error("Could not load your past entries");
    } finally {
      setLoading(false);
    }
  };

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
          { 
            user_id: user.id, 
            starting_percentage: startingPercentage,
            visible_to_clinicians: false // Default to not visible
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setActivityEntryId(data[0].id);
      }
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

  const handleReflectionComplete = async (data: {
    feeling: string;
    selectedVibes: string[];
    boostTopics: string[];
    drainPatterns: string;
    accountsToUnfollow: string;
    accountsToFollow: string;
    nextScrollStrategy: string;
  }) => {
    setReflectionData(data);
    setCurrentSection('bonus');
    
    try {
      if (activityEntryId) {
        // Update entry with reflection data
        const { error } = await supabase
          .from('battery_boost_entries')
          .update({
            feeling_after_scroll: data.feeling,
            selected_vibes: data.selectedVibes,
            boost_topics: data.boostTopics,
            drain_patterns: data.drainPatterns,
            accounts_to_unfollow: data.accountsToUnfollow,
            accounts_to_follow_more: data.accountsToFollow,
            next_scroll_strategy: data.nextScrollStrategy
          })
          .eq('id', activityEntryId);
          
        if (error) {
          console.error("Error saving reflection data:", error);
          toast.error("Failed to save reflection data");
        }
      }
    } catch (error) {
      console.error("Error saving reflection data:", error);
      toast.error("Failed to save reflection data");
    }
  };

  const handleBonusComplete = async (
    completed: boolean, 
    sharedPostDescription?: string, 
    sharedPostImpact?: string
  ) => {
    setBonusData({
      completed,
      sharedPostDescription: sharedPostDescription || '',
      sharedPostImpact: sharedPostImpact || ''
    });
    
    // If they completed the bonus challenge, add 30% to battery (max 100%)
    const newFinalPercentage = completed 
      ? Math.min(100, finalPercentage + 30)
      : finalPercentage;
    
    if (completed && newFinalPercentage !== finalPercentage) {
      setFinalPercentage(newFinalPercentage);
    }
    
    try {
      if (activityEntryId) {
        // Update entry with bonus information
        const { error } = await supabase
          .from('battery_boost_entries')
          .update({
            final_percentage: newFinalPercentage,
            bonus_completed: completed,
            shared_post_description: sharedPostDescription,
            shared_post_impact: sharedPostImpact
          })
          .eq('id', activityEntryId);
          
        if (error) {
          console.error("Error saving bonus challenge data:", error);
          toast.error("Failed to save bonus challenge data");
        }
      }
    } catch (error) {
      console.error("Error saving bonus challenge data:", error);
      toast.error("Failed to save bonus challenge data");
    }
    
    setCurrentSection('feedback');
  };

  const handleFeedbackComplete = async () => {
    // Reset the activity
    setCurrentSection('welcome');
    toast.success("Great job completing the Battery Boost activity!", {
      description: "Your progress has been saved.",
      duration: 5000
    });
    
    // Refresh past entries to include the new one
    await fetchPastEntries();
  };
  
  // Render current section
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onStart={handleWelcomeComplete} 
            userEntries={pastEntries}
            onRefreshEntries={fetchPastEntries}
          />
        );
      
      case 'tracker':
        return <BatteryTracker onComplete={handleTrackerComplete} onAddPost={handleAddPost} />;
      
      case 'reflection':
        return <ReflectionSection finalPercentage={finalPercentage} onComplete={handleReflectionComplete} />;
      
      case 'bonus':
        return <BonusChallenge onComplete={handleBonusComplete} />;
      
      case 'feedback':
        return (
          <FeedbackSection 
            initialBatteryLevel={startingPercentage} 
            finalBatteryLevel={finalPercentage}
            activityEntryId={activityEntryId}
            onComplete={handleFeedbackComplete}
          />
        );
      
      default:
        return (
          <WelcomeScreen 
            onStart={handleWelcomeComplete} 
            userEntries={pastEntries}
            onRefreshEntries={fetchPastEntries} 
          />
        );
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
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 mb-4 rounded-full bg-gray-300"></div>
                <div className="h-4 w-48 bg-gray-300 rounded"></div>
              </div>
            </div>
          ) : (
            renderCurrentSection()
          )}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default BatteryBoostActivity;
