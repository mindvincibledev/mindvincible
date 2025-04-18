
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Users, Activity, BarChart3, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import Navbar from '@/components/Navbar';
import Wave from '@/components/Wave';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClinicians: 0,
    totalActivities: 0,
    totalMoodEntries: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    // Check if user is admin
    checkUserType();
    
    // Load dashboard data
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const checkUserType = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      // Manually check the user type from the users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // Check if user is not an admin (user_type=0)
      if (userData.user_type !== 0) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        
        // Redirect based on user type
        if (userData.user_type === 1) {  // Clinician
          navigate('/clinician-dashboard');
        } else {  // Student or other
          navigate('/home');
        }
      }
    } catch (error) {
      console.error("Error checking user type:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "There was a problem verifying your account.",
      });
      navigate('/home');
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get total students count
      const { count: studentsCount, error: studentsError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 2);
      
      if (studentsError) throw studentsError;
      
      // Get total clinicians count
      const { count: cliniciansCount, error: cliniciansError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 1);
      
      if (cliniciansError) throw cliniciansError;
      
      // Get total activities count
      const { count: activitiesCount, error: activitiesError } = await supabase
        .from('activity_completions')
        .select('*', { count: 'exact', head: true });
      
      if (activitiesError) throw activitiesError;
      
      // Get total mood entries count
      const { count: moodEntriesCount, error: moodEntriesError } = await supabase
        .from('mood_data')
        .select('*', { count: 'exact', head: true });
      
      if (moodEntriesError) throw moodEntriesError;
      
      // Set stats
      setStats({
        totalStudents: studentsCount || 0,
        totalClinicians: cliniciansCount || 0,
        totalActivities: activitiesCount || 0,
        totalMoodEntries: moodEntriesCount || 0
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Data Loading Error",
        description: "Failed to load dashboard data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">{today}</p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-primary">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Students Card */}
                <Card className="bg-[#e3f2fd]/70 backdrop-blur-sm p-6 shadow-lg rounded-lg border-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#90caf9] mr-3">
                      <Users className="h-6 w-6 text-[#0d47a1]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Total Students</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {stats.totalStudents}
                    </span>
                  </div>
                  <Wave className="text-[#90caf9]" />
                </Card>
                
                {/* Total Clinicians Card */}
                <Card className="bg-[#e8f5e9]/70 backdrop-blur-sm p-6 shadow-lg rounded-lg border-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#a5d6a7] mr-3">
                      <Users className="h-6 w-6 text-[#1b5e20]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Total Clinicians</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {stats.totalClinicians}
                    </span>
                  </div>
                  <Wave className="text-[#a5d6a7]" />
                </Card>
                
                {/* Total Activities Card */}
                <Card className="bg-[#fff3e0]/70 backdrop-blur-sm p-6 shadow-lg rounded-lg border-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#ffcc80] mr-3">
                      <Activity className="h-6 w-6 text-[#e65100]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Total Activities</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {stats.totalActivities}
                    </span>
                  </div>
                  <Wave className="text-[#ffcc80]" />
                </Card>
                
                {/* Total Mood Entries Card */}
                <Card className="bg-[#f3e5f5]/70 backdrop-blur-sm p-6 shadow-lg rounded-lg border-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#ce93d8] mr-3">
                      <BarChart3 className="h-6 w-6 text-[#4a148c]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Total Mood Entries</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {stats.totalMoodEntries}
                    </span>
                  </div>
                  <Wave className="text-[#ce93d8]" />
                </Card>
              </div>
              
              {/* Admin Management Section */}
              <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold mb-6">System Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Users className="h-8 w-8 text-[#FF8A48] mr-3" />
                      <h3 className="text-lg font-semibold">User Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Add, edit, or remove users from the system</p>
                    <button className="text-[#FC68B3] hover:underline font-medium">
                      Manage Users →
                    </button>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Activity className="h-8 w-8 text-[#3DFDFF] mr-3" />
                      <h3 className="text-lg font-semibold">Activity Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Configure available activities and resources</p>
                    <button className="text-[#FC68B3] hover:underline font-medium">
                      Manage Activities →
                    </button>
                  </Card>
                  
                  <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <Settings className="h-8 w-8 text-[#F5DF4D] mr-3" />
                      <h3 className="text-lg font-semibold">System Settings</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Configure global system settings</p>
                    <button className="text-[#FC68B3] hover:underline font-medium">
                      Manage Settings →
                    </button>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default AdminDashboard;
