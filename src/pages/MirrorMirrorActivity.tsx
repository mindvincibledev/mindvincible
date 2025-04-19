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
        navigate('/resources-hub');
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

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <Link to="/resources-hub" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
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
                onComplete={() => handleSectionComplete('mirror')} 
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
    </BackgroundWithEmojis>
  );
};

export default MirrorMirrorActivity;
