
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import Navbar from '@/components/Navbar';
import { LoaderCircle } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  activityCounts: {
    emotionalAirbnb: number;
    forkInRoadDecisions: number;
    groundingResponses: number;
    simpleHiChallenges: number;
    batteryBoostEntries: number;
    confidenceTreeReflections: number;
  };
}

const SharedResponses = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentData[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkClinicianAccess();
    if (user) {
      fetchStudentData();
    }
  }, [user]);

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
      
      if (error) throw error;
      
      // Check if user is not a clinician (user_type=1)
      if (userData.user_type !== 1) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only clinicians can access shared responses.",
        });
        
        // Redirect based on user type
        if (userData.user_type === 0) {
          navigate('/admin-dashboard');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error("Error checking user access:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "There was a problem verifying your account.",
      });
      navigate('/home');
    }
  };

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // Get all students
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select('id, name')
        .eq('user_type', 2);
      
      if (studentsError) throw studentsError;

      // For each student, get counts of visible entries from each activity type
      const studentsWithActivityCounts = await Promise.all(
        studentsData.map(async (student) => {
          // Count emotional airbnb entries
          const { count: airbnbCount, error: airbnbError } = await supabase
            .from('emotional_airbnb')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', student.id)
            .eq('visibility', true);
          
          if (airbnbError) console.error("Error fetching airbnb count:", airbnbError);

          // Count fork in road decisions
          const { count: decisionCount, error: decisionError } = await supabase
            .from('fork_in_road_decisions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', student.id)
            .eq('visibility', true);
          
          if (decisionError) console.error("Error fetching decisions count:", decisionError);

          // Count grounding responses
          const { count: groundingCount, error: groundingError } = await supabase
            .from('grounding_responses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', student.id)
            .eq('visibility', true);
          
          if (groundingError) console.error("Error fetching grounding count:", groundingError);

          // Count hi challenges
          const { count: hiCount, error: hiError } = await supabase
            .from('simple_hi_challenges')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', student.id)
            .eq('visibility', true);
          
          if (hiError) console.error("Error fetching hi challenges count:", hiError);

          // Count battery boost entries
          const { count: batteryCount, error: batteryError } = await supabase
            .from('battery_boost_entries')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', student.id)
            .eq('visible_to_clinicians', true);
          
          if (batteryError) console.error("Error fetching battery boost count:", batteryError);

          // Count confidence tree reflections
          const { count: confidenceCount, error: confidenceError } = await supabase
            .from('confidence_tree_reflections')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', student.id)
            .eq('is_visible_to_clinicians', true);
          
          if (confidenceError) console.error("Error fetching confidence tree count:", confidenceError);

          return {
            id: student.id,
            name: student.name,
            activityCounts: {
              emotionalAirbnb: airbnbCount || 0,
              forkInRoadDecisions: decisionCount || 0,
              groundingResponses: groundingCount || 0,
              simpleHiChallenges: hiCount || 0,
              batteryBoostEntries: batteryCount || 0,
              confidenceTreeReflections: confidenceCount || 0
            }
          };
        })
      );

      setStudents(studentsWithActivityCounts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast({
        variant: "destructive",
        title: "Data Loading Error",
        description: "Failed to load shared responses. Please try again.",
      });
      setLoading(false);
    }
  };

  // Calculate total number of shared responses for a student
  const getTotalResponses = (student: StudentData) => {
    const { 
      emotionalAirbnb, 
      forkInRoadDecisions, 
      groundingResponses, 
      simpleHiChallenges, 
      batteryBoostEntries, 
      confidenceTreeReflections 
    } = student.activityCounts;
    return emotionalAirbnb + forkInRoadDecisions + groundingResponses + simpleHiChallenges + batteryBoostEntries + confidenceTreeReflections;
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Student Shared Responses</h1>
              <p className="text-gray-600 mt-1">View responses students have shared with you</p>
            </div>
            <Button 
              variant="outline"
              className="border-[#FC68B3] text-[#FC68B3] hover:bg-[#FC68B3]/10"
              onClick={() => navigate('/clinician-dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoaderCircle className="h-8 w-8 animate-spin text-[#FC68B3]" />
              <span className="ml-2 text-lg">Loading shared responses...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.length > 0 ? (
                students.map((student) => (
                  <Card 
                    key={student.id} 
                    className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate(`/shared-responses/${student.id}`)}
                  >
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">{student.name}</h2>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Emotional Airbnb</span>
                          <span className="font-semibold">{student.activityCounts.emotionalAirbnb} entries</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fork in the Road</span>
                          <span className="font-semibold">{student.activityCounts.forkInRoadDecisions} entries</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Grounding Technique</span>
                          <span className="font-semibold">{student.activityCounts.groundingResponses} entries</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Power of Hi</span>
                          <span className="font-semibold">{student.activityCounts.simpleHiChallenges} entries</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Battery Boost</span>
                          <span className="font-semibold">{student.activityCounts.batteryBoostEntries} entries</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence Tree</span>
                          <span className="font-semibold">{student.activityCounts.confidenceTreeReflections} entries</span>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200 mt-3">
                          <div className="flex justify-between font-semibold">
                            <span>Total Shared Responses:</span>
                            <span className="text-[#FC68B3]">{getTotalResponses(student)}</span>
                          </div>
                          
                          <Button 
                            className="w-full mt-4 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-white"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <h3 className="text-xl font-medium text-gray-600">No students with shared responses found.</h3>
                  <p className="text-gray-500 mt-1">When students share their responses, they will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default SharedResponses;
