
import React, { useState } from 'react'; // Add the useState import here
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  activityId: string;
}

const FeedbackDialog = ({ isOpen, onClose, activityName, activityId }: FeedbackDialogProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_name: activityName,
          activity_id: activityId,
          feedback
        });
        
      if (error) throw error;
      
      toast.success('Thank you for your feedback!');
      onClose();
      navigate('/resources');
      
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Activity Completed!</DialogTitle>
          <DialogDescription>
            How was your experience with {activityName}?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(value)}
                className={`p-2 rounded-full transition-colors ${
                  value <= rating 
                    ? 'text-yellow-400 hover:text-yellow-500' 
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <Star className="h-8 w-8 fill-current" />
              </motion.button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your thoughts about the activity (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
            >
              {isSubmitting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
