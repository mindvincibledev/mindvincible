
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import BackgroundWithEmojis from "@/components/BackgroundWithEmojis";
import { startOfDay, endOfDay } from 'date-fns';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, check if they have logged a mood today
    if (user) {
      checkMoodForToday(user.id);
    }
  }, [user, navigate]);

  // Check if user has already logged a mood today
  const checkMoodForToday = async (userId: string) => {
    try {
      console.log("Checking if user has logged a mood today...");
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      // Query both mood_data and mood_widget_selections to see if there's an entry for today
      const [moodDataResult, widgetSelectionsResult] = await Promise.all([
        supabase
          .from('mood_data')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', startOfToday.toISOString())
          .lte('created_at', endOfToday.toISOString())
          .limit(1),
          
        supabase
          .from('mood_widget_selections')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', startOfToday.toISOString())
          .lte('created_at', endOfToday.toISOString())
          .limit(1)
      ]);

      const { data: todayMoods, error: moodDataError } = moodDataResult;
      const { data: todayWidgetSelections, error: widgetError } = widgetSelectionsResult;

      if (moodDataError) {
        console.error('Error checking mood_data:', moodDataError);
      }
      
      if (widgetError) {
        console.error('Error checking mood_widget_selections:', widgetError);
      }

      // Redirect based on whether user has logged a mood today in either table
      const hasLoggedMood = (todayMoods && todayMoods.length > 0) || 
                           (todayWidgetSelections && todayWidgetSelections.length > 0);
      
      console.log("Has user logged mood today?", hasLoggedMood);
      if (hasLoggedMood) {
        // User has already logged a mood today, redirect to home
        navigate('/home');
      } else {
        // User hasn't logged a mood today, redirect to mood entry
        navigate('/mood-entry');
      }
    } catch (err) {
      console.error('Error checking mood for today:', err);
      // Default to mood entry page if there's an error
      navigate('/mood-entry');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signIn(email, password);
      // Redirect will be handled by the useEffect above
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeInOut" }} 
          className="w-full max-w-md"
        >
          <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-xl p-8 shadow-xl relative">
            <div className="absolute top-4 left-4">
              <Link to="/" className="inline-flex items-center text-[#3DFDFF] hover:text-[#3DFDFF]/80 transition-colors group">
                <Home className="mr-1.5 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Home
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              Welcome Back
            </h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-700 rounded-md p-3 mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-1.5 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    className="pl-10 bg-white/50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-[#3DFDFF] focus:ring-[#3DFDFF]/30" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-[#3DFDFF] hover:text-[#3DFDFF]/80 transition-colors hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    className="pl-10 bg-white/50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-[#3DFDFF] focus:ring-[#3DFDFF]/30" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:from-[#FF8A48] hover:to-[#FC68B3] text-white transition-all duration-300 py-6" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-[#3DFDFF] hover:underline">
                    Register now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default Login;
