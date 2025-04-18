
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { AlertTriangle, BookOpen, CheckCircle2, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMoodColor } from '@/utils/moodUtils';
import { Card, CardContent } from '@/components/ui/card';

// Define types for our data
type StudentData = {
  id: string;
  name: string;
  latestMood?: string;
  completedActivities: string[];
};

type DashboardStats = {
  averageMood: string;
  activitiesCompleted: number;
  sharedJournals: number;
  moodAlerts: number;
};

const ClinicianDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    averageMood: 'Excited',
    activitiesCompleted: 0,
    sharedJournals: 0,
    moodAlerts: 0
  });

  // Activities that we want to track
  const trackedActivities = ['Emotional Airbnb', 'Digital Detox', 'Confidence'];

  useEffect(() => {
    const checkClinicianAccess = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error || !userData || userData.user_type !== 1) {
          navigate('/dashboard');
          return;
        }

        // Once we confirm user is a clinician, fetch dashboard data
        await fetchDashboardData();
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        navigate('/dashboard');
      }
    };

    checkClinicianAccess();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all student users (user_type = 2)
      const { data: studentUsers, error: userError } = await supabase
        .from('users')
        .select('id, name')
        .eq('user_type', 2);

      if (userError) {
        console.error('Error fetching students:', userError);
        return;
      }

      // Create array to hold student data
      const studentsData: StudentData[] = [];
      let totalActivities = 0;
      let totalJournals = 0;
      let alertsCount = 0;
      const moodCounts: Record<string, number> = {};
      
      // For each student, fetch their mood and activities
      for (const student of studentUsers || []) {
        // Fetch latest mood for the student
        const today = new Date().toISOString().split('T')[0];
        const { data: moodData, error: moodError } = await supabase
          .from('mood_data')
          .select('mood')
          .eq('user_id', student.id)
          .gte('created_at', today)
          .order('created_at', { ascending: false })
          .limit(1);

        if (moodError) {
          console.error(`Error fetching mood for ${student.name}:`, moodError);
        }

        const latestMood = moodData && moodData.length > 0 ? moodData[0].mood : undefined;
        
        // Track mood for statistics
        if (latestMood) {
          moodCounts[latestMood] = (moodCounts[latestMood] || 0) + 1;
          
          // Check if it's an alert mood (angry, overwhelmed, sad, anxious)
          if (['Angry', 'Overwhelmed', 'Sad', 'Anxious'].includes(latestMood)) {
            alertsCount++;
          }
        }

        // Fetch completed activities for the student
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activity_completions')
          .select('activity_name')
          .eq('user_id', student.id)
          .gte('completed_at', today);

        if (activitiesError) {
          console.error(`Error fetching activities for ${student.name}:`, activitiesError);
        }

        const completedActivities = activitiesData?.map(a => a.activity_name) || [];
        totalActivities += completedActivities.length;

        // Add student to our array
        studentsData.push({
          id: student.id,
          name: student.name,
          latestMood,
          completedActivities: completedActivities
        });
      }

      // Fetch total journal entries
      const { count: journalCount, error: journalError } = await supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true });

      if (journalError) {
        console.error('Error fetching journal count:', journalError);
      } else {
        totalJournals = journalCount || 0;
      }

      // Calculate most common mood
      let mostCommonMood = 'Excited';
      let maxCount = 0;
      
      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
          mostCommonMood = mood;
          maxCount = count;
        }
      });

      // Update state with fetched data
      setStudents(studentsData);
      setStats({
        averageMood: mostCommonMood,
        activitiesCompleted: totalActivities,
        sharedJournals: totalJournals,
        moodAlerts: alertsCount
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Function to render mood emoji based on mood string
  const renderMoodEmoji = (mood?: string) => {
    if (!mood) return '😐';
    
    switch (mood) {
      case 'Happy': return '😊';
      case 'Excited': return '😃';
      case 'Calm': return '😌';
      case 'Angry': return '😠';
      case 'Sad': return '😢';
      case 'Anxious': return '😰';
      case 'Overwhelmed': return '😫';
      default: return '😐';
    }
  };

  // Function to render activity completion status
  const renderActivityStatus = (student: StudentData, activityName: string) => {
    return student.completedActivities.includes(activityName) ? (
      <CheckCircle2 className="h-6 w-6 text-[#2AC20E]" />
    ) : (
      <div className="h-6 w-6 border rounded-md"></div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC68B3]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
            Clinician Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Average Mood Card */}
          <Card className="bg-[#e6f7f7] border-0 shadow-sm overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#91d7d0] rounded-full p-3">
                  {renderMoodEmoji(stats.averageMood)}
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Average Mood</p>
                  <h3 className="text-4xl font-bold">{stats.averageMood}</h3>
                </div>
              </div>
              <div className="mt-4 opacity-50">
                <svg viewBox="0 0 100 20" className="w-full">
                  <path
                    fill="none"
                    stroke="#FF8A48"
                    strokeWidth="2"
                    d="M0,10 C30,2 40,18 50,10 C60,2 70,18 100,10"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Activities Completed Card */}
          <Card className="bg-[#fef7e2] border-0 shadow-sm overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#f3d06c] rounded-full p-3">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Activities Completed</p>
                  <h3 className="text-4xl font-bold">{stats.activitiesCompleted}</h3>
                </div>
              </div>
              <div className="mt-4 opacity-50">
                <svg viewBox="0 0 100 20" className="w-full">
                  <path
                    fill="none"
                    stroke="#FF8A48"
                    strokeWidth="2"
                    d="M0,10 C30,2 40,18 50,10 C60,2 70,18 100,10"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Shared Journals Card */}
          <Card className="bg-[#feede6] border-0 shadow-sm overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#f0a583] rounded-full p-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Shared Journals</p>
                  <h3 className="text-4xl font-bold">{stats.sharedJournals}</h3>
                </div>
              </div>
              <div className="mt-4 opacity-50">
                <svg viewBox="0 0 100 20" className="w-full">
                  <path
                    fill="none"
                    stroke="#3DFDFF"
                    strokeWidth="2"
                    d="M0,10 C30,2 40,18 50,10 C60,2 70,18 100,10"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Mood Alerts Card */}
          <Card className="bg-[#feeded] border-0 shadow-sm overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#f0937d] rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Mood Alerts</p>
                  <h3 className="text-4xl font-bold">{stats.moodAlerts}</h3>
                </div>
              </div>
              <div className="mt-4 opacity-50">
                <svg viewBox="0 0 100 20" className="w-full">
                  <path
                    fill="none"
                    stroke="#FF8A48"
                    strokeWidth="2"
                    d="M0,10 C30,2 40,18 50,10 C60,2 70,18 100,10"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Students Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-1/4 py-4 px-6 font-bold">Student Name</TableHead>
                <TableHead className="w-1/4 py-4 px-6 font-bold">Mood Status</TableHead>
                <TableHead className="py-4 px-6 text-center font-bold" colSpan={trackedActivities.length}>
                  Activities
                </TableHead>
              </TableRow>
              <TableRow className="bg-gray-50">
                <TableHead className="py-2"></TableHead>
                <TableHead className="py-2"></TableHead>
                {trackedActivities.map(activity => (
                  <TableHead key={activity} className="py-2 px-4 text-center font-medium text-sm">
                    {activity}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id} className="hover:bg-gray-50 border-t">
                  <TableCell className="py-3 px-6">{student.name}</TableCell>
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: getMoodColor(student.latestMood || 'default') }}
                      >
                        {renderMoodEmoji(student.latestMood)}
                      </div>
                      <span>{student.latestMood || 'No data'}</span>
                    </div>
                  </TableCell>
                  {trackedActivities.map(activity => (
                    <TableCell key={`${student.id}-${activity}`} className="py-3 px-4 text-center">
                      {renderActivityStatus(student, activity)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3 + trackedActivities.length} className="py-6 text-center text-gray-500">
                    No student data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ClinicianDashboard;
