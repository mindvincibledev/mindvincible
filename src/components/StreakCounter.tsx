
import React, { useEffect, useState } from 'react';
import { Heart, Flame, FlameKindling, GanttChartSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type MoodEntry = Database['public']['Tables']['mood_data']['Row'];

const StreakCounter = ({ userId }: { userId: string }) => {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStreak = async () => {
      try {
        setLoading(true);
        
        // Fetch user's mood entries ordered by date
        const { data: moodEntries, error } = await supabase
          .from('mood_data')
          .select('created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching mood data:', error);
          return;
        }

        if (!moodEntries || moodEntries.length === 0) {
          setStreak(0);
          return;
        }

        // Calculate streak
        let currentStreak = 0;
        let lastEntryDate: Date | null = null;

        // Sort entries by date (newest first)
        const sortedEntries = moodEntries.map(entry => ({
          date: new Date(entry.created_at)
        })).sort((a, b) => b.date.getTime() - a.date.getTime());

        // Check if the most recent entry is from today or yesterday
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const mostRecentEntry = sortedEntries[0].date;
        mostRecentEntry.setHours(0, 0, 0, 0);
        
        const timeDiff = today.getTime() - mostRecentEntry.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        // If the most recent entry is older than yesterday, streak is broken
        if (daysDiff > 1) {
          setStreak(0);
          return;
        }

        // Calculate continuous streak
        for (const entry of sortedEntries) {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);

          if (!lastEntryDate) {
            // First entry
            currentStreak = 1;
            lastEntryDate = entryDate;
            continue;
          }

          // Calculate difference in days
          const lastDate = new Date(lastEntryDate);
          const diffTime = lastDate.getTime() - entryDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

          if (diffDays === 1) {
            // Consecutive day
            currentStreak++;
            lastEntryDate = entryDate;
          } else if (diffDays === 0) {
            // Same day, skip
            lastEntryDate = entryDate;
          } else {
            // Streak broken
            break;
          }
        }

        setStreak(currentStreak);
      } catch (err) {
        console.error('Error calculating streak:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      calculateStreak();
    }
  }, [userId]);

  // Determine which emoji to show based on streak count
  const renderStreakEmoji = () => {
    if (streak > 30) {
      return <GanttChartSquare className="w-8 h-8 text-[#2AC20E]" />; // Strength emoji
    } else if (streak > 20) {
      return <FlameKindling className="w-8 h-8 text-[#F5DF4D]" />; // Flaming eyes emoji
    } else if (streak > 10) {
      return <Flame className="w-8 h-8 text-[#FF8A48]" />; // Fire emoji
    } else {
      return <Heart className="w-8 h-8 text-[#FC68B3]" />; // Heart emoji
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-black/60 backdrop-blur-lg border border-[#D5D5F1]/30 shadow-xl overflow-hidden">
        <CardContent className="p-4 flex items-center">
          <div className="flex flex-col items-center justify-center mr-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {renderStreakEmoji()}
            </motion.div>
          </div>
          <div>
            <h3 className="text-[#D5D5F1] font-medium text-lg">Streak</h3>
            {loading ? (
              <div className="h-6 w-12 bg-[#D5D5F1]/20 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-white">
                {streak} {streak === 1 ? 'day' : 'days'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StreakCounter;
