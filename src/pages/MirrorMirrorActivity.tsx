import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Eye, RefreshCw, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import IntroSection from '@/components/mirror-mirror/IntroSection';
import BreathingSection from '@/components/mirror-mirror/BreathingSection';
import MirrorSection from '@/components/mirror-mirror/MirrorSection';
import ExitSection from '@/components/mirror-mirror/ExitSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MirrorMirrorActivity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<'intro' | 'breathing' | 'mirror' | 'exit'>('intro');
  const [completedPrompts, setCompletedPrompts] = useState<string[]>([]);

  const handleSectionComplete = (section: 'intro' | 'breathing' | 'mirror' | 'exit') => {
    switch (section) {
      case 'intro':
        setCurrentSection('breathing');
        break;
      case 'breathing':
        setCurrentSection('mirror');
        break;
      case 'mirror':
        // Record activity completion
        if (user) {
          recordActivityCompletion();
        }
        setCurrentSection('exit');
        break;
      case 'exit':
        // Navigate back to resources hub instead
        navigate('/resources');
        break;
    }
  };

  const handleAnotherPrompt = () => {
    setCurrentSection('mirror');
  };

  const recordActivityCompletion = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_name: 'Mirror Mirror On the Wall',
          activity_id: 'mirror-mirror',
        });
      
      if (error) {
        console.error('Error recording activity completion:', error);
        toast.error('Failed to record your activity completion');
        return;
      }
      
      toast.success('Activity completion recorded!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handlePromptCompleted = (prompt: string) => {
    setCompletedPrompts([...completedPrompts, prompt]);
  };
  
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleActivityComplete = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_name: 'Mirror Mirror On the Wall',
          activity_id: 'mirror-mirror',
          feedback: feedback
        });

      if (error) {
        console.error('Error recording completion:', error);
        toast.error('Failed to record completion');
        return;
      }

      toast.success('Activity completed successfully!');
      navigate('/resources');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong');
    }
  };

  const handleFeedbackSubmit = () => {
    setShowFeedbackDialog(false);
    handleActivityComplete();
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <Link to="/resources" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources Hub
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {currentSection === 'intro' && (
              <IntroSection onComplete={() => handleSectionComplete('intro')} />
            )}
            
            {currentSection === 'breathing' && (
              <BreathingSection onComplete={() => handleSectionComplete('breathing')} />
            )}
            
            {currentSection === 'mirror' && (
              <MirrorSection 
                onComplete={() => {
                  if (user) {
                    setShowCompletionDialog(true);
                  } else {
                    handleSectionComplete('mirror');
                  }
                }}
                completedPrompts={completedPrompts}
                onPromptCompleted={handlePromptCompleted}
              />
            )}
            
            {currentSection === 'exit' && (
              <ExitSection 
                onAnotherPrompt={handleAnotherPrompt}
                onComplete={() => handleSectionComplete('exit')}
                promptsCompleted={completedPrompts.length}
              />
            )}
          </motion.div>
        </div>
      </div>
      
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Congratulations! 🎉</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold mb-2">
              You've completed the Mirror Mirror activity!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your self-reflection journey matters. Would you like to share your feedback?
            </p>
            <Button 
              onClick={() => {
                setShowCompletionDialog(false);
                setShowFeedbackDialog(true);
              }}
              className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white"
            >
              Share Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Feedback</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How was your experience with this activity?"
              className="w-full h-32 p-3 border rounded-md"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => handleFeedbackSubmit()}
              >
                Skip
              </Button>
              <Button
                onClick={() => handleFeedbackSubmit()}
                className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </BackgroundWithEmojis>
  );
};

export default MirrorMirrorActivity;
