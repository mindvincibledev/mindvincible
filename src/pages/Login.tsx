
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Home, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/mood-entry');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;
    
    await login(identifier, password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <WavyBackground 
          colors={["#FF8A48", "#D5D5F1", "#3DFDFF", "#F5DF4D", "#FC68B3", "#2AC20E"]} 
          waveWidth={50} 
          backgroundFill="black" 
          blur={10} 
          speed="fast" 
          waveOpacity={0.5} 
          className="w-full h-full" 
        />
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeInOut" }} 
          className="w-full max-w-md"
        >
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl relative">
            <div className="absolute top-4 left-4">
              <Link to="/" className="inline-flex items-center text-[#3DFDFF] hover:text-[#3DFDFF]/80 transition-colors group">
                <Home className="mr-1.5 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Home
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold text-center mt-8 mb-6 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              Welcome Back
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="identifier" className="text-white mb-1.5 block">Email or Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="identifier" 
                    type="text" 
                    placeholder="Enter your email or username" 
                    className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF] focus:ring-[#3DFDFF]/30" 
                    value={identifier} 
                    onChange={e => setIdentifier(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label htmlFor="password" className="text-white">Password</Label>
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
                    className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF] focus:ring-[#3DFDFF]/30" 
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
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
