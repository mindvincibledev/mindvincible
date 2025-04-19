
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ActivityFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  activityId: string;
}

const ActivityFeedbackDialog = ({ isOpen, onClose, activityName, activityId }: ActivityFeedbackDialogProps) => {
  const [selectedFeedback, setSelectedFeedback] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmitFeedback = async () => {
    if (!user) {
      toast.error("You need to be logged in to submit feedback");
      return;
    }
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_name: activityName,
          activity_id: activityId,
          feedback: selectedFeedback || ''
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
      <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
            How was your experience?
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Your feedback helps us improve our activities
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-10 px-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => setSelectedFeedback('positive')} 
              variant="outline" 
              className={`flex flex-col items-center p-6 hover:bg-green-50 hover:border-green-200 transition-colors h-auto w-full ${
                selectedFeedback === 'positive' ? 'border-2 border-green-500 bg-green-50' : ''
              }`}
            >
              <ThumbsUp size={32} className="text-green-500 mb-2" />
              <span className="text-lg">Helpful</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => setSelectedFeedback('neutral')} 
              variant="outline" 
              className={`flex flex-col items-center p-6 hover:bg-yellow-50 hover:border-yellow-200 transition-colors h-auto w-full ${
                selectedFeedback === 'neutral' ? 'border-2 border-yellow-500 bg-yellow-50' : ''
              }`}
            >
              <div className="text-4xl mb-2">😐</div>
              <span className="text-lg">Neutral</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => setSelectedFeedback('negative')} 
              variant="outline" 
              className={`flex flex-col items-center p-6 hover:bg-red-50 hover:border-red-200 transition-colors h-auto w-full ${
                selectedFeedback === 'negative' ? 'border-2 border-red-500 bg-red-50' : ''
              }`}
            >
              <ThumbsDown size={32} className="text-red-500 mb-2" />
              <span className="text-lg">Not helpful</span>
            </Button>
          </motion.div>
        </div>
        
        <div className="flex justify-center pb-4">
          <Button 
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || selectedFeedback === null}
            className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white px-8 py-6 rounded-full hover:opacity-90"
          >
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFeedbackDialog;
