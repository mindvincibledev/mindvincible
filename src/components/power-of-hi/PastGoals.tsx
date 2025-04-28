
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Mic, Image, Smile, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';

type CompletedGoal = {
  id: string;
  goal: string;
  who: string;
  how_it_went: string;
  feeling: string;
  who_path: string | null;
  how_it_went_path: string | null;
  feeling_path: string | null;
  who_stickers: string | null;
  how_it_went_stickers: string | null;
  feeling_stickers: string | null;
  created_at: string;
  challenge_level: string;
  who_difficulty: number;
  how_it_went_rating: number;
};

const PastGoals = () => {
  const { user } = useAuth();
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<CompletedGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCompletedGoals();
  }, [user]);

  const fetchCompletedGoals = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .not('how_it_went', 'is', null)
        .not('feeling', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompletedGoals(data || []);
    } catch (error: any) {
      toast.error("Failed to load completed goals");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('simple_hi_challenges')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setCompletedGoals(prev => prev.filter(goal => goal.id !== id));
      setIsDialogOpen(false);
      toast.success('Goal deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete goal');
      console.error('Error:', error);
    }
  };

  const renderFileIndicator = (path: string | null, type: string) => {
    if (!path) return null;

    const isAudio = path.includes('audio');
    return (
      <div className="inline-flex items-center gap-1 text-sm text-gray-600">
        {isAudio ? <Mic className="w-4 h-4" /> : <Image className="w-4 h-4" />}
        <span>{type}</span>
      </div>
    );
  };

  const renderStickers = (stickersJson: string | null) => {
    if (!stickersJson) return null;
    try {
      const stickers = JSON.parse(stickersJson);
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {stickers.map((sticker: string, index: number) => (
            <div key={index} className="text-2xl">{sticker}</div>
          ))}
        </div>
      );
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-600">Loading your past goals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {completedGoals.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedGoal(goal);
                setIsDialogOpen(true);
              }}
            >
              <div className="space-y-2">
                <h3 className={`font-medium ${
                  goal.challenge_level === 'easy' 
                    ? 'text-[#2AC20E]' 
                    : goal.challenge_level === 'medium'
                    ? 'text-[#F5DF4D]'
                    : 'text-[#FC68B3]'
                }`}>
                  {goal.goal}
                </h3>
                <p className="text-sm text-gray-500">
                  Completed {format(new Date(goal.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Goal Details</DialogTitle>
          </DialogHeader>
          
          {selectedGoal && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className={`text-lg font-medium ${
                  selectedGoal.challenge_level === 'easy'
                    ? 'text-[#2AC20E]'
                    : selectedGoal.challenge_level === 'medium'
                    ? 'text-[#F5DF4D]'
                    : 'text-[#FC68B3]'
                }`}>
                  {selectedGoal.goal}
                </h3>
                <p className="text-sm text-gray-500">
                  Created on {format(new Date(selectedGoal.created_at), 'MMMM d, yyyy')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Who did you interact with?</h4>
                  <p>{selectedGoal.who}</p>
                  {renderFileIndicator(selectedGoal.who_path, 'Attachment')}
                  {renderStickers(selectedGoal.who_stickers)}
                  <div className="mt-2 text-sm text-gray-600">
                    Difficulty Level: {selectedGoal.who_difficulty}/10
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">How did it go?</h4>
                  <p>{selectedGoal.how_it_went}</p>
                  {renderFileIndicator(selectedGoal.how_it_went_path, 'Attachment')}
                  {renderStickers(selectedGoal.how_it_went_stickers)}
                  <div className="mt-2 text-sm text-gray-600">
                    Experience Rating: {selectedGoal.how_it_went_rating}/10
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">How did you feel?</h4>
                  <p>{selectedGoal.feeling}</p>
                  {renderFileIndicator(selectedGoal.feeling_path, 'Attachment')}
                  {renderStickers(selectedGoal.feeling_stickers)}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedGoal.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Goal
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PastGoals;
