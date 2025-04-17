import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { SimpleHiChallenge } from '@/types/simple-hi';
import { Slider } from "@/components/ui/slider";
import ReflectionSection, { ReflectionData } from './ReflectionSection';

interface JournalProps {
  onComplete: () => void;
}

const Journal = () => {
  const [selectedGoal, setSelectedGoal] = useState<SimpleHiChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchGoal();
  }, [user, navigate]);

  const fetchGoal = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      setSelectedGoal(data || null);
    } catch (error: any) {
      console.error("Error fetching goal:", error);
      toast.error("Could not load your goal: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    toast.success("Challenge completed! 🎉");
  };

  const handleReflectionSubmit = async (data: ReflectionData) => {
    if (!user?.id || !selectedGoal?.id) {
      toast.error("Could not save reflection: Missing user or goal information");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('simple_hi_challenges')
        .update({
          what_felt_easy: data.whatFeltEasy,
          what_felt_easy_rating: data.whatFeltEasyRating,
          what_felt_hard: data.whatFeltHard,
          what_felt_hard_rating: data.whatFeltHardRating,
          other_people_responses: data.otherPeopleResponses,
          other_people_rating: data.otherPeopleRating,
          try_next_time: data.tryNextTime,
          try_next_time_confidence: data.tryNextTimeConfidence
        })
        .eq('id', selectedGoal.id);

      if (error) throw error;

      toast.success('Reflection saved successfully!');
      handleComplete();
    } catch (error: any) {
      console.error('Error saving reflection:', error);
      toast.error("Could not save reflection: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-12 px-4 relative z-10"
    >
      <h1 className="text-3xl font-bold text-center mb-8">Your Challenge Journal</h1>

      {isLoading ? (
        <div className="text-center">Loading your challenge...</div>
      ) : selectedGoal ? (
        <Tabs defaultValue="goal" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="goal">Goal</TabsTrigger>
            <TabsTrigger value="reflection">Reflection</TabsTrigger>
          </TabsList>

          <TabsContent value="goal">
            <Card className="bg-white/90 backdrop-blur-lg shadow-md">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">Your Goal:</h2>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                  >
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </motion.div>
                </div>
                <p className="text-gray-700">{selectedGoal.goal}</p>

                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Created on {new Date(selectedGoal.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflection">
            <ReflectionSection onSubmit={handleReflectionSubmit} isSubmitting={isSubmitting} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center">
          <p>No goal set yet. Please set a goal to start your challenge.</p>
          <Button onClick={() => navigate('/emotional-hacking/power-of-hi')} className="mt-4">
            Set a Goal <ArrowRight className="ml-2" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Journal;
