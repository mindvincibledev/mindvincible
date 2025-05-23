
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfDay, endOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';
import ActivityDropdown from '@/components/ActivityDropdown';
import { Database } from '@/integrations/supabase/types';

type MoodType = Database['public']['Enums']['mood_type'];

interface StudentActivityData {
  id: string;
  name: string;
  mood: MoodType;
  moodTimestamp: string;
  completedActivities: string[];
}

const StudentCenter = () => {
  const [students, setStudents] = useState<StudentActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    checkUserType();
    if (user) {
      fetchStudentActivity();
    }
  }, [user]);

  const checkUserType = async () => {
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
      
      if (error) throw error;
      
      // Only clinicians (user_type=1) should access this page
      if (userData.user_type !== 1) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        
        if (userData.user_type === 0) {
          navigate('/admin-dashboard');
        } else {
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

  const fetchStudentActivity = async () => {
    setLoading(true);
    try {
      const startOfToday = startOfDay(new Date()).toISOString();
      const endOfToday = endOfDay(new Date()).toISOString();
      
      // Get all students
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select('id, name')
        .eq('user_type', 2); // Only get students
      
      if (studentsError) throw studentsError;
      if (!studentsData || studentsData.length === 0) {
        setLoading(false);
        return;
      }
      
      const studentActivityPromises = studentsData.map(async (student) => {
        // Get the most recent mood entry for today
        const { data: moodData, error: moodError } = await supabase
          .from('mood_data')
          .select('*')
          .eq('user_id', student.id)
          .gte('created_at', startOfToday)
          .lte('created_at', endOfToday)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (moodError) throw moodError;
        
        // If no mood entry for today, skip this student
        if (!moodData || moodData.length === 0) {
          return null;
        }
        
        // Get activities completed after the mood entry
        const { data: activityData, error: activityError } = await supabase
          .from('activity_completions')
          .select('activity_name')
          .eq('user_id', student.id)
          .gte('completed_at', moodData[0].created_at)
          .lte('completed_at', endOfToday);
          
        if (activityError) throw activityError;
        
        const completedActivities = activityData?.map(activity => activity.activity_name) || [];
        
        return {
          id: student.id,
          name: student.name,
          mood: moodData[0].mood,
          moodTimestamp: moodData[0].created_at,
          completedActivities
        } as StudentActivityData;
      });
      
      const studentsWithActivity = (await Promise.all(studentActivityPromises))
        .filter((student): student is StudentActivityData => student !== null);
      
      // Sort by mood timestamp, most recent first
      studentsWithActivity.sort((a, b) => 
        new Date(b.moodTimestamp).getTime() - new Date(a.moodTimestamp).getTime()
      );
      
      setStudents(studentsWithActivity);
    } catch (error) {
      console.error("Error fetching student activity:", error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Unable to load student activity data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: MoodType) => {
    switch(mood) {
      case 'Happy': return '😊';
      case 'Sad': return '😔';
      case 'Angry': return '😡';
      case 'Anxious': return '😰';
      case 'Overwhelmed': return '😫';
      case 'Excited': return '🤩';
      case 'Calm': return '😌';
      default: return '😐';
    }
  };
  
  const getMoodBackground = (mood: MoodType) => {
    switch(mood) {
      case 'Happy': return 'bg-yellow-100';
      case 'Sad': return 'bg-blue-100';
      case 'Angry': return 'bg-red-100';
      case 'Anxious': return 'bg-purple-100';
      case 'Overwhelmed': return 'bg-orange-100';
      case 'Excited': return 'bg-pink-100';
      case 'Calm': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm a');
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Student Center</h1>
              <p className="text-gray-600 mt-1">{today}</p>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Track student activities completed after their daily mood entries.
              </p>
            </div>
            
            <Button
              className="mt-4 md:mt-0 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90"
              onClick={fetchStudentActivity}
            >
              Refresh Data
            </Button>
          </div>
          
          {loading ? (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle>Loading student activity...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-500" />
                  Student Activity Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-600">
                      No students have made mood entries today.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Student Name</TableHead>
                          <TableHead>Mood</TableHead>
                          <TableHead>Reported At</TableHead>
                          <TableHead className="w-[250px]">Activities Completed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell className={`${getMoodBackground(student.mood)}`}>
                              <div className="flex items-center">
                                <span className="text-xl mr-2">{getMoodEmoji(student.mood)}</span>
                                <span>{student.mood}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatDate(student.moodTimestamp)}
                            </TableCell>
                            <TableCell>
                              <ActivityDropdown completedActivities={student.completedActivities} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default StudentCenter;
