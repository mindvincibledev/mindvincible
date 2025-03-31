
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Here we would typically connect to Supabase for authentication
      // For now, just simulate a login process
      console.log('Logging in with:', { email, password });
      setTimeout(() => {
        setLoading(false);
        // Redirect would happen here after successful login
      }, 1500);
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      
      <WavyBackground 
        colors={["#FF8A48", "#D5D5F1", "#3DFDFF", "#F5DF4D", "#FC68B3", "#2AC20E"]}
        waveWidth={50}
        backgroundFill="black"
        blur={10}
        speed="fast"
        waveOpacity={0.5}
        className="max-w-4xl mx-auto"
      >
        <div className="flex-grow flex items-center justify-center px-4 py-24 min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full max-w-md"
          >
            <div className="card bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-white">Welcome Back</h2>
              
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400 text-white px-4 py-3 rounded-lg mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-[#3DFDFF] hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:from-[#FF8A48] hover:to-[#FC68B3] text-white transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="mt-4 text-center text-white">
                  <p>Don't have an account? <Link to="/register" className="text-[#3DFDFF] hover:underline">Sign up</Link></p>
                </div>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black/40 text-gray-300">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="py-2 px-4 border border-white/20 rounded-md shadow-sm bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 transition-colors focus:outline-none"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    className="py-2 px-4 border border-white/20 rounded-md shadow-sm bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 transition-colors focus:outline-none"
                  >
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </WavyBackground>
      
      <Footer />
    </div>
  );
};

export default Login;
