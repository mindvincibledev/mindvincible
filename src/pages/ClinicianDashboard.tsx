import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Users, Book, CheckCircle2, Frown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import Navbar from '@/components/Navbar';
import Wave from '@/components/Wave';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import StudentOverviewTable from '@/components/dashboard/StudentOverviewTable';

const ClinicianDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [clinicianName, setClinicianName] = useState('');
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState(['Emotional Airbnb', 'Digital Detox', 'Confidence']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    if (user) {
      checkUserType();
      fetchClinicianName();
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

  const fetchClinicianName = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) setClinicianName(data.name);
    } catch (error) {
      console.error('Error fetching clinician name:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get current week's date range
      const now = new Date();
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);

      // Get all students
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select('id, name')
        .eq('user_type', 2);

      if (studentsError) throw studentsError;

      // Get weekly mood data for each student
      const { data: weeklyMoodData, error: moodError } = await supabase
        .from('mood_data')
        .select('user_id, mood, created_at')
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      if (moodError) throw moodError;

      // Get activities completed this week
      const { data: activityData, error: activityError } = await supabase
        .from('activity_completions')
        .select('user_id, activity_name')
        .gte('completed_at', weekStart.toISOString())
        .lte('completed_at', weekEnd.toISOString());

      if (activityError) throw activityError;

      // Get shared responses count for the week
      const { data: journalData, error: journalError } = await supabase
        .from('journal_entries')
        .select('user_id')
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      if (journalError) throw journalError;

      // Process student data
      const processedStudents = studentsData?.map(student => {
        // Calculate weekly average mood
        const studentMoods = weeklyMoodData?.filter(m => m.user_id === student.id) || [];
        const moodCounts: Record<string, number> = {};
        let mostCommonMood = "No mood data";
        let maxCount = 0;

        studentMoods.forEach(entry => {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
          if (moodCounts[entry.mood] > maxCount) {
            maxCount = moodCounts[entry.mood];
            mostCommonMood = entry.mood;
          }
        });

        // Get completed activities
        const completedActivities = activityData
          ?.filter(a => a.user_id === student.id)
          .map(a => a.activity_name) || [];

        // Get shared responses count
        const sharedResponses = journalData
          ?.filter(j => j.user_id === student.id)
          .length || 0;

        return {
          id: student.id,
          name: student.name,
          weeklyAverageMood: mostCommonMood,
          completedActivities,
          sharedResponses
        };
      }) || [];

      setStudents(processedStudents);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome, {clinicianName}</h1>
              <p className="text-gray-600 mt-1">{today}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-primary">Loading dashboard data...</p>
            </div>
          ) : (
            <StudentOverviewTable students={students} activities={activities} />
          )}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ClinicianDashboard;
