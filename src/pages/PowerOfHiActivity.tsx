
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Hand, MessageSquare, Award } from 'lucide-react';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SetGoal from '@/components/power-of-hi/SetGoal';
import Journal from '@/components/power-of-hi/Journal';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';

const PowerOfHiActivity = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'welcome');
  const navigate = useNavigate();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleStartChallenge = () => {
    setActiveTab('goal');
    navigate('?tab=goal', { replace: true });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`?tab=${value}`, { replace: true });
  };

  const handleJournalComplete = () => {
    setShowCompletionDialog(true);
  };

  const handleCompletionSubmit = async () => {
    if (!selectedEmoji) {
      toast.error("Please select how you're feeling");
      return;
    }

    try {
      setIsSubmitting(true);

      if (user) {
        const { error } = await supabase.from('activity_completions').insert({
          user_id: user.id,
          activity_name: 'Power of Hi',
          activity_id: 'power-of-hi',
          feedback: selectedEmoji
        });

        if (error) throw error;
      }

      toast.success("Activity completed successfully!");
      setShowCompletionDialog(false);
      navigate('/resources');
    } catch (error) {
      console.error('Error saving completion:', error);
      toast.error("Failed to save completion");
    } finally {
      setIsSubmitting(false);
    }
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

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="welcome">Welcome</TabsTrigger>
              <TabsTrigger value="goal">Goals</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
            </TabsList>

            <TabsContent value="welcome">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
              >
                <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl">
                  <div className="text-center space-y-6">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [-5, 5, -5, 0] 
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror"
                      }}
                      className="w-24 h-24 mx-auto bg-[#E5FFF2] rounded-full flex items-center justify-center"
                    >
                      <Hand className="h-12 w-12 text-[#2AC20E]" />
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] bg-clip-text text-transparent">
                      Power of a Simple Hi
                    </h1>
                    
                    <p className="text-xl text-gray-700">
                      Want to boost your confidence and make real-world connections? Start with something simple: a 'Hi.' You never know where it'll lead.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center items-center">
                      <div className="flex items-center gap-2 text-[#2AC20E]">
                        <Star className="h-5 w-5" />
                        <span>Earn confidence stars</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#3DFDFF]">
                        <MessageSquare className="h-5 w-5" />
                        <span>Track your progress</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#FF8A48]">
                        <Award className="h-5 w-5" />
                        <span>Unlock achievements</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleStartChallenge}
                      className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white px-8 py-6 text-lg rounded-full hover:opacity-90 transition-all duration-300"
                    >
                      Pick My Challenge
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="goal">
              <SetGoal onComplete={() => handleTabChange('journal')} />
            </TabsContent>

            <TabsContent value="journal">
              <Journal onComplete={handleJournalComplete} />
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">
                Congratulations! 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                You've completed the Power of Hi activity! How are you feeling?
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 py-4">
              <Button
                variant="outline"
                className={`p-6 ${selectedEmoji === '😊' ? 'border-[#2AC20E] border-2' : ''}`}
                onClick={() => setSelectedEmoji('😊')}
              >
                <span className="text-4xl">😊</span>
              </Button>
              <Button
                variant="outline"
                className={`p-6 ${selectedEmoji === '😐' ? 'border-[#2AC20E] border-2' : ''}`}
                onClick={() => setSelectedEmoji('😐')}
              >
                <span className="text-4xl">😐</span>
              </Button>
              <Button
                variant="outline"
                className={`p-6 ${selectedEmoji === '😔' ? 'border-[#2AC20E] border-2' : ''}`}
                onClick={() => setSelectedEmoji('😔')}
              >
                <span className="text-4xl">😔</span>
              </Button>
            </div>
            <Button
              onClick={handleCompletionSubmit}
              disabled={!selectedEmoji || isSubmitting}
              className="w-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white"
            >
              {isSubmitting ? 'Saving...' : 'Complete Activity'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </BackgroundWithEmojis>
  );
};

export default PowerOfHiActivity;
