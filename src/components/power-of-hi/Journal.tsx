
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import MoodSelector from '@/components/mood/MoodSelector';
import { Star, Trophy, Target } from 'lucide-react';

const Journal = () => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Form states
  const [who, setWho] = useState('');
  const [howItWent, setHowItWent] = useState('');
  const [feeling, setFeeling] = useState('');
  const [whatFeltEasy, setWhatFeltEasy] = useState('');
  const [whatFeltHard, setWhatFeltHard] = useState('');
  const [otherResponses, setOtherResponses] = useState('');
  const [nextTime, setNextTime] = useState('');

  useEffect(() => {
    fetchChallengeAndInteractions();
  }, [user]);

  const fetchChallengeAndInteractions = async () => {
    if (!user?.id) return;

    try {
      // Fetch the most recent challenge
      const { data: challengeData, error: challengeError } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (challengeError) throw challengeError;
      setChallenge(challengeData);

      // Fetch interactions for this challenge
      if (challengeData) {
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('simple_hi_interactions')
          .select('*')
          .eq('challenge_id', challengeData.id)
          .order('completed_at', { ascending: false });

        if (interactionsError) throw interactionsError;
        setInteractions(interactionsData || []);

        // Calculate progress
        const targetCount = challengeData.goal.includes('3') ? 3 : 1;
        const progress = Math.min((interactionsData?.length || 0) / targetCount * 100, 100);
        setProgress(progress);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load your challenge data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !challenge) return;

    setIsSubmitting(true);
    try {
      // Save interaction
      const { error: interactionError } = await supabase
        .from('simple_hi_interactions')
        .insert({
          user_id: user.id,
          challenge_id: challenge.id,
          who,
          how_it_went: howItWent,
          feeling,
        });

      if (interactionError) throw interactionError;

      // Update challenge with reflection answers
      const { error: updateError } = await supabase
        .from('simple_hi_challenges')
        .update({
          what_felt_easy: whatFeltEasy,
          what_felt_hard: whatFeltHard,
          other_people_responses: otherResponses,
          try_next_time: nextTime,
        })
        .eq('id', challenge.id);

      if (updateError) throw updateError;

      toast.success('Journal entry saved successfully!');
      fetchChallengeAndInteractions(); // Refresh data
      
      // Reset form
      setWho('');
      setHowItWent('');
      setFeeling('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!challenge) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-700 mb-4">No active challenge found.</p>
        <Button
          onClick={() => window.location.href = '/emotional-hacking/power-of-hi'}
          className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white"
        >
          Start a Challenge
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">Your Progress</h2>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm mt-2">
            <span>{interactions.length} interactions logged</span>
            <span>{progress}% Complete</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Who did you talk to?</h3>
            <Textarea
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder="Describe the person or situation..."
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">How did it go?</h3>
            <Textarea
              value={howItWent}
              onChange={(e) => setHowItWent(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">How did it make you feel?</h3>
            <MoodSelector
              onSelect={(mood) => setFeeling(mood)}
              selectedMood={feeling}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Reflection</h3>
            <div className="space-y-4">
              <Textarea
                value={whatFeltEasy}
                onChange={(e) => setWhatFeltEasy(e.target.value)}
                placeholder="What felt easy?"
                className="mb-2"
              />
              <Textarea
                value={whatFeltHard}
                onChange={(e) => setWhatFeltHard(e.target.value)}
                placeholder="What felt hard?"
                className="mb-2"
              />
              <Textarea
                value={otherResponses}
                onChange={(e) => setOtherResponses(e.target.value)}
                placeholder="What surprised you about other people's responses?"
                className="mb-2"
              />
              <Textarea
                value={nextTime}
                onChange={(e) => setNextTime(e.target.value)}
                placeholder="What will you try next time?"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white px-8 py-6 text-lg rounded-full hover:opacity-90 transition-all duration-300"
            >
              {isSubmitting ? 'Saving...' : 'Save Journal Entry'}
            </Button>
          </div>
        </div>
      </Card>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-lg backdrop-blur-sm"
        >
          <Trophy className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Challenge Complete! 🎉</h3>
          <p className="text-gray-700">
            Congratulations! You've completed your social challenge and earned the "Hi Hero 🦸" badge!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Journal;
