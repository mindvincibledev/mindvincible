
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
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user type:', error);
          navigate('/dashboard');
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
        navigate('/dashboard');
      }
    };

    checkUserTypeAndRedirect();
  }, [user, navigate]);

  return null; // This component just handles routing
};

export default HomePage;
