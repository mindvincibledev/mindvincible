
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
    description: "Smile & make eye contact with someone.",
    xp: 10,
    style: {
      selected: "bg-[#E5FFF2] border-[#2AC20E]",
      hover: "hover:bg-[#E5FFF2]/50",
      xp: "text-[#2AC20E]"
    }
  },
  {
    level: 'medium',
    title: 'Medium',
    description: "Say hi to a classmate or colleague you don't usually talk to.",
    xp: 20,
    style: {
      selected: "bg-[#F5DF4D] border-[#F5DF4D]",
      hover: "hover:bg-[#F5DF4D]/50",
      xp: "text-[#B5A327]"
    }
  },
  {
    level: 'advanced',
    title: 'Advanced',
    description: "Start a short convo or join a group.",
    xp: 30,
    style: {
      selected: "bg-[#FFE6EE] border-[#FC68B3]",
      hover: "hover:bg-[#FFE6EE]/50",
      xp: "text-[#FC68B3]"
    }
  },
];

const predefinedGoals = [
  'Say hi to 3 new people this week.',
  'Check in on someone today.',
  'Join 1 new conversation by Friday.',
];

const SetGoal: React.FC<SetGoalProps> = ({ onComplete }) => {
  const { user, loading } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [customGoal, setCustomGoal] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveGoal = async () => {
    if (!user) {
      toast.error('You must be logged in to set a goal');
      return;
    }

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
        user_id: user.id,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-gray-600">Loading account info...</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-red-500 font-semibold">Please log in to set and save a goal.</p>
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
        <h2 className="text-3xl font-bold text-center mb-10">Choose Your Challenge Level</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {challengeLevels.map((challenge) => (
            <motion.div
              key={challenge.level}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="button"
                onClick={() => setSelectedLevel(challenge.level)}
                className={`w-full h-full min-h-[200px] p-6 rounded-xl border-2 transition-all duration-300
                  ${selectedLevel === challenge.level 
                    ? `${challenge.style.selected} shadow-lg` 
                    : 'border-gray-100 bg-white ' + challenge.style.hover}
                `}
              >
                <div className="flex flex-col items-center justify-between h-full">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">{challenge.title}</h3>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>
                  <div className={`${challenge.style.xp} font-bold text-lg mt-4`}>
                    +{challenge.xp} XP
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center mb-8">Set Your Goal</h2>
        
        <div className="space-y-4 mb-8">
          {predefinedGoals.map((goal) => (
            <button
              key={goal}
              onClick={() => {
                setSelectedGoal(goal);
                setCustomGoal('');
              }}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300
                ${selectedGoal === goal 
                  ? 'border-[#2AC20E] bg-[#E5FFF2] shadow-md' 
                  : 'border-gray-100 hover:border-[#2AC20E]/30 hover:bg-[#E5FFF2]/30'}
              `}
            >
              {goal}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium mb-2">Or write your own goal:</label>
          <Textarea
            value={customGoal}
            onChange={(e) => {
              setCustomGoal(e.target.value);
              setSelectedGoal('');
            }}
            placeholder="Type your goal here..."
            className="min-h-[120px] p-4 rounded-lg border-2 border-gray-100 focus:border-[#2AC20E] focus:ring-[#2AC20E]"
          />
        </div>

        <motion.div 
          className="mt-10 flex justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleSaveGoal}
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-6 text-lg font-semibold rounded-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save My Goal'}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default SetGoal;
