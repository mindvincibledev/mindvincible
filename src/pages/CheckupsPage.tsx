
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, AlertTriangle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/integrations/supabase/types';

// Define the mood type using the one from the database
type MoodType = Database['public']['Enums']['mood_type'];

interface StudentMoodData {
  id: string;
  name: string;
  latestConcerningMood: {
    mood: MoodType;
    timestamp: string;
    notes?: string;
  };
  activitiesCompleted: number;
  hasCompletedActivities: boolean;
}

const CheckupsPage = () => {
  const [students, setStudents] = useState<StudentMoodData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    checkUserType();
    if (user) {
      fetchStudentsWithConcerningMoods();
    }
  }, [user]);

  const checkUserType = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      // Check if user is clinician
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
        
        // Redirect based on user type
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

  const fetchStudentsWithConcerningMoods = async () => {
    setLoading(true);
    try {
      // Get timestamp for 24 hours ago
      const twentyFourHoursAgo = subDays(new Date(), 1).toISOString();
      
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
      
      // Define concerning moods - using the correct type
      const concerningMoods: MoodType[] = ['Sad', 'Overwhelmed', 'Anxious', 'Angry'];
      
      // Fetch mood data and activity completions for each student in the past 24 hours
      const studentMoodPromises = studentsData.map(async (student) => {
        // Get the most recent concerning mood for this student in the last 24 hours
        const { data: moodData, error: moodError } = await supabase
          .from('mood_data')
          .select('*')
          .eq('user_id', student.id)
          .gte('created_at', twentyFourHoursAgo)
          .in('mood', concerningMoods)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (moodError) throw moodError;
        
        // If the student has no concerning moods in the last 24 hours, skip them
        if (!moodData || moodData.length === 0) {
          return null;
        }
        
        // Get activities completed by this student after their concerning mood
        const { data: activityData, error: activityError } = await supabase
          .from('activity_completions')
          .select('*')
          .eq('user_id', student.id)
          .gte('completed_at', moodData[0].created_at);
          
        if (activityError) throw activityError;
        
        // Return the student data with mood and activity information
        return {
          id: student.id,
          name: student.name,
          latestConcerningMood: {
            mood: moodData[0].mood,
            timestamp: moodData[0].created_at,
            notes: moodData[0].notes,
          },
          activitiesCompleted: activityData?.length || 0,
          hasCompletedActivities: activityData && activityData.length > 0
        } as StudentMoodData; // Use type assertion here
      });
      
      // Wait for all promises to resolve
      const studentsWithMoodData = (await Promise.all(studentMoodPromises))
        .filter((student): student is StudentMoodData => student !== null);
      
      // Sort by timestamp, most recent first
      studentsWithMoodData.sort((a, b) => 
        new Date(b.latestConcerningMood.timestamp).getTime() - 
        new Date(a.latestConcerningMood.timestamp).getTime()
      );
      
      setStudents(studentsWithMoodData);
    } catch (error) {
      console.error("Error fetching students with concerning moods:", error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Unable to load student mood data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: MoodType) => {
    switch(mood) {
      case 'Sad': return '😔';
      case 'Angry': return '😡';
      case 'Anxious': return '😰';
      case 'Overwhelmed': return '😫';
      default: return '😐';
    }
  };
  
  // Function to get background color based on mood
  const getMoodBackground = (mood: MoodType) => {
    switch(mood) {
      case 'Sad': return 'bg-blue-100';
      case 'Angry': return 'bg-red-100';
      case 'Anxious': return 'bg-purple-100';
      case 'Overwhelmed': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  // Format date for display
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Student Checkups</h1>
              <p className="text-gray-600 mt-1">{today}</p>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Showing students who reported feeling overwhelmed, sad, angry, or anxious in the last 24 hours
                and their activity completion status.
              </p>
            </div>
            
            <Button
              className="mt-4 md:mt-0 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90"
              onClick={fetchStudentsWithConcerningMoods}
            >
              Refresh Data
            </Button>
          </div>
          
          {loading ? (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle>Loading student data...</CardTitle>
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
                  <AlertTriangle className="h-6 w-6 mr-2 text-amber-500" />
                  Students Requiring Checkups
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-600">
                      No students have reported concerning moods in the past 24 hours.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Student</TableHead>
                          <TableHead>Mood</TableHead>
                          <TableHead>Reported At</TableHead>
                          <TableHead className="text-center">Activities Completed</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell className={`${getMoodBackground(student.latestConcerningMood.mood)}`}>
                              <div className="flex items-center">
                                <span className="text-xl mr-2">{getMoodEmoji(student.latestConcerningMood.mood)}</span>
                                <span>{student.latestConcerningMood.mood}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatDate(student.latestConcerningMood.timestamp)}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.activitiesCompleted}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.hasCompletedActivities ? (
                                <div className="flex items-center justify-center">
                                  <Check className="h-6 w-6 text-green-500" />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center">
                                  <X className="h-6 w-6 text-red-500" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                className="border-[#FC68B3] text-[#FC68B3] hover:bg-[#FC68B3]/10"
                                onClick={() => navigate(`/shared-responses/${student.id}`)}
                              >
                                View Responses
                              </Button>
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

export default CheckupsPage;
