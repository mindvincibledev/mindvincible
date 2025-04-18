
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, Book, CheckCircle2, Frown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import Navbar from '@/components/Navbar';
import Wave from '@/components/Wave';
import { format } from 'date-fns';

// Define interfaces for our data
interface StudentData {
  id: string;
  name: string;
  latestMood: string;
  completedActivities: string[];
}

interface StatData {
  averageMood: string;
  activitiesCompleted: number;
  sharedJournals: number;
  moodAlerts: number;
}

const ClinicianDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [stats, setStats] = useState<StatData>({
    averageMood: "-",
    activitiesCompleted: 0,
    sharedJournals: 0,
    moodAlerts: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    // Check if user is clinician
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
      
      // Check if user is not a clinician (user_type=1)
      if (userData.user_type !== 1) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        
        // Redirect based on user type
        if (userData.user_type === 0) {  // Admin
          navigate('/admin-dashboard');
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
      // Get all students
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select('id, name')
        .eq('user_type', 2); // Students have user_type = 2
      
      if (studentsError) throw studentsError;
      
      // Get today's date range for filtering
      const today = new Date();
      const startOfDay = new Date(today.setHours(0,0,0,0)).toISOString();
      const endOfDay = new Date(today.setHours(23,59,59,999)).toISOString();
      
      // Get latest mood entries for today
      const { data: moodData, error: moodError } = await supabase
        .from('mood_data')
        .select('user_id, mood, created_at')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('created_at', { ascending: false });
      
      if (moodError) throw moodError;
      
      // Get activity completions for today
      const { data: activityData, error: activityError } = await supabase
        .from('activity_completions')
        .select('user_id, activity_name, completed_at')
        .gte('completed_at', startOfDay)
        .lte('completed_at', endOfDay);
      
      if (activityError) throw activityError;
      
      // Get journal entries
      const { data: journalData, error: journalError } = await supabase
        .from('journal_entries')
        .select('count')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .single();
      
      if (journalError && journalError.code !== 'PGRST116') throw journalError;
      
      // Process student data
      const processedStudents: StudentData[] = [];
      const processedActivities = new Set<string>();
      
      // Create a map for the latest mood per student
      const latestStudentMoods = new Map();
      moodData?.forEach(entry => {
        if (!latestStudentMoods.has(entry.user_id) || 
            new Date(entry.created_at) > new Date(latestStudentMoods.get(entry.user_id).created_at)) {
          latestStudentMoods.set(entry.user_id, entry);
        }
      });
      
      // Create a map of activities completed by each student
      const studentActivities = new Map();
      activityData?.forEach(activity => {
        if (!studentActivities.has(activity.user_id)) {
          studentActivities.set(activity.user_id, []);
        }
        studentActivities.get(activity.user_id).push(activity.activity_name);
        processedActivities.add(activity.activity_name);
      });
      
      // Build the complete student data array
      studentsData?.forEach(student => {
        const latestMood = latestStudentMoods.get(student.id);
        processedStudents.push({
          id: student.id,
          name: student.name,
          latestMood: latestMood ? latestMood.mood : '-',
          completedActivities: studentActivities.get(student.id) || []
        });
      });
      
      // Calculate stats
      // Count mood types for average calculation
      const moodCounts: Record<string, number> = {};
      let mostCommonMood = "-";
      let maxCount = 0;
      
      moodData?.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        if (moodCounts[entry.mood] > maxCount) {
          maxCount = moodCounts[entry.mood];
          mostCommonMood = entry.mood;
        }
      });
      
      // Count mood alerts (angry, overwhelmed, sad, or anxious moods)
      const alertMoods = ['Angry', 'Overwhelmed', 'Sad', 'Anxious'];
      const uniqueStudentsWithAlertMoods = new Set();
      
      moodData?.forEach(entry => {
        if (alertMoods.includes(entry.mood)) {
          uniqueStudentsWithAlertMoods.add(entry.user_id);
        }
      });
      
      // Set stats
      setStats({
        averageMood: mostCommonMood,
        activitiesCompleted: activityData?.length || 0,
        sharedJournals: journalData?.count || 0,
        moodAlerts: uniqueStudentsWithAlertMoods.size
      });
      
      // Set processed student data
      setStudents(processedStudents);
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
  
  // Function to get emoji based on mood
  const getMoodEmoji = (mood: string) => {
    switch(mood.toLowerCase()) {
      case 'happy': return '😊';
      case 'excited': return '😄';
      case 'calm': return '😌';
      case 'sad': return '😔';
      case 'angry': return '😡';
      case 'anxious': return '😰';
      case 'overwhelmed': return '😫';
      default: return '😐';
    }
  };
  
  // Function to get background color based on mood
  const getMoodBackground = (mood: string) => {
    switch(mood.toLowerCase()) {
      case 'happy': 
      case 'excited': 
      case 'calm': return 'bg-green-100';
      case 'sad': return 'bg-blue-100';
      case 'angry': 
      case 'anxious': 
      case 'overwhelmed': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };
  
  // Function to get icon color based on stat type
  const getStatColor = (statType: string) => {
    switch(statType) {
      case 'mood': return 'text-blue-500';
      case 'activities': return 'text-yellow-500';
      case 'journals': return 'text-pink-500';
      case 'alerts': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const activities = ['Emotional Airbnb', 'Digital Detox', 'Confidence'];

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Clinician Dashboard</h1>
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
                {/* Average Mood Card */}
                <Card className="bg-[#e0f7fa]/70 backdrop-blur-sm p-6 shadow-lg rounded-lg border-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#80deea] mr-3">
                      <Frown className="h-6 w-6 text-[#006064]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Average Mood</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 mr-2">
                      {getMoodEmoji(stats.averageMood)}
                    </span>
                    <span className="text-xl font-semibold text-gray-800">
                      {stats.averageMood.charAt(0).toUpperCase() + stats.averageMood.slice(1)}
                    </span>
                  </div>
                  <Wave className="text-[#80deea]" />
                </Card>
                
                {/* Activities Completed Card */}
                <Card className="bg-[#fff8e1]/70 backdrop-blur-sm p-6 shadow-lg rounded-lg border-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#ffe082] mr-3">
                      <CheckCircle2 className="h-6 w-6 text-[#ff8f00]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Activities Completed</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 mr-2">
                      {stats.activitiesCompleted}
                    </span>
                  </div>
                  <Wave className="text-[#ffe082]" />
                </Card>
                
                {/* Shared Journals Card */}
                <Card className="bg-[#ffebee]/70 backdrop-blur-sm p-6 shadow-lg rounded-lg border-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#ffcdd2] mr-3">
                      <Book className="h-6 w-6 text-[#c62828]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Shared Journals</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 mr-2">
                      {stats.sharedJournals}
                    </span>
                  </div>
                  <Wave className="text-[#ffcdd2]" />
                </Card>
                
                {/* Mood Alerts Card */}
                <Card className="bg-[#fce4ec]/70 backdrop-blur-sm p-6 shadow-lg rounded-lg border-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#f8bbd0] mr-3">
                      <AlertTriangle className="h-6 w-6 text-[#c2185b]" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Mood Alerts</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 mr-2">
                      {stats.moodAlerts}
                    </span>
                  </div>
                  <Wave className="text-[#f8bbd0]" />
                </Card>
              </div>
              
              {/* Students Table */}
              <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold mb-6">Student Overview</h2>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Student Name</TableHead>
                        <TableHead className="w-[200px]">Mood Status</TableHead>
                        {activities.map((activity) => (
                          <TableHead key={activity} className="text-center">{activity}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell className={`${getMoodBackground(student.latestMood)}`}>
                              <div className="flex items-center">
                                <span className="text-xl mr-2">{getMoodEmoji(student.latestMood)}</span>
                                <span>{student.latestMood.charAt(0).toUpperCase() + student.latestMood.slice(1)}</span>
                              </div>
                            </TableCell>
                            {activities.map((activity) => (
                              <TableCell key={activity} className="text-center">
                                {student.completedActivities.includes(activity) ? (
                                  <CheckCircle2 className="mx-auto h-6 w-6 text-[#2AC20E]" />
                                ) : (
                                  <div className="h-6 w-6 border border-gray-300 rounded-md mx-auto"></div>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4 + activities.length} className="text-center py-6">
                            No student data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ClinicianDashboard;
