
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Wave from '@/components/Wave';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    guardian1_name: '',
    guardian1_phone: '',
    guardian2_name: '',
    guardian2_phone: '',
    user_phone: '',
    address: '',
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    
    // Validate first step
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only process submission if on the final step
    if (step !== 3) {
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // First, create the auth user with display name
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            guardian1_name: formData.guardian1_name,
            guardian1_phone: formData.guardian1_phone,
            guardian2_name: formData.guardian2_name,
            guardian2_phone: formData.guardian2_phone,
            user_phone: formData.user_phone,
            address: formData.address,
            password: formData.password,
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // If successful, the trigger will automatically create the user record
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Wave />
      </div>
      
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeInOut" }} 
          className="w-full max-w-2xl"
        >
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              Create Your M(in)dvincible Account
            </h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white rounded-md p-3 mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white mb-1.5 block">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="name" className="text-white mb-1.5 block">Full Name *</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Enter your full name" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password" className="text-white mb-1.5 block">Password *</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Create a password" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword" className="text-white mb-1.5 block">Confirm Password *</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="Confirm your password" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user_phone" className="text-white mb-1.5 block">Your Phone Number</Label>
                      <Input 
                        id="user_phone" 
                        type="tel" 
                        placeholder="Your phone number" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.user_phone} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address" className="text-white mb-1.5 block">Your Address</Label>
                      <Input 
                        id="address" 
                        type="text" 
                        placeholder="Your address" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.address} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="guardian1_name" className="text-white mb-1.5 block">Guardian 1 Name</Label>
                      <Input 
                        id="guardian1_name" 
                        type="text" 
                        placeholder="Guardian 1 name" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.guardian1_name} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="guardian1_phone" className="text-white mb-1.5 block">Guardian 1 Phone</Label>
                      <Input 
                        id="guardian1_phone" 
                        type="tel" 
                        placeholder="Guardian 1 phone number" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.guardian1_phone} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="guardian2_name" className="text-white mb-1.5 block">Guardian 2 Name</Label>
                      <Input 
                        id="guardian2_name" 
                        type="text" 
                        placeholder="Guardian 2 name" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.guardian2_name} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="guardian2_phone" className="text-white mb-1.5 block">Guardian 2 Phone</Label>
                      <Input 
                        id="guardian2_phone" 
                        type="tel" 
                        placeholder="Guardian 2 phone number" 
                        className="bg-black/30 border-white/10 text-white placeholder:text-gray-400 focus:border-[#3DFDFF]" 
                        value={formData.guardian2_phone} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handlePrevStep}
                    className="border-[#3DFDFF]/50 text-[#3DFDFF] hover:bg-[#3DFDFF]/10"
                  >
                    Previous
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button 
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="ml-auto bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-white/70">
                Already have an account?{' '}
                <Link to="/login" className="text-[#3DFDFF] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
