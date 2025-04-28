
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import EmojiSlider from '@/components/ui/EmojiSlider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import VisibilityToggle from '@/components/ui/VisibilityToggle';

interface ReflectionSectionProps {
  onSubmit: (data: ReflectionData) => void;
  isSubmitting: boolean;
}

export interface ReflectionData {
  whatFeltEasy: string;
  whatFeltHard: string;
  otherPeopleResponses: string;
  tryNextTime: string;
  whatFeltEasyRating: number;
  whatFeltHardRating: number;
  otherPeopleRating: number;
  tryNextTimeConfidence: number;
  visibility: boolean;
}

const ReflectionSection = ({ onSubmit, isSubmitting }: ReflectionSectionProps) => {
  const [whatFeltEasy, setWhatFeltEasy] = React.useState("");
  const [whatFeltHard, setWhatFeltHard] = React.useState("");
  const [otherPeopleResponses, setOtherPeopleResponses] = React.useState("");
  const [tryNextTime, setTryNextTime] = React.useState("");
  const [whatFeltEasyRating, setWhatFeltEasyRating] = React.useState([5]);
  const [whatFeltHardRating, setWhatFeltHardRating] = React.useState([5]);
  const [otherPeopleRating, setOtherPeopleRating] = React.useState([5]);
  const [tryNextTimeConfidence, setTryNextTimeConfidence] = React.useState([5]);
  const [isConfident, setIsConfident] = React.useState(false);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  const handleFeedback = async (feedback: string) => {
    if (!user?.id) {
      toast.error("You need to be logged in to complete this activity");
      return;
    }
  
    try {
      // Record activity completion in the database
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_id: 'power-of-hi',
          activity_name: 'Power of Hi',
          feedback: feedback
        });
  
      if (error) {
        console.error("Error completing activity:", error);
        toast.error("Failed to record activity completion");
        return;
      }
      console.log("Submitting with visibility:", isVisible);
  
      // Call onSubmit here, after feedback!
      onSubmit({
        whatFeltEasy,
        whatFeltHard,
        otherPeopleResponses,
        tryNextTime,
        whatFeltEasyRating: whatFeltEasyRating[0],
        whatFeltHardRating: whatFeltHardRating[0],
        otherPeopleRating: otherPeopleRating[0],
        tryNextTimeConfidence: tryNextTimeConfidence[0],
        visibility: isVisible
      });
  
      toast.success("Activity completed successfully!");
      setShowFeedback(false);
  
      // Navigate to resources hub after completion
      navigate('/emotional-hacking');
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    }
  };
  
  
  const handleActivityComplete = () => {
    setActivityCompleted(true);
    setShowFeedback(true);
  };

  // Handle closing the celebration dialog
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    setShowFeedback(true); // Show feedback dialog after celebration
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleActivityComplete();
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="what-felt-easy">What felt easy? 🌟</Label>
            <Textarea
              id="what-felt-easy"
              value={whatFeltEasy}
              onChange={(e) => setWhatFeltEasy(e.target.value)}
              placeholder="Share the moments that flowed naturally..."
              className="min-h-[100px]"
            />
            <EmojiSlider
              value={whatFeltEasyRating}
              onValueChange={setWhatFeltEasyRating}
              label="How easy was it? 😊"
              minEmoji="😓"
              middleEmoji="🙂"
              maxEmoji="🌟"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="what-felt-hard">What felt hard? 💪</Label>
            <Textarea
              id="what-felt-hard"
              value={whatFeltHard}
              onChange={(e) => setWhatFeltHard(e.target.value)}
              placeholder="What were your challenges?"
              className="min-h-[100px]"
            />
            <EmojiSlider
              value={whatFeltHardRating}
              onValueChange={setWhatFeltHardRating}
              label="How challenging was it? 🤔"
              minEmoji="😌"
              middleEmoji="😅"
              maxEmoji="😰"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="other-responses">What surprised you about other people's responses? 🎉</Label>
            <Textarea
              id="other-responses"
              value={otherPeopleResponses}
              onChange={(e) => setOtherPeopleResponses(e.target.value)}
              placeholder="Tell us what unexpected things you discovered..."
              className="min-h-[100px]"
            />
            <EmojiSlider
              value={otherPeopleRating}
              onValueChange={setOtherPeopleRating}
              label="How surprising were their responses? 🤔"
              minEmoji="😐"
              middleEmoji="😲"
              maxEmoji="🤯"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="try-next-time">What's one thing you'll try next time? 🎯</Label>
            <Textarea
              id="try-next-time"
              value={tryNextTime}
              onChange={(e) => setTryNextTime(e.target.value)}
              placeholder="Share your next adventure..."
              className="min-h-[100px]"
            />
            <EmojiSlider
              value={tryNextTimeConfidence}
              onValueChange={setTryNextTimeConfidence}
              label="How confident are you about trying this? 💪"
              minEmoji="😟"
              middleEmoji="🤔"
              maxEmoji="💪"
            />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox 
              id="confident"
              checked={isConfident}
              onCheckedChange={(checked) => setIsConfident(checked as boolean)}
            />
            <Label 
              htmlFor="confident"
              className="text-sm font-normal"
            >
              I feel more confident about talking to new people! 🌟
            </Label>
          </div>
        </div>
        <Dialog open={showFeedback} onOpenChange={() => setShowFeedback(false)}>
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
  onToggle={(val) => {
    console.log('Toggling visibility:', val);
    setIsVisible(val);
  }}
/>

              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          type="submit"
          // Fixed the button logic - it should be disabled when submissions are in progress or fields are empty
          disabled={isSubmitting || !whatFeltEasy || !whatFeltHard || !otherPeopleResponses || !tryNextTime}
          className="w-full md:w-auto bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              Complete Reflection
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ReflectionSection;
