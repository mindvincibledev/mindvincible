import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import FeedbackDialog from '@/components/FeedbackDialog';

const EmotionalAirbnb = () => {
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [emotionDescription, setEmotionDescription] = useState('');
  const [safePlaceDescription, setSafePlaceDescription] = useState('');
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  const handleComplete = () => {
    setShowFeedback(true);
  };

  const handleSubmit = async () => {
    if (!currentEmotion || !emotionDescription || !safePlaceDescription) {
      toast.error('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('emotional_airbnb_entries')
        .insert([
          {
            user_id: user.id,
            emotion: currentEmotion,
            emotion_description: emotionDescription,
            safe_place_description: safePlaceDescription,
          },
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      toast.success('Entry saved successfully!');
      handleComplete();
    } catch (error: any) {
      console.error('Error submitting:', error);
      toast.error(`Failed to save entry: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />

        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <Link to="/resources" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources Hub
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-lg shadow-xl">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#3DFDFF]/10 rounded-full">
                    <Home className="h-10 w-10 text-[#3DFDFF]" />
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] bg-clip-text text-transparent mb-4">
                  Emotional Airbnb
                </h1>

                <p className="text-gray-700 max-w-xl mx-auto">
                  Create a safe space for your emotions.
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }} className="grid gap-6">
                <div>
                  <Label htmlFor="emotion">Current Emotion</Label>
                  <Input
                    type="text"
                    id="emotion"
                    placeholder="e.g., Overwhelmed, Anxious"
                    value={currentEmotion}
                    onChange={(e) => setCurrentEmotion(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="emotionDescription">Describe the Emotion</Label>
                  <Textarea
                    id="emotionDescription"
                    placeholder="Describe what this emotion feels like in your body and mind."
                    value={emotionDescription}
                    onChange={(e) => setEmotionDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="safePlaceDescription">Describe Your Safe Place</Label>
                  <Textarea
                    id="safePlaceDescription"
                    placeholder="Describe a place (real or imagined) where you feel completely safe and at peace."
                    value={safePlaceDescription}
                    onChange={(e) => setSafePlaceDescription(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
                >
                  {isSubmitting ? 'Submitting...' : 'Create My Safe Space'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
        
        <FeedbackDialog 
          isOpen={showFeedback}
          onClose={() => {
            setShowFeedback(false);
            navigate('/resources');
          }}
          activityName="Self-Awareness Exercise"
          activityId="emotional-airbnb"
        />
      </div>
    </BackgroundWithEmojis>
  );
};

export default EmotionalAirbnb;
