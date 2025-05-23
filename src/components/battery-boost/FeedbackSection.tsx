
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VisibilityToggle from '@/components/ui/VisibilityToggle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface FeedbackSectionProps {
  initialBatteryLevel: number;
  finalBatteryLevel: number;
  activityEntryId: string | null;
  onComplete: () => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ 
  initialBatteryLevel, 
  finalBatteryLevel,
  activityEntryId,
  onComplete 
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  // Fetch the current visibility setting when component mounts
  useEffect(() => {
    if (activityEntryId && user) {
      const fetchVisibility = async () => {
        try {
          const { data, error } = await supabase
            .from('battery_boost_entries')
            .select('visible_to_clinicians')
            .eq('id', activityEntryId)
            .eq('user_id', user.id)
            .single();
            
          if (!error && data) {
            setIsVisible(data.visible_to_clinicians);
          }
        } catch (error) {
          console.error("Error fetching visibility:", error);
        }
      };
      
      fetchVisibility();
    }
  }, [activityEntryId, user]);

  const handleReturnHome = () => {
    navigate('/resources');
  };

  const handleSubmitFeedback = () => {
    setShowFeedback(true);
  };

  const handleFeedback = async (feedbackType: string) => {
    if (!user?.id) {
      toast.error("You need to be logged in to complete this activity");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First update the visibility in the battery_boost_entries table
      if (activityEntryId) {
        console.log("Saving visibility status:", isVisible);
        const { error: visibilityError } = await supabase
          .from('battery_boost_entries')
          .update({ 
            visible_to_clinicians: isVisible 
          })
          .eq('id', activityEntryId)
          .eq('user_id', user.id);
          
        if (visibilityError) {
          console.error("Error updating visibility:", visibilityError);
          toast.error("Failed to save visibility preference");
          setIsSubmitting(false);
          return;
        }
      }
      
      // Then record activity completion with feedback
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_id: 'battery-boost',
          activity_name: 'Battery Boost',
          feedback: feedbackType
        });
      
      if (error) {
        console.error("Error completing activity:", error);
        toast.error("Failed to record activity completion");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Activity completed successfully!");
      setShowFeedback(false);
      onComplete();
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold mb-10 text-center">Activity Complete!</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center w-full mb-12">
            <div className="flex flex-col items-center mb-8 md:mb-0">
              <p className="text-gray-600 mb-4 font-medium text-center">Starting Battery</p>
              <div className="relative w-28 h-56 border-2 border-gray-800 rounded-2xl overflow-hidden">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-800 rounded-t-lg"></div>
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#F9A159] to-[#0ABFDF]"
                  style={{ height: `${initialBatteryLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-bold text-white mix-blend-difference">{initialBatteryLevel}%</p>
                </div>
              </div>
            </div>
            
            <div className="mx-4 md:mx-8 flex items-center justify-center w-12 md:w-16">
              <ArrowRight size={36} className="text-gray-700" />
            </div>
            
            <div className="flex flex-col items-center">
              <p className="text-gray-600 mb-4 font-medium text-center">Final Battery</p>
              <div className="relative w-28 h-56 border-2 border-gray-800 rounded-2xl overflow-hidden">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-800 rounded-t-lg"></div>
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#0ABFDF] to-[#2AC20E]"
                  style={{ height: `${finalBatteryLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-bold text-white mix-blend-difference">{finalBatteryLevel}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
            <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
                  How was your experience?
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 py-6 px-4">
                  <Button 
                    onClick={() => handleFeedback('positive')} 
                    variant="outline" 
                    className="flex flex-col items-center p-4 hover:bg-emerald-100 hover:border-emerald-200 transition-colors h-auto"
                    disabled={isSubmitting}
                  >
                    <div className="text-3xl mb-2">👍</div>
                    <span>Helpful</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleFeedback('neutral')} 
                    variant="outline" 
                    className="flex flex-col items-center p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors h-auto"
                    disabled={isSubmitting}
                  >
                    <div className="text-3xl mb-2">😐</div>
                    <span>Neutral</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleFeedback('negative')} 
                    variant="outline" 
                    className="flex flex-col items-center p-4 hover:bg-red-50 hover:border-red-200 transition-colors h-auto"
                    disabled={isSubmitting}
                  >
                    <div className="text-3xl mb-2">👎</div>
                    <span>Not helpful</span>
                  </Button>
                </div>

                <div className="px-4">
                  <VisibilityToggle
                    isVisible={isVisible}
                    onToggle={setIsVisible}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 py-6 text-lg"
              onClick={handleReturnHome}
            >
              <Home className="h-5 w-5" />
              Return to Resources
            </Button>
            
            <Button
              className="bg-gradient-to-r from-[#33C3F0] to-[#F97316] text-white py-6 text-lg"
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Activity'}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
