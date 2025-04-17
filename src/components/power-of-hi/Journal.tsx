import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import MoodSelector from '@/components/mood/MoodSelector';
import { Star, Trophy, Target, ArrowRight, Mic, MicOff, Upload, Image, Camera, Smile, X } from 'lucide-react';
import { useMoodWheel } from '@/hooks/useMoodWheel';
import { v4 as uuidv4 } from 'uuid';
import ReflectionSection, { ReflectionData } from './ReflectionSection';

const MOODS = ["Happy", "Excited", "Proud", "Confident", "Nervous", "Awkward", "Uncomfortable", "Scared"];

const Journal = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [incompleteGoals, setIncompleteGoals] = useState<any[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredMoodIndex, setHoveredMoodIndex] = useState<number | null>(null);

  // Form states
  const [who, setWho] = useState('');
  const [howItWent, setHowItWent] = useState('');
  const [feeling, setFeeling] = useState('');
  
  // Upload states
  const [whoFile, setWhoFile] = useState<File | null>(null);
  const [howItWentFile, setHowItWentFile] = useState<File | null>(null);
  const [feelingFile, setFeelingFile] = useState<File | null>(null);
  const [whoPreview, setWhoPreview] = useState<string | null>(null);
  const [howItWentPreview, setHowItWentPreview] = useState<string | null>(null);
  const [feelingPreview, setFeelingPreview] = useState<string | null>(null);
  const [isRecordingWho, setIsRecordingWho] = useState(false);
  const [isRecordingHowItWent, setIsRecordingHowItWent] = useState(false);
  const [isRecordingFeeling, setIsRecordingFeeling] = useState(false);
  
  const whoAudioRef = useRef<MediaRecorder | null>(null);
  const howItWentAudioRef = useRef<MediaRecorder | null>(null);
  const feelingAudioRef = useRef<MediaRecorder | null>(null);
  const whoChunksRef = useRef<Blob[]>([]);
  const howItWentChunksRef = useRef<Blob[]>([]);
  const feelingChunksRef = useRef<Blob[]>([]);
  
  // Setup for MoodSelector
  const wheelRef = useRef<HTMLDivElement>(null);
  const {
    selectedMoodIndex,
    setSelectedMoodIndex,
    changeMood,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useMoodWheel({ 
    moodsCount: MOODS.length, 
    initialMoodIndex: 0, 
    wheelRef 
  });

  // Update feeling when mood changes
  useEffect(() => {
    if (MOODS[selectedMoodIndex]) {
      setFeeling(MOODS[selectedMoodIndex]);
    }
  }, [selectedMoodIndex]);

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchJournalEntries = async () => {
    if (!user?.id) {
      console.error('Cannot fetch entries: No user logged in');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching journal entries for user ID:', user.id);
      
      // Only fetch incomplete goals
      const { data, error } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .is('how_it_went', null)  // Only fetch incomplete goals
        .is('feeling', null)      // Ensure goal is truly incomplete
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setGoals(data || []);
      setIncompleteGoals(data || []);
      console.log('Fetched incomplete goals:', data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching journal entries:', error);
      toast({
        variant: "destructive",
        title: "Error loading goals",
        description: error.message || "Could not load your goals",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!user?.id) return;

    try {
      const { data: goalsData, error } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .is('how_it_went', null)  // Only fetch incomplete goals
        .is('feeling', null)      // Ensure goal is truly incomplete
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setIncompleteGoals(goalsData || []);
      setGoals(goalsData || []);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load your goals');
    } finally {
      setLoading(false);
    }
  };

  // File Upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'who' | 'howItWent' | 'feeling') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type and size
      if (!file.type.startsWith('image/') && !file.type.startsWith('audio/')) {
        toast.error('Please upload an image or audio file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      
      // Set file and preview
      if (type === 'who') {
        setWhoFile(file);
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => setWhoPreview(e.target?.result as string);
          reader.readAsDataURL(file);
        } else {
          setWhoPreview('audio');
        }
      } else if (type === 'howItWent') {
        setHowItWentFile(file);
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => setHowItWentPreview(e.target?.result as string);
          reader.readAsDataURL(file);
        } else {
          setHowItWentPreview('audio');
        }
      } else {
        setFeelingFile(file);
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => setFeelingPreview(e.target?.result as string);
          reader.readAsDataURL(file);
        } else {
          setFeelingPreview('audio');
        }
      }
    }
  };

  const clearFile = (type: 'who' | 'howItWent' | 'feeling') => {
    if (type === 'who') {
      setWhoFile(null);
      setWhoPreview(null);
    } else if (type === 'howItWent') {
      setHowItWentFile(null);
      setHowItWentPreview(null);
    } else {
      setFeelingFile(null);
      setFeelingPreview(null);
    }
  };

  // Audio recording handlers
  const startRecording = async (type: 'who' | 'howItWent' | 'feeling') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      if (type === 'who') {
        whoChunksRef.current = [];
        whoAudioRef.current = mediaRecorder;
        setIsRecordingWho(true);
        
        mediaRecorder.ondataavailable = (e) => {
          whoChunksRef.current.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(whoChunksRef.current, { type: 'audio/webm' });
          const file = new File([audioBlob], `who-audio-${Date.now()}.webm`, { type: 'audio/webm' });
          setWhoFile(file);
          setWhoPreview('audio');
          setIsRecordingWho(false);
          
          // Stop tracks
          stream.getTracks().forEach(track => track.stop());
        };
      } else if (type === 'howItWent') {
        howItWentChunksRef.current = [];
        howItWentAudioRef.current = mediaRecorder;
        setIsRecordingHowItWent(true);
        
        mediaRecorder.ondataavailable = (e) => {
          howItWentChunksRef.current.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(howItWentChunksRef.current, { type: 'audio/webm' });
          const file = new File([audioBlob], `how-it-went-audio-${Date.now()}.webm`, { type: 'audio/webm' });
          setHowItWentFile(file);
          setHowItWentPreview('audio');
          setIsRecordingHowItWent(false);
          
          // Stop tracks
          stream.getTracks().forEach(track => track.stop());
        };
      } else {
        feelingChunksRef.current = [];
        feelingAudioRef.current = mediaRecorder;
        setIsRecordingFeeling(true);
        
        mediaRecorder.ondataavailable = (e) => {
          feelingChunksRef.current.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(feelingChunksRef.current, { type: 'audio/webm' });
          const file = new File([audioBlob], `feeling-audio-${Date.now()}.webm`, { type: 'audio/webm' });
          setFeelingFile(file);
          setFeelingPreview('audio');
          setIsRecordingFeeling(false);
          
          // Stop tracks
          stream.getTracks().forEach(track => track.stop());
        };
      }
      
      mediaRecorder.start();
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = (type: 'who' | 'howItWent' | 'feeling') => {
    if (type === 'who' && whoAudioRef.current) {
      whoAudioRef.current.stop();
    } else if (type === 'howItWent' && howItWentAudioRef.current) {
      howItWentAudioRef.current.stop();
    } else if (type === 'feeling' && feelingAudioRef.current) {
      feelingAudioRef.current.stop();
    }
    toast.success('Recording stopped');
  };

  // File upload handler with specific bucket selection
  const uploadFile = async (file: File, type: 'who' | 'howItWent' | 'feeling') => {
    if (!file || !user?.id) return null;
    
    const bucketName = 'simple_hi_images';
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}-${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      });
      
    if (error) {
      console.error(`Error uploading ${type} file:`, error);
      toast.error(`Failed to upload ${type} file`);
      return null;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user?.id || !selectedGoal) return;

    setIsSubmitting(true);
    try {
      // Upload files if they exist
      let whoPath = null;
      let howItWentPath = null;
      let feelingPath = null;
      
      if (whoFile) {
        whoPath = await uploadFile(whoFile, 'who');
      }
      
      if (howItWentFile) {
        howItWentPath = await uploadFile(howItWentFile, 'howItWent');
      }
      
      if (feelingFile) {
        feelingPath = await uploadFile(feelingFile, 'feeling');
      }
      
      // Update the challenge record and mark it as complete
      const { error } = await supabase
        .from('simple_hi_challenges')
        .update({
          who,
          who_path: whoPath,
          how_it_went: howItWent,
          how_it_went_path: howItWentPath,
          feeling,
          feeling_path: feelingPath,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedGoal)
        .eq('user_id', user.id);

      if (error) throw error;

      // Show success message
      toast.success('Progress saved! Time for some quick reflection.');
      
      // Move to reflection section
      setActiveSection('reflection');
    } catch (error: any) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReflectionSubmit = async (reflectionData: ReflectionData) => {
    if (!user?.id || !selectedGoal) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('simple_hi_challenges')
        .update({
          what_felt_easy: reflectionData.whatFeltEasy,
          what_felt_hard: reflectionData.whatFeltHard,
          other_people_responses: reflectionData.otherPeopleResponses,
          try_next_time: reflectionData.tryNextTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedGoal)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Goal completed successfully!', {
        description: 'This goal is now marked as complete and cannot be updated further.'
      });
      
      // Refresh goals to remove the completed one
      fetchJournalEntries();
      
      // Reset form and go back to initial section
      setWho('');
      setHowItWent('');
      setFeeling('');
      setWhoFile(null);
      setHowItWentFile(null);
      setWhoPreview(null);
      setHowItWentPreview(null);
      setFeelingPreview(null);
      setSelectedGoal('');
      setActiveSection('initial');
    } catch (error: any) {
      console.error('Error saving reflection:', error);
      toast.error('Failed to save reflection');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add state for managing sections
  const [activeSection, setActiveSection] = React.useState<'initial' | 'reflection'>('initial');

  // Custom handler for selecting a mood directly with the simplified interface
  const handleMoodSelect = (mood: string) => {
    const moodIndex = MOODS.findIndex(m => m === mood);
    if (moodIndex >= 0) {
      setSelectedMoodIndex(moodIndex);
    }
    setFeeling(mood);
  };

  // Render file preview
  const renderFilePreview = (preview: string | null, type: 'who' | 'howItWent' | 'feeling') => {
    if (!preview) return null;
    
    return (
      <div className="mt-2 relative">
        {preview === 'audio' ? (
          <div className="p-3 bg-[#F5DF4D]/20 rounded-lg flex items-center">
            <div className="w-10 h-10 bg-[#F5DF4D] rounded-full flex items-center justify-center mr-3">
              <Mic className="w-5 h-5 text-black" />
            </div>
            <span className="text-sm">Audio recording ready for upload</span>
          </div>
        ) : (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
          </div>
        )}
        <button 
          onClick={() => clearFile(type)} 
          className="absolute top-2 right-2 bg-black/60 p-1 rounded-full hover:bg-black/80 transition-colors"
          aria-label="Remove file"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-gray-600">Loading your goals...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 space-y-8"
    >
      <Card className="p-8 bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6">Track Your Progress</h2>
          
          {incompleteGoals.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">You've completed all your goals!</p>
              <Button
                onClick={() => window.location.href = '/emotional-hacking/power-of-hi?tab=goal'}
                className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white"
              >
                Set Your First Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeSection === 'initial' ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Select Goal to Update</label>
                    <Select
                      value={selectedGoal}
                      onValueChange={setSelectedGoal}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a goal..." />
                      </SelectTrigger>
                      <SelectContent>
                        {incompleteGoals.map((goal) => (
                          <SelectItem
                            key={goal.id}
                            value={goal.id}
                            className={`${
                              goal.challenge_level === 'easy'
                                ? 'text-[#2AC20E]'
                                : goal.challenge_level === 'medium'
                                ? 'text-[#F5DF4D]'
                                : 'text-[#FC68B3]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              <span>{goal.goal}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedGoal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Who did you interact with?</label>
                        <Textarea
                          value={who}
                          onChange={(e) => setWho(e.target.value)}
                          placeholder="Describe the person or situation..."
                          className="min-h-[80px]"
                        />
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <label htmlFor="who-file" className="cursor-pointer">
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#D5D5F1] rounded-full text-sm hover:bg-[#D5D5F1]/80 transition-colors">
                              <Image className="w-4 h-4" />
                              <span>Add Photo</span>
                            </div>
                            <input
                              id="who-file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'who')}
                              className="hidden"
                            />
                          </label>
                          
                          {isRecordingWho ? (
                            <button 
                              onClick={() => stopRecording('who')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
                            >
                              <MicOff className="w-4 h-4" />
                              <span>Stop</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => startRecording('who')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#FF8A48] rounded-full text-sm hover:bg-[#FF8A48]/80 transition-colors"
                            >
                              <Mic className="w-4 h-4" />
                              <span>Record Audio</span>
                            </button>
                          )}
                        </div>
                        
                        {renderFilePreview(whoPreview, 'who')}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">How did it go?</label>
                        <Textarea
                          value={howItWent}
                          onChange={(e) => setHowItWent(e.target.value)}
                          placeholder="Share your experience..."
                          className="min-h-[120px]"
                        />
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <label htmlFor="howItWent-file" className="cursor-pointer">
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#D5D5F1] rounded-full text-sm hover:bg-[#D5D5F1]/80 transition-colors">
                              <Image className="w-4 h-4" />
                              <span>Add Photo</span>
                            </div>
                            <input
                              id="howItWent-file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'howItWent')}
                              className="hidden"
                            />
                          </label>
                          
                          {isRecordingHowItWent ? (
                            <button 
                              onClick={() => stopRecording('howItWent')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
                            >
                              <MicOff className="w-4 h-4" />
                              <span>Stop</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => startRecording('howItWent')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#FF8A48] rounded-full text-sm hover:bg-[#FF8A48]/80 transition-colors"
                            >
                              <Mic className="w-4 h-4" />
                              <span>Record Audio</span>
                            </button>
                          )}
                        </div>
                        
                        {renderFilePreview(howItWentPreview, 'howItWent')}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">How did it make you feel?</label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <MoodSelector
                            moods={MOODS}
                            selectedMoodIndex={selectedMoodIndex}
                            onMoodSelect={setSelectedMoodIndex}
                            onChangeMood={changeMood}
                            wheelRef={wheelRef}
                            handleTouchStart={handleTouchStart}
                            handleTouchMove={handleTouchMove}
                            handleTouchEnd={handleTouchEnd}
                            onMoodHover={setHoveredMoodIndex}
                            onSelect={handleMoodSelect}
                            selectedMood={feeling}
                          />
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <label htmlFor="feeling-file" className="cursor-pointer">
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#D5D5F1] rounded-full text-sm hover:bg-[#D5D5F1]/80 transition-colors">
                              <Image className="w-4 h-4" />
                              <span>Add Image</span>
                            </div>
                            <input
                              id="feeling-file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'feeling')}
                              className="hidden"
                            />
                          </label>
                          
                          {isRecordingFeeling ? (
                            <button 
                              onClick={() => stopRecording('feeling')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
                            >
                              <MicOff className="w-4 h-4" />
                              <span>Stop</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => startRecording('feeling')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#FF8A48] rounded-full text-sm hover:bg-[#FF8A48]/80 transition-colors"
                            >
                              <Mic className="w-4 h-4" />
                              <span>Record Audio</span>
                            </button>
                          )}
                          
                          <button 
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#3DFDFF] rounded-full text-sm hover:bg-[#3DFDFF]/80 transition-colors"
                          >
                            <Smile className="w-4 h-4" />
                            <span>Add Sticker</span>
                          </button>
                        </div>
                        
                        {renderFilePreview(feelingPreview, 'feeling')}
                      </div>

                      <motion.div
                        className="flex justify-center mt-8"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !who || !howItWent || !feeling}
                          className="w-full md:w-auto px-8 py-6 text-lg font-semibold rounded-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            'Saving...'
                          ) : (
                            <>
                              Complete Goal
                              <ArrowRight className="h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </>
              ) : (
                <ReflectionSection 
                  onSubmit={handleReflectionSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Journal;
