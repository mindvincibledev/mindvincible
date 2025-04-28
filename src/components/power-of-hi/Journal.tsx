import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Hand, MessageSquare, Award, ChevronLeft, ChevronRight, Save, Home } from 'lucide-react';
import CompletionAnimation from '@/components/grounding/CompletionAnimation';
import { ArrowLeft as ArrowLeftIcon, Clock, Play, RotateCcw, Moon, Sun, Smartphone, Coffee, Check, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMoodWheel } from '@/hooks/useMoodWheel';
import { v4 as uuidv4 } from 'uuid';
import ReflectionSection, { ReflectionData } from './ReflectionSection';
import EmojiSlider from '@/components/ui/EmojiSlider';
import { startOfWeek, endOfWeek } from 'date-fns';

import { GitFork, Edit, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadFile as uploadPowerOfHiFile } from '@/utils/powerOfHiFileUtils';


const MOODS = ["Happy", "Excited", "Proud", "Confident", "Nervous", "Awkward", "Uncomfortable", "Scared"];

// Define sticker options
const STICKERS = [
  { id: "sticker1", src: "/lovable-uploads/77db59f9-422e-4ac5-9fe1-7d5b4848772c.png", alt: "Sticker 1" },
  { id: "star", emoji: "⭐", alt: "Star" },
  { id: "heart", emoji: "❤️", alt: "Heart" },
  { id: "smile", emoji: "😊", alt: "Smile" },
  { id: "thumbsup", emoji: "👍", alt: "Thumbs Up" },
  { id: "fire", emoji: "🔥", alt: "Fire" },
  { id: "rocket", emoji: "🚀", alt: "Rocket" },
  { id: "clap", emoji: "👏", alt: "Clapping Hands" },
  { id: "party", emoji: "🎉", alt: "Party" }
];

