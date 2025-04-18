
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUserTypeAndRedirect = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Check if user has logged a mood today
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
        
        // First check for mood entry today
        const { data: moodData, error: moodError } = await supabase
          .from('mood_data')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', startOfDay)
          .lt('created_at', endOfDay)
          .limit(1);
        
        if (moodError) {
          console.error('Error checking mood entries:', moodError);
          navigate('/mood-entry'); // Default to mood entry if there's an error
          return;
        }

        // If no mood entry today, redirect to mood entry
        if (!moodData || moodData.length === 0) {
          navigate('/mood-entry');
          return;
        }

        // If they have logged a mood, check user type and redirect accordingly
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user type:', error);
          navigate('/home');
          return;
        }

        if (userData) {
          switch (userData.user_type) {
            case 0: // Admin
              navigate('/admin-dashboard');
              break;
            case 1: // Clinician
              navigate('/clinician-dashboard');
              break;
            default: // Student or any other type
              navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/mood-entry'); // Default to mood entry if there's an error
      }
    };

    checkUserTypeAndRedirect();
  }, [user, navigate]);

  return null; // This component just handles routing
};

export default HomePage;
