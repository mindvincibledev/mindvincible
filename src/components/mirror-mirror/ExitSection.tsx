import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Star, Trophy, Target, ArrowRight, Mic, MicOff, Upload, Image, Camera, Smile, X } from 'lucide-react';
import { ArrowLeft, Hand, MessageSquare, Award, ChevronLeft, ChevronRight, Save, Home } from 'lucide-react';
import CompletionAnimation from '@/components/grounding/CompletionAnimation';
import { ArrowLeft as ArrowLeftIcon, Clock, Play, RotateCcw, Moon, Sun, Smartphone, Coffee, Check, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {  useNavigate } from 'react-router-dom';
import {  GitFork, Edit, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

interface ExitSectionProps {
  onAnotherPrompt: () => void;
  onComplete: () => void;
  promptsCompleted: number;
}

const ExitSection: React.FC<ExitSectionProps> = ({ onAnotherPrompt, onComplete, promptsCompleted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const handleFeedback = async (feedback: string) => {
    if (!user?.id) {
      toast.error("You need to be logged in to complete this activity");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Always use user_id: user.id! RLS enforced on inserts.
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_id: 'mirror-mirror',
          activity_name: 'Mirror Mirror on the Wall',
          feedback: feedback
        });
      
      if (error) {
        console.error("Error completing activity:", error);
        toast.error("Failed to record activity completion");
        return;
      }
      
      toast.success("Activity completed successfully!");
      setShowFeedback(false);
      
      // Navigate to resources hub after completion
      navigate('/resources');
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    
    <Card className="p-8 bg-white/90 backdrop-blur-lg shadow-xl border-none">
      <CardContent className="p-0 flex flex-col items-center">
        <div className="text-center mb-8">
        <Dialog open={showFeedback} onOpenChange={() => setShowFeedback(false)}>
          <DialogContent className="bg-gradient-to-r from-[#3DFDFF]/10 to-[#FC68B3]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
                How was your experience?
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-4 py-10 px-4">
              <Button 
                onClick={() => handleFeedback('positive')} 
                variant="outline" 
                className="flex flex-col items-center p-4 hover:bg-emerald-700 hover:border-emerald-800 transition-colors h-auto"
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
          </DialogContent>
        </Dialog>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] flex items-center justify-center mx-auto mb-6"
          >
            <Check size={36} className="text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#FC68B3] bg-clip-text text-transparent mb-4">
            Great Reflection!
          </h2>
          
          <p className="text-lg text-gray-700">
            You've completed {promptsCompleted} reflection{promptsCompleted !== 1 ? 's' : ''}.
          </p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-lg text-gray-600"
          >
            Want another round?
          </motion.p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onAnotherPrompt}
              className="bg-gradient-to-r from-[#9b87f5] to-[#FC68B3] text-white hover:opacity-90 transition-all duration-300 px-6 py-2 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Yes, give me another card
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => {setShowFeedback(true);onComplete;}}
              variant="outline"
              className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 px-6 py-2"
            >
              Done for now
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExitSection;
