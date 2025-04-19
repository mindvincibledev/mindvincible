
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface JournalProps {
  onComplete: () => void;
}

const Journal = ({ onComplete }: JournalProps) => {
  const { user } = useAuth();
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchChallenges();
    }
  }, [user]);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setChallenges(data || []);
      
      // Auto-select the most recent challenge
      if (data && data.length > 0) {
        setSelectedChallenge(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
      toast.error('Failed to load your challenges');
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedChallenge) {
      toast.error('Please select a challenge to journal about');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('simple_hi_interactions')
        .insert({
          user_id: user.id,
          challenge_id: selectedChallenge,
          how_it_went: reflection
        });
        
      if (error) throw error;
      
      toast.success('Journal entry saved!');
      setReflection('');
      
      // Call onComplete to show the feedback dialog
      onComplete();
      
    } catch (err) {
      console.error('Error saving journal:', err);
      toast.error('Failed to save your journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-lg shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] bg-clip-text text-transparent mb-6 text-center">
          Journal Your Hi Journey
        </h2>
        
        <div className="space-y-6">
          {challenges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't set any goals yet. Go to the Goals tab to set your first goal.</p>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="challenge" className="text-base mb-2 block">Challenge</Label>
                <select
                  id="challenge"
                  value={selectedChallenge || ''}
                  onChange={(e) => setSelectedChallenge(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DFDFF]"
                >
                  <option value="">Select a challenge...</option>
                  {challenges.map((challenge) => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.goal} ({challenge.challenge_level})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="reflection" className="text-base mb-2 block">How did it go?</Label>
                <Textarea
                  id="reflection"
                  placeholder="Write about your experience saying hi. How did it feel? What happened? What did you learn?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !reflection.trim() || !selectedChallenge}
                  className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
                >
                  {isSubmitting ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Save Journal Entry
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Journal;
