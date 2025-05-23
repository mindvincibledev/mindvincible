
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Heart, X, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const MoodReminderNotification = () => {
  const [showReminder, setShowReminder] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user } = useAuth();
  const location = useLocation();
  
  // Don't show on mood entry page or for clinicians/admins
  const isMoodEntryPage = location.pathname === '/mood-entry';
  const isClinicianOrAdmin = user && (user.user_type === 0 || user.user_type === 1); // Admin or Clinician
  
  // Check if the user has already logged a mood for today
  useEffect(() => {
    if (!user || isMoodEntryPage || isClinicianOrAdmin) return;
    
    const checkMoodEntry = async () => {
      try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
        
        // Check only mood_data table
        const { data: moodData, error: moodError } = await supabase
          .from('mood_data')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', startOfDay)
          .lt('created_at', endOfDay)
          .limit(1);
        
        if (moodError) {
          console.error('Error checking mood entries:', moodError);
          return;
        }
        
        // Show reminder if no entries found
        const hasMoodEntry = (moodData && moodData.length > 0);
        setShowReminder(!hasMoodEntry);
        
      } catch (error) {
        console.error('Error checking mood entries:', error);
      }
    };
    
    checkMoodEntry();
    
    // Recheck every 10 minutes (600,000 ms)
    const intervalId = setInterval(checkMoodEntry, 10 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, isMoodEntryPage, location.pathname, isClinicianOrAdmin]);
  
  // Don't render anything if no reminder needed, user not logged in, on the mood entry page, or user is clinician/admin
  if (!showReminder || !user || isMoodEntryPage || isClinicianOrAdmin) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300 }}
        animate={{ x: isCollapsed ? 240 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-8 right-0 z-50"
      >
        <div className="flex items-center">
          {/* Collapsed button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-12 h-12 rounded-l-full bg-[#FC68B3] text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? (
              <Bell className="h-6 w-6" />
            ) : (
              <X className="h-6 w-6" />
            )}
          </motion.button>
          
          {/* Expanded notification */}
          <div className="bg-white rounded-l-lg shadow-lg border-l border-y border-gray-200 overflow-hidden">
            <div className="relative p-4 w-60">
              <h3 className="text-lg font-medium text-[#FC68B3] flex items-center mb-2">
                <Heart className="h-5 w-5 mr-2 inline" />
                Mood Check-in
              </h3>
              
              <p className="text-sm text-gray-700 mb-3">
                You haven't recorded your mood for {format(new Date(), 'EEEE, MMM d')} yet!
              </p>
              
              <div className="space-y-2">
                <Link 
                  to="/mood-entry"
                  className="flex items-center justify-center py-2 px-4 w-full text-white text-sm rounded-full bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 transition-all duration-200"
                >
                  Record now
                </Link>
                
                <button
                  onClick={() => setShowReminder(false)}
                  className="flex items-center justify-center py-2 px-4 w-full text-gray-700 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200"
                >
                  Dismiss for today
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoodReminderNotification;
