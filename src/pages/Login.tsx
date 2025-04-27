import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import BackgroundWithEmojis from "@/components/BackgroundWithEmojis";
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { UserType } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Helper to check mood entry for today
  const checkMoodEntryToday = async (userId: string) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const { data, error } = await supabase
      .from('mood_data')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', startOfDay)
      .lt('created_at', endOfDay)
      .limit(1);

    if (error) {
      console.error("Error checking mood_data:", error);
      return false;
    }
    return Array.isArray(data) && data.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userData = await signIn(email, password);
      
      // Check user type and redirect accordingly
      switch (userData?.user_type) {
        case UserType.Admin:
          toast({
            title: "Welcome, Admin!",
            description: "You have successfully logged in.",
          });
          navigate('/admin-dashboard');
          break;
        case UserType.Clinician:
          toast({
            title: "Welcome, Clinician!",
            description: "You have successfully logged in.",
          });
          navigate('/clinician-dashboard');
          break;
        case UserType.Student:
        default:
          // Check if the student user has already done mood entry today
          if (userData) {
            const hasMoodEntry = await checkMoodEntryToday(userData.id);
            toast({
              title: "Welcome!",
              description: "You have successfully logged in.",
            });
            if (hasMoodEntry) {
              navigate('/home');
            } else {
              navigate('/mood-entry');
            }
          }
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
      
      toast({
        title: "Redirecting to Google...",
        description: "Please complete the sign in process.",
      });
    } catch (err) {
      console.error("Google sign in error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign in with Google.');
      }
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
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
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
