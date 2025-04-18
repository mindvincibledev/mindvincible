import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import BackgroundWithEmojis from "@/components/BackgroundWithEmojis";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signIn(email, password);
      
      // After successful login, retrieve user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_type, id')
        .eq('email', email)
        .single();
      
      if (userError) {
        throw new Error(`Error fetching user data: ${userError.message}`);
      }
      
      // Admin and clinicians go directly to their dashboards
      if (userData.user_type === 0) {
        navigate('/admin-dashboard');
        return;
      }
      
      if (userData.user_type === 1) {
        navigate('/clinician-dashboard');
        return;
      }
      
      // For students, check if they've logged a mood today
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
      
      const { data: moodData, error: moodError } = await supabase
        .from('mood_data')
        .select('id')
        .eq('user_id', userData.id)
        .gte('created_at', startOfDay)
        .lt('created_at', endOfDay)
        .limit(1);
      
      if (moodError) {
        throw new Error(`Error checking mood entries: ${moodError.message}`);
      }
      
      // Navigate based on mood entry status
      if (!moodData || moodData.length === 0) {
        navigate('/mood-entry');
      } else {
        navigate('/dashboard');
      }
      
      toast({
        title: "Success!",
        description: "You've been signed in.",
      });
    } catch (err) {
      console.error('Login error:', err);
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
