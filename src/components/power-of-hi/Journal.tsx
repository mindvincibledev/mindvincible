
import React, { useState, useEffect } from 'react';
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
import { Star, Trophy, Target, ArrowRight } from 'lucide-react';

const MOODS = ["Happy", "Excited", "Proud", "Confident", "Nervous", "Awkward", "Uncomfortable", "Scared"];

const Journal = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [who, setWho] = useState('');
  const [howItWent, setHowItWent] = useState('');
  const [feeling, setFeeling] = useState('');

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user?.id) return;

    try {
      const { data: goalsData, error } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(goalsData || []);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load your goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !selectedGoal) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('simple_hi_interactions')
        .insert({
          user_id: user.id,
          challenge_id: selectedGoal,
          who,
          how_it_went: howItWent,
          feeling,
        });

      if (error) throw error;

      toast.success('Progress updated successfully!');
      setWho('');
      setHowItWent('');
      setFeeling('');
    } catch (error: any) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSubmitting(false);
    }
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
          
          {goals.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">You haven't set any goals yet.</p>
              <Button
                onClick={() => window.location.href = '/emotional-hacking/power-of-hi?tab=goal'}
                className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white"
              >
                Set Your First Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
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
                    {goals.map((goal) => (
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
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">How did it go?</label>
                    <Textarea
                      value={howItWent}
                      onChange={(e) => setHowItWent(e.target.value)}
                      placeholder="Share your experience..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">How did it make you feel?</label>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <MoodSelector
                        moods={MOODS}
                        selectedMood={feeling}
                        onSelect={setFeeling}
                      />
                    </div>
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
                          Update Progress
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Journal;
