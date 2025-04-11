
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';

interface MoodJar {
  id: string;
  image_path: string;
  created_at: string;
}

const RecentMoodJars = () => {
  const [moodJars, setMoodJars] = useState<MoodJar[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMoodJars();
    }
  }, [user]);

  const fetchMoodJars = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('mood_jar_table')
        .select('id, image_path, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching mood jars:', error);
        throw error;
      }
      
      if (data) {
        setMoodJars(data as MoodJar[]);
      }
    } catch (err) {
      console.error('Error processing mood jar data:', err);
      toast({
        variant: "destructive",
        title: "Failed to load mood jars",
        description: "There was an error loading your mood jars.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Link to="/home" className="mr-4">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-black">Your Mood Jar Gallery</h1>
              </div>
              
              <Link to="/mood-jar">
                <Button className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:opacity-90 text-black font-medium flex items-center gap-2">
                  <PlusCircle size={18} />
                  <span className="hidden sm:inline">Create New Mood Jar</span>
                  <span className="sm:hidden">New Jar</span>
                </Button>
              </Link>
            </div>
            
            <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 p-6 md:p-8 shadow-lg">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-[#F5DF4D] text-lg">Loading your mood jars...</p>
                </div>
              ) : moodJars.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 my-8">
                  <div className="text-gray-700 text-xl mb-6 text-center">
                    You haven't created any mood jars yet.
                  </div>
                  <Link to="/mood-jar">
                    <Button className="bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white flex items-center gap-2">
                      <PlusCircle size={18} />
                      <span>Create Your First Mood Jar</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {moodJars.map((jar) => (
                    <div key={jar.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="p-2 h-52">
                        <img 
                          src={jar.image_path} 
                          alt="Mood Jar" 
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <div className="p-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">Created on:</p>
                        <p className="text-sm font-medium">{formatDate(jar.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default RecentMoodJars;
