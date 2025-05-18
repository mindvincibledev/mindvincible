
import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import FlipCard from '@/components/flip-the-script/FlipCard';
import IntroSection from '@/components/flip-the-script/IntroSection';

// Define the data structure for the flip cards
interface FlipCardData {
  id: string;
  criticalThought: string;
  positiveReframe: string;
  flipped: boolean;
}

const FlipTheScriptActivity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<'intro' | 'activity' | 'exit'>('intro');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardsData, setCardsData] = useState<FlipCardData[]>([
    {
      id: "card-1",
      criticalThought: "I always mess up.",
      positiveReframe: "Mistakes help me learn. Each one brings me closer to success.",
      flipped: false
    },
    {
      id: "card-2",
      criticalThought: "I'm not good enough.",
      positiveReframe: "I am constantly growing and improving. My worth isn't based on perfection.",
      flipped: false
    },
    {
      id: "card-3",
      criticalThought: "People will think I'm dumb if I fail.",
      positiveReframe: "Everyone fails sometimes. What matters is that I keep trying.",
      flipped: false
    },
    {
      id: "card-4",
      criticalThought: "I'll never get better at this.",
      positiveReframe: "Skills take time to develop. If I keep practicing, I will improve.",
      flipped: false
    },
    {
      id: "card-5",
      criticalThought: "I should just give up now.",
      positiveReframe: "Challenges help me grow. I don't have to be great at this immediately. Just keep going.",
      flipped: false
    },
    {
      id: "card-6",
      criticalThought: "Everyone else is more confident than me.",
      positiveReframe: "Confidence is a skill. The more I step out of my comfort zone, the stronger it gets.",
      flipped: false
    },
    {
      id: "card-7",
      criticalThought: "I don't deserve success.",
      positiveReframe: "I work hard, and I am worthy of opportunities and success.",
      flipped: false
    },
    {
      id: "card-8",
      criticalThought: "If I make a mistake, people will laugh at me.",
      positiveReframe: "Most people don't notice small mistakes, and even if they do, it's okay to be human.",
      flipped: false
    },
    {
      id: "card-9",
      criticalThought: "I'm too awkward to talk to new people.",
      positiveReframe: "I might feel awkward, but that doesn't mean I am. The more I practice, the easier it gets.",
      flipped: false
    },
    {
      id: "card-10",
      criticalThought: "I'm not talented enough to do this.",
      positiveReframe: "Talent can be developed with practice and effort.",
      flipped: false
    },
    {
      id: "card-11",
      criticalThought: "I'll always feel this way.",
      positiveReframe: "Feelings change, and I have the power to improve my situation.",
      flipped: false
    },
    {
      id: "card-12",
      criticalThought: "I shouldn't even try because I might fail.",
      positiveReframe: "Trying is the first step to success. Failure is just feedback, not the end.",
      flipped: false
    },
    {
      id: "card-13",
      criticalThought: "I'm too shy to speak up.",
      positiveReframe: "My voice matters, and I deserve to be heard.",
      flipped: false
    },
    {
      id: "card-14",
      criticalThought: "I don't look good enough.",
      positiveReframe: "Confidence makes me shine more than any look ever could.",
      flipped: false
    },
    {
      id: "card-15",
      criticalThought: "Nobody likes me.",
      positiveReframe: "I am worthy of friendship, and the right people will appreciate me for who I am.",
      flipped: false
    }
  ]);

  const handleSectionComplete = (section: 'intro' | 'activity' | 'exit') => {
    switch (section) {
      case 'intro':
        setCurrentSection('activity');
        break;
      case 'activity':
        setCurrentSection('exit');
        break;
      case 'exit':
        navigate('/resources');
        break;
    }
  };

  const handleCardFlip = (id: string) => {
    setCardsData(cardsData.map(card => 
      card.id === id ? { ...card, flipped: !card.flipped } : card
    ));
  };

  const handleReset = () => {
    setCardsData(cardsData.map(card => ({ ...card, flipped: false })));
  };

  const handleFinish = () => {
    setShowFeedback(true);
  };

  const handleFeedback = async (feedback: string) => {
    if (!user?.id) {
      toast.error("You need to be logged in to complete this activity");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_id: 'flip-the-script',
          activity_name: "Let's Flip the Script",
          feedback: feedback,
        });
      
      if (error) {
        console.error("Error completing activity:", error);
        toast.error("Failed to record activity completion");
        return;
      }
      
      toast.success("Activity completed successfully!");
      setShowFeedback(false);
      navigate('/resources');
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-4xl">
          <Link to="/resources" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources Hub
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#D5D5F1] bg-clip-text text-transparent mb-4">
              Let's Flip the Script
            </h1>
            <p className="text-gray-800 text-lg max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              Learn how to reframe your talk
            </p>
          </motion.div>
          
          {currentSection === 'intro' && (
            <IntroSection onComplete={() => handleSectionComplete('intro')} />
          )}
          
          {currentSection === 'activity' && (
            <Card className="mb-8 bg-white/90 shadow-lg backdrop-blur-sm p-6">
              <CardContent className="p-0">
                <h2 className="text-xl font-semibold text-center mb-6">
                  Select the critical thoughts you relate to, then swap them for a more positive mindset.
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {cardsData.map(card => (
                    <FlipCard 
                      key={card.id}
                      id={card.id}
                      criticalThought={card.criticalThought}
                      positiveReframe={card.positiveReframe}
                      flipped={card.flipped}
                      onFlip={handleCardFlip}
                    />
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                  <Button 
                    onClick={handleReset} 
                    variant="outline"
                    className="flex items-center gap-2 border-[#FC68B3] text-[#FC68B3] hover:bg-[#FC68B3]/10"
                  >
                    <RefreshCw size={16} />
                    Reset Cards
                  </Button>
                  
                  <Button 
                    onClick={handleFinish}
                    className="bg-gradient-to-r from-[#FC68B3] to-[#D5D5F1] text-white hover:opacity-90 flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Finish Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
            <DialogContent className="bg-gradient-to-r from-[#FC68B3]/10 to-[#D5D5F1]/10 backdrop-blur-md border-none shadow-xl max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#D5D5F1] bg-clip-text text-transparent">
                  How was your experience?
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-3 gap-4 py-10 px-4">
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
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default FlipTheScriptActivity;
