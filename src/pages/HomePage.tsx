
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkUserAndRoute = async () => {
      try {
        setIsLoading(true);
        
        // If no user is logged in, redirect to main landing page
        if (!user) {
          navigate('/');
          return;
        }
        
        // Check user type
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();
        
        if (userError) {
          console.error("Error fetching user type:", userError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not determine user type. Please try again or contact support."
          });
          return;
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
          console.error("Error checking mood entries:", moodError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not check mood entry status. Redirecting to mood entry page."
          });
          navigate('/homepage');
          return;
        }
        
        // Direct students based on their mood entry status
        if (!moodData || moodData.length === 0) {
          navigate('/mood-entry'); // No mood entry today
        } else {
          navigate('/homepage'); // Redirect to dashboard when mood entry exists
        }
      } catch (error) {
        console.error('Routing error:', error);
        toast({
          variant: "destructive",
          title: "Navigation error",
          description: "An error occurred while navigating. Please try again."
        });
        // Default fallback for errors
        navigate('/homepage');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!authLoading) {
      checkUserAndRoute();
    }
  }, [user, navigate, authLoading]);
  
  if (authLoading || isLoading) {
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
