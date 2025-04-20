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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const PowerOfHiActivity = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'welcome');
  const navigate = useNavigate();

  // Update activeTab when URL param changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleStartChallenge = () => {
    setActiveTab('goal');
    navigate('?tab=goal', { replace: true });
  };

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`?tab=${value}`, { replace: true });
  };
  
  const { user } = useAuth();
  
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
          activity_name: 'Power of a Simple Hi',
          activity_id: 'power-of-hi',
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
              <Journal />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Congratulations! 🎉</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold mb-2">
              You've completed the Power of Hi activity!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your journey of connection matters. Would you like to share your feedback?
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

export default PowerOfHiActivity;
