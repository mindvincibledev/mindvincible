
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const routeUser = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      
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
        
        // For students, check if they have a mood entry today
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

        // Direct students based on their mood entry status
        if (!moodData || moodData.length === 0) {
          navigate('/mood-entry'); // No mood entry today
        } else {
          navigate('/dashboard'); // Has mood entry today
        }
      } catch (error) {
        console.error('Routing error:', error);
        toast({
          variant: "destructive",
          title: "Navigation error",
          description: "An error occurred while navigating. Please try again."
        });
        navigate('/mood-entry'); // Default fallback
      } finally {
        setIsLoading(false);
      }
    };

    routeUser();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC68B3]"></div>
        <p className="mt-4 text-lg">Routing you to the right place...</p>
      </div>
    );
  }

  return null;
};

export default HomePage;
