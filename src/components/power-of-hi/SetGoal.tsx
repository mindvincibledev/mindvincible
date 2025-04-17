
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SetGoalProps {
  onComplete: () => void;
}

const challengeLevels = [
  {
    level: 'easy',
    title: 'Easy',
    description: 'Smile & make eye contact with someone.',
    xp: 10,
  },
  {
    level: 'medium',
    title: 'Medium',
    description: 'Say hi to a classmate or colleague you don't usually talk to.',
    xp: 20,
  },
  {
    level: 'advanced',
    title: 'Advanced',
    description: 'Start a short convo or join a group.',
    xp: 30,
  },
];

const predefinedGoals = [
  'Say hi to 3 new people this week.',
  'Check in on someone today.',
  'Join 1 new conversation by Friday.',
];

const SetGoal: React.FC<SetGoalProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [customGoal, setCustomGoal] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveGoal = async () => {
    if (!selectedLevel) {
      toast.error('Please select a challenge level');
      return;
    }

    if (!selectedGoal && !customGoal) {
      toast.error('Please set a goal');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('simple_hi_challenges').insert({
        user_id: user?.id,
        challenge_level: selectedLevel,
        goal: customGoal || selectedGoal,
      });

      if (error) throw error;

      toast.success('Goal saved successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Choose Your Challenge Level</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {challengeLevels.map((challenge) => (
            <motion.div
              key={challenge.level}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className={`w-full h-auto p-4 flex flex-col items-center gap-2 border-2 ${
                  selectedLevel === challenge.level
                    ? 'border-[#2AC20E] bg-[#E5FFF2]'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedLevel(challenge.level)}
              >
                <span className="font-bold">{challenge.title}</span>
                <span className="text-sm text-gray-600 text-center">{challenge.description}</span>
                <span className="text-[#2AC20E] font-bold mt-2">+{challenge.xp} XP</span>
              </Button>
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Set Your Goal</h2>
        
        <div className="space-y-4 mb-6">
          {predefinedGoals.map((goal) => (
            <Button
              key={goal}
              variant="outline"
              className={`w-full justify-start ${
                selectedGoal === goal ? 'border-[#2AC20E] bg-[#E5FFF2]' : ''
              }`}
              onClick={() => {
                setSelectedGoal(goal);
                setCustomGoal('');
              }}
            >
              {goal}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Or write your own goal:</label>
          <Textarea
            value={customGoal}
            onChange={(e) => {
              setCustomGoal(e.target.value);
              setSelectedGoal('');
            }}
            placeholder="Type your goal here..."
            className="min-h-[100px]"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSaveGoal}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white px-8 py-6 text-lg rounded-full hover:opacity-90 transition-all duration-300"
          >
            {isSubmitting ? 'Saving...' : 'Save My Goal'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default SetGoal;
