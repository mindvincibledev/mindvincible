
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        toast.success("Account created! Please verify your email if required.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
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
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-white text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-white mb-1.5 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF] focus:ring-[#3DFDFF]/30" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  {isLogin && (
                    <Link to="/forgot-password" className="text-sm text-[#3DFDFF] hover:text-[#3DFDFF]/80 transition-colors hover:underline">
                      Forgot Password?
                    </Link>
                  )}
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
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
              </Button>
              
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-[#3DFDFF] hover:text-[#3DFDFF]/80 text-sm"
                >
                  {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
