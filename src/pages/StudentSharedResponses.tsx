import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Calendar, FileText, User } from 'lucide-react';
import { format } from 'date-fns';
import MediaDisplay from '@/components/shared/MediaDisplay';

interface Activity {
  id: string;
  created_at: string;
  // Additional fields will vary by activity type
  [key: string]: any;
}

interface ForkInRoadDecision {
  decision_id: string;
  created_at: string;
  challenges_a?: string | null;
  challenges_b?: string | null;
  change_a?: string | null;
  change_b?: string | null;
  choice?: string | null;
  consideration_path?: string | null;
  feel_a?: string | null;
  feel_b?: string | null;
  future_a?: string | null;
  future_b?: string | null;
  gain_a?: string | null;
  gain_b?: string | null;
  other_path?: string | null;
  selection?: string | null;
  strengths_a?: string[] | null;
  tag_a?: string[] | null;
  tag_b?: string[] | null;
  updated_at: string;
  user_id: string;
  values_a?: string | null;
  values_b?: string | null;
  visibility: boolean;
  [key: string]: any;
}

const StudentSharedResponses = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [emotionalAirbnbEntries, setEmotionalAirbnbEntries] = useState<Activity[]>([]);
  const [forkInRoadEntries, setForkInRoadEntries] = useState<Activity[]>([]);
  const [groundingEntries, setGroundingEntries] = useState<Activity[]>([]);
  const [hiChallengeEntries, setHiChallengeEntries] = useState<Activity[]>([]);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkClinicianAccess();
    if (user && studentId) {
      fetchStudentName();
      fetchSharedResponses();
    }
  }, [user, studentId]);

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
        
        navigate('/home');
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
  
  const fetchStudentName = async () => {
    if (!studentId) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', studentId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setStudentName(data.name);
      }
    } catch (error) {
      console.error("Error fetching student name:", error);
      toast({
        variant: "destructive",
        title: "Data Error",
        description: "Could not retrieve student information.",
      });
    }
  };

  const fetchSharedResponses = async () => {
    setLoading(true);
    
    try {
      // Fetch emotional airbnb entries
      const { data: airbnbData, error: airbnbError } = await supabase
        .from('emotional_airbnb')
        .select('*')
        .eq('user_id', studentId)
        .eq('visibility', true)
        .order('created_at', { ascending: false });
      
      if (airbnbError) throw airbnbError;
      
      // Fetch fork in road decisions
      const { data: decisionsData, error: decisionsError } = await supabase
        .from('fork_in_road_decisions')
        .select('*')
        .eq('user_id', studentId)
        .eq('visibility', true)
        .order('created_at', { ascending: false });
      
      if (decisionsError) throw decisionsError;
      
      // Fetch grounding responses
      const { data: groundingData, error: groundingError } = await supabase
        .from('grounding_responses')
        .select('*')
        .eq('user_id', studentId)
        .eq('visibility', true)
        .order('created_at', { ascending: false });
      
      if (groundingError) throw groundingError;
      
      // Fetch hi challenges
      const { data: hiChallengesData, error: hiChallengesError } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', studentId)
        .eq('visibility', true)
        .order('created_at', { ascending: false });
      
      if (hiChallengesError) throw hiChallengesError;
      
      setEmotionalAirbnbEntries(airbnbData || []);
      
      // Map decision_id to id for fork in road entries to make them compatible with Activity type
      const formattedDecisionsData = decisionsData ? decisionsData.map((decision: ForkInRoadDecision) => ({
        ...decision,
        id: decision.decision_id
      })) : [];
      
      setForkInRoadEntries(formattedDecisionsData);
      setGroundingEntries(groundingData || []);
      setHiChallengeEntries(hiChallengesData || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shared responses:", error);
      toast({
        variant: "destructive",
        title: "Data Loading Error",
        description: "Failed to load shared responses. Please try again.",
      });
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const renderEmotionalAirbnbEntries = () => {
    if (emotionalAirbnbEntries.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No shared Emotional Airbnb entries found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {emotionalAirbnbEntries.map((entry) => (
          <Accordion type="single" collapsible key={entry.id}>
            <AccordionItem value={entry.id}>
              <AccordionTrigger className="bg-white/80 hover:bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-[#FC68B3]" />
                    <span>{formatDate(entry.created_at)}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white/90 p-4 rounded-lg">
                <div className="space-y-4">
                  {entry.emotion_text && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Emotion</h4>
                      <p>{entry.emotion_text}</p>
                      {entry.emotion_drawing_path && (
                        <MediaDisplay 
                          filePath={entry.emotion_drawing_path} 
                          type="drawing" 
                          userId={studentId} 
                        />
                      )}
                    </div>
                  )}
                  
                  {entry.location_in_body_text && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Location in Body</h4>
                      <p>{entry.location_in_body_text}</p>
                      {entry.location_in_body_drawing_path && (
                        <MediaDisplay 
                          filePath={entry.location_in_body_drawing_path} 
                          type="drawing" 
                          userId={studentId}
                        />
                      )}
                    </div>
                  )}
                  
                  {entry.intensity_description_text && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Intensity</h4>
                      <p>{entry.intensity_description_text}</p>
                    </div>
                  )}
                  
                  {entry.appearance_description_text && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Appearance</h4>
                      <p>{entry.appearance_description_text}</p>
                    </div>
                  )}
                  
                  {entry.sound_text && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Sound</h4>
                      <p>{entry.sound_text}</p>
                    </div>
                  )}
                  
                  {entry.message_description_text && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Message</h4>
                      <p>{entry.message_description_text}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    );
  };
  
  // Render Fork in the Road entries
  const renderForkInRoadEntries = () => {
    if (forkInRoadEntries.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No shared Fork in the Road entries found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {forkInRoadEntries.map((entry) => (
          <Accordion type="single" collapsible key={entry.id || entry.decision_id}>
            <AccordionItem value={entry.id || entry.decision_id}>
              <AccordionTrigger className="bg-white/80 hover:bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#FC68B3]" />
                    <span>{formatDate(entry.created_at)}</span>
                    {entry.choice && (
                      <span className="ml-2 text-[#FC68B3]"> - Decision: {entry.choice}</span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white/90 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Path A */}
                  <div className="space-y-4 border-r pr-4">
                    <h4 className="font-bold text-lg">Path A</h4>
                    
                    {entry.tag_a && entry.tag_a.length > 0 && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Tags</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.tag_a.map((tag: string, i: number) => (
                            <span key={i} className="bg-[#FC68B3]/10 text-[#FC68B3] text-xs px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {entry.challenges_a && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Challenges</h5>
                        <p>{entry.challenges_a}</p>
                      </div>
                    )}
                    
                    {entry.feel_a && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Feelings</h5>
                        <p>{entry.feel_a}</p>
                      </div>
                    )}
                    
                    {entry.values_a && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Values</h5>
                        <p>{entry.values_a}</p>
                      </div>
                    )}
                    
                    {entry.change_a && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Changes</h5>
                        <p>{entry.change_a}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Path B */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">Path B</h4>
                    
                    {entry.tag_b && entry.tag_b.length > 0 && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Tags</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.tag_b.map((tag: string, i: number) => (
                            <span key={i} className="bg-[#FC68B3]/10 text-[#FC68B3] text-xs px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {entry.challenges_b && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Challenges</h5>
                        <p>{entry.challenges_b}</p>
                      </div>
                    )}
                    
                    {entry.feel_b && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Feelings</h5>
                        <p>{entry.feel_b}</p>
                      </div>
                    )}
                    
                    {entry.values_b && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Values</h5>
                        <p>{entry.values_b}</p>
                      </div>
                    )}
                    
                    {entry.change_b && (
                      <div>
                        <h5 className="font-medium text-[#FC68B3]">Changes</h5>
                        <p>{entry.change_b}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Final Selection */}
                {entry.selection && (
                  <div className="mt-6 pt-4 border-t">
                    <h5 className="font-medium text-[#FC68B3]">Final Selection</h5>
                    <p className="font-semibold">{entry.selection}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    );
  };
  
  const renderGroundingResponses = () => {
    if (groundingEntries.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No shared Grounding Technique responses found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {groundingEntries.map((entry) => (
          <Accordion type="single" collapsible key={entry.id}>
            <AccordionItem value={entry.id}>
              <AccordionTrigger className="bg-white/80 hover:bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#FC68B3]" />
                    <span>{formatDate(entry.created_at)}</span>
                    <span className="ml-2 text-[#FC68B3]">{entry.section_name}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white/90 p-4 rounded-lg">
                <div className="space-y-4">
                  {entry.response_text && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Response</h4>
                      <p>{entry.response_text}</p>
                    </div>
                  )}
                  
                  {entry.response_drawing_path && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Drawing</h4>
                      <MediaDisplay 
                        filePath={entry.response_drawing_path} 
                        type="drawing" 
                        userId={studentId}
                      />
                    </div>
                  )}
                  
                  {entry.response_audio_path && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Audio Response</h4>
                      <MediaDisplay 
                        filePath={entry.response_audio_path} 
                        type="audio" 
                        userId={studentId}
                      />
                    </div>
                  )}

                  {entry.response_selected_items && entry.response_selected_items.length > 0 && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Selected Items</h4>
                      <ul className="list-disc pl-5 mt-1">
                        {entry.response_selected_items.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    );
  };
  
  const renderHiChallenges = () => {
    if (hiChallengeEntries.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No shared Power of Hi challenges found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {hiChallengeEntries.map((entry) => (
          <Accordion type="single" collapsible key={entry.id}>
            <AccordionItem value={entry.id}>
              <AccordionTrigger className="bg-white/80 hover:bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#FC68B3]" />
                    <span>{formatDate(entry.created_at)}</span>
                    {entry.challenge_level && (
                      <span className="ml-2 text-[#FC68B3]">Level: {entry.challenge_level}</span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white/90 p-4 rounded-lg">
                <div className="space-y-4">
                  {entry.goal && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Goal</h4>
                      <p>{entry.goal}</p>
                    </div>
                  )}
                  
                  {entry.who && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Who</h4>
                      <p>{entry.who}</p>
                      {entry.who_difficulty && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-600">
                            Difficulty rating: {entry.who_difficulty}/5
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {entry.how_it_went && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">How It Went</h4>
                      <p>{entry.how_it_went}</p>
                      {entry.how_it_went_rating && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-600">
                            Rating: {entry.how_it_went_rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {entry.feeling && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Feelings</h4>
                      <p>{entry.feeling}</p>
                    </div>
                  )}
                  
                  {entry.what_felt_easy && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">What Felt Easy</h4>
                      <p>{entry.what_felt_easy}</p>
                      {entry.what_felt_easy_rating && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-600">
                            Rating: {entry.what_felt_easy_rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {entry.what_felt_hard && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">What Felt Hard</h4>
                      <p>{entry.what_felt_hard}</p>
                      {entry.what_felt_hard_rating && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-600">
                            Rating: {entry.what_felt_hard_rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {entry.other_people_responses && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Other People's Responses</h4>
                      <p>{entry.other_people_responses}</p>
                      {entry.other_people_rating && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-600">
                            Rating: {entry.other_people_rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {entry.try_next_time && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">To Try Next Time</h4>
                      <p>{entry.try_next_time}</p>
                      {entry.try_next_time_confidence && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-600">
                            Confidence: {entry.try_next_time_confidence}/5
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {entry.who_path && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Who - Drawing</h4>
                      <MediaDisplay 
                        filePath={entry.who_path} 
                        type="drawing" 
                        userId={studentId}
                      />
                    </div>
                  )}
                  
                  {entry.how_it_went_path && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">How It Went - Drawing</h4>
                      <MediaDisplay 
                        filePath={entry.how_it_went_path} 
                        type="drawing" 
                        userId={studentId}
                      />
                    </div>
                  )}
                  
                  {entry.feeling_path && (
                    <div>
                      <h4 className="font-medium text-[#FC68B3]">Feeling - Drawing</h4>
                      <MediaDisplay 
                        filePath={entry.feeling_path} 
                        type="drawing" 
                        userId={studentId}
                      />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    );
  };

  // Helper function to format dates consistently
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Rest of the component rendering
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="text-[#FC68B3] mr-4"
              onClick={() => navigate('/shared-responses')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-[#FC68B3] mr-2" />
                <h1 className="text-2xl md:text-3xl font-bold">{studentName}'s Shared Responses</h1>
              </div>
              <p className="text-gray-600 mt-1">
                View activity responses shared with you
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-primary">Loading responses...</p>
            </div>
          ) : (
            <Tabs defaultValue="emotional-airbnb" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="emotional-airbnb">
                  Emotional Airbnb ({emotionalAirbnbEntries.length})
                </TabsTrigger>
                <TabsTrigger value="fork-in-road">
                  Fork in the Road ({forkInRoadEntries.length})
                </TabsTrigger>
                <TabsTrigger value="grounding">
                  Grounding Technique ({groundingEntries.length})
                </TabsTrigger>
                <TabsTrigger value="power-of-hi">
                  Power of Hi ({hiChallengeEntries.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="emotional-airbnb" className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#FC68B3]" />
                  Emotional Airbnb Entries
                </h2>
                {renderEmotionalAirbnbEntries()}
              </TabsContent>
              
              <TabsContent value="fork-in-road" className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#FC68B3]" />
                  Fork in the Road Decisions
                </h2>
                {renderForkInRoadEntries()}
              </TabsContent>
              
              <TabsContent value="grounding" className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#FC68B3]" />
                  Grounding Technique Responses
                </h2>
                {renderGroundingResponses()}
              </TabsContent>
              
              <TabsContent value="power-of-hi" className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#FC68B3]" />
                  Power of Hi Challenges
                </h2>
                {renderHiChallenges()}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default StudentSharedResponses;