const Journal = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [incompleteGoals, setIncompleteGoals] = useState<any[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredMoodIndex, setHoveredMoodIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  // Form states
  const [who, setWho] = useState('');
  const [howItWent, setHowItWent] = useState('');
  const [feeling, setFeeling] = useState('');
  const [whoDifficulty, setWhoDifficulty] = useState([5]);
  const [howItWentRating, setHowItWentRating] = useState([5]);
  
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
  
  // Sticker states
  const [isStickerDialogOpen, setIsStickerDialogOpen] = useState(false);
  const [selectedStickerType, setSelectedStickerType] = useState<'who' | 'howItWent' | 'feeling' | null>(null);
  const [whoStickers, setWhoStickers] = useState<string[]>([]);
  const [howItWentStickers, setHowItWentStickers] = useState<string[]>([]);
  const [feelingStickers, setFeelingStickers] = useState<string[]>([]);
  
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
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([]);
  const [weeklyCompletedGoals, setWeeklyCompletedGoals] = useState<any[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);

  // Update feeling when mood changes
  useEffect(() => {
    if (MOODS[selectedMoodIndex]) {
      setFeeling(MOODS[selectedMoodIndex]);
    }
  }, [selectedMoodIndex]);

  useEffect(() => {
    if (user) {
      fetchGoals();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Show sticker dialog
  const openStickerDialog = (type: 'who' | 'howItWent' | 'feeling') => {
    setSelectedStickerType(type);
    setIsStickerDialogOpen(true);
  };

  // Add sticker to the selected section
  const addSticker = (sticker: string) => {
    if (!selectedStickerType) return;
    
    if (selectedStickerType === 'who') {
      setWhoStickers(prev => [...prev, sticker]);
    } else if (selectedStickerType === 'howItWent') {
      setHowItWentStickers(prev => [...prev, sticker]);
    } else {
      setFeelingStickers(prev => [...prev, sticker]);
    }
    
    setIsStickerDialogOpen(false);
    toast.success("Sticker added!");
  };

  // Render stickers
  const renderStickers = (stickers: string[]) => {
    if (stickers.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {stickers.map((sticker, index) => (
          <div key={index} className="text-2xl">
            {sticker}
          </div>
        ))}
      </div>
    );
  };

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
      toast.error("Error loading goals: " + (error.message || "Could not load your goals"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (goals.length > 0) {
      const total = goals.length;
      const completed = goals.length - incompleteGoals.length;
      setTotalGoals(total);
      setCompletionPercentage((completed / total) * 100);
    }
  }, [goals, incompleteGoals]);

  const fetchGoals = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Get the start and end of the current week
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

      // Fetch all goals for the current week
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString())
        .order('created_at', { ascending: false });

      if (weeklyError) throw weeklyError;

      // Fetch incomplete goals for the current week
      const { data: incompleteData, error: incompleteError } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString())
        .is('how_it_went', null)
        .is('feeling', null)
        .order('created_at', { ascending: false });

      if (incompleteError) throw incompleteError;
      
      setWeeklyGoals(weeklyData || []);
      setIncompleteGoals(incompleteData || []);
      setGoals(weeklyData || []);
      
      // Calculate completed goals
      const completedGoals = (weeklyData || []).filter(
        goal => goal.how_it_went !== null && goal.feeling !== null
      );
      setWeeklyCompletedGoals(completedGoals);

    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load your goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weeklyGoals.length > 0) {
      const total = weeklyGoals.length;
      const completed = weeklyCompletedGoals.length;
      setTotalGoals(total);
      setCompletionPercentage((completed / total) * 100);
    }
  }, [weeklyGoals, weeklyCompletedGoals]);

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

  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const handleFeedback = async (feedback: string) => {
    if (!user?.id) {
      toast.error("You need to be logged in to complete this activity");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Record activity completion in the database
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_id: 'power-of-hi',
          activity_name: 'Power of Hi',
          feedback: feedback
        });
      
      if (error) {
        console.error("Error completing activity:", error);
        toast.error("Failed to record activity completion");
        return;
      }
      
      toast.success("Activity completed successfully!");
      setShowFeedback(false);
      
      // Navigate to resources hub after completion
      navigate('/resources');
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!user?.id || !selectedGoal) {
      toast.error("You need to be logged in and select a goal to proceed");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload files if they exist
      let whoPath = null;
      let howItWentPath = null;
      let feelingPath = null;
      let temp = null;

      
      
      if (whoFile) {
        if (whoFile.type.startsWith('image/')) {
          temp =  "drawing";
        }

        if (whoFile.type.startsWith('audio/')) {
          temp =  "audio";
        }
        const { path } = await uploadPowerOfHiFile(user.id, 'who', whoFile, temp);
        whoPath = path;
      }
      temp = null;
      if (howItWentFile) {
        if (howItWentFile.type.startsWith('image/')) {
          temp =  "drawing";
        }

        if (howItWentFile.type.startsWith('audio/')) {
          temp =  "audio";
        }
        const { path } = await uploadPowerOfHiFile(user.id, 'how_it_went', howItWentFile, temp);
        howItWentPath = path;
      }
      temp = null;
      if (feelingFile) {
        if (feelingFile.type.startsWith('image/')) {
          temp =  "drawing";
        }

        if (feelingFile.type.startsWith('audio/')) {
          temp =  "audio";
        }
        const { path } = await uploadPowerOfHiFile(user.id, 'feeling', feelingFile, temp);
        feelingPath = path;
      }
      
      // Convert string arrays to either string or null
      const whoStickersValue = whoStickers.length > 0 ? JSON.stringify(whoStickers) : null;
      const howItWentStickersValue = howItWentStickers.length > 0 ? JSON.stringify(howItWentStickers) : null;
      const feelingStickersValue = feelingStickers.length > 0 ? JSON.stringify(feelingStickers) : null;
      
      // Update the challenge record and mark it as complete
      const { error } = await supabase
        .from('simple_hi_challenges')
        .update({
          who,
          who_path: whoPath,
          who_difficulty: whoDifficulty[0],
          how_it_went: howItWent,
          how_it_went_path: howItWentPath,
          how_it_went_rating: howItWentRating[0],
          feeling,
          feeling_path: feelingPath,
          who_stickers: whoStickersValue,
          how_it_went_stickers: howItWentStickersValue,
          feeling_stickers: feelingStickersValue,
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
    if (!user?.id || !selectedGoal) {
      toast.error("You need to be logged in and select a goal to proceed");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('simple_hi_challenges')
        .update({
          what_felt_easy: reflectionData.whatFeltEasy,
          what_felt_hard: reflectionData.whatFeltHard,
          other_people_responses: reflectionData.otherPeopleResponses,
          try_next_time: reflectionData.tryNextTime,
          what_felt_easy_rating: reflectionData.whatFeltEasyRating,
          what_felt_hard_rating: reflectionData.whatFeltHardRating,
          other_people_rating: reflectionData.otherPeopleRating,
          try_next_time_confidence: reflectionData.tryNextTimeConfidence,
          visibility: reflectionData.visibility,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedGoal)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Goal completed successfully! This goal is now marked as complete and cannot be updated further.');
      
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
      toast.error('Failed to save reflection: ' + (error.message || "Unknown error"));
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

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto px-4 space-y-8"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to track your Power of Hi progress.</p>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white"
            >
              Sign In
            </Button>
          </div>
        </Card>
      </motion.div>
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
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>This Week's Goal Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-center text-sm text-gray-600">
              {weeklyCompletedGoals.length} goals completed, {incompleteGoals.length} remaining this week
            </p>
          </div>

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
                        <EmojiSlider
                          value={whoDifficulty}
                          onValueChange={setWhoDifficulty}
                          label="How difficult was the interaction? 🤔"
                          minEmoji="😓"
                          middleEmoji="🙂"
                          maxEmoji="🌟"
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
                          
                          <button 
                            onClick={() => openStickerDialog('who')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#3DFDFF] rounded-full text-sm hover:bg-[#3DFDFF]/80 transition-colors"
                          >
                            <Smile className="w-4 h-4" />
                            <span>Add Sticker</span>
                          </button>
                        </div>
                        
                        {renderFilePreview(whoPreview, 'who')}
                        {renderStickers(whoStickers)}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">How did it go?</label>
                        <Textarea
                          value={howItWent}
                          onChange={(e) => setHowItWent(e.target.value)}
                          placeholder="Share your experience..."
                          className="min-h-[120px]"
                        />
                        <EmojiSlider
                          value={howItWentRating}
                          onValueChange={setHowItWentRating}
                          label="How would you rate the experience? 😊"
                          minEmoji="😖"
                          middleEmoji="😐"
                          maxEmoji="😄"
                        />
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <label htmlFor="how
