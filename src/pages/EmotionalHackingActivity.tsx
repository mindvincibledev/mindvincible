
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const activities = {
  "digital-detox": {
    title: "Digital Detox",
    description: "Give yourself a mental break by unplugging from all electronic devices. Taking a 'vacation' from screens can help you reset and refocus. Use this time to connect with yourself or the physical world around you.",
    color: "from-[#FC68B3] to-[#FF8A48]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "box-breathing": {
    title: "Box Breathing",
    description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold again for 4 seconds. This rhythmic breathing pattern can calm your nervous system. (Imagine tracing a box in the air as you do this!)",
    color: "from-[#3DFDFF] to-[#2AC20E]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "expressive-writing": {
    title: "Expressive Writing",
    description: "Take a moment to write down whatever you're feeling. Don't censor yourself, just let the words flow. This can help you process your emotions and clear your mind.",
    color: "from-[#3DFDFF] to-[#FC68B3]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "grounding-technique": {
    title: "5-4-3-2-1 Technique",
    description: "Name 5 things you can see, Name 4 things you can touch, Name 3 things you can hear, Name 2 things you can smell, Name 1 thing you can taste.",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "music-mindfulness": {
    title: "Music Mindfulness",
    description: "Put on your favourite song and really focus on the lyrics, beats, or instruments. Try to hum along or tap your fingers to the rhythm.",
    color: "from-[#FC68B3] to-[#F5DF4D]",
    image: "/lovable-uploads/3a6d7986-3c95-4ccd-a09c-1adf38891888.png"
  },
  "sensory-focus": {
    title: "Sensory Focus",
    description: "Pop a piece of gum or a mint in your mouth and focus on the flavour, texture, and how it feels as you chew.",
    color: "from-[#F5DF4D] to-[#FC68B3]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
  "walk-it-out": {
    title: "Walk It Out",
    description: "Take a walk, even if it's just around your room. Notice the feeling of your feet hitting the ground. Bonus: Walk barefoot on grass!",
    color: "from-[#2AC20E] to-[#3DFDFF]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
  "color-hunt": {
    title: "Color Hunt",
    description: "Pick a colour and find 5 things around you that match it. This distracts your brain and brings you back to the present.",
    color: "from-[#3DFDFF] to-[#F5DF4D]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
  "rewinding-rewiring": {
    title: "Rewinding-Rewiring",
    description: "Think of a happy or funny memory and walk yourself through the details—what were you wearing? Who was there? What did it smell like?",
    color: "from-[#FC68B3] to-[#2AC20E]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
  "grounding": {
    title: "Grounding Techniques",
    description: "When emotions start to feel too intense, grounding techniques can help bring you back to the present moment. Grounding is like hitting a mental reset button, shifting your focus away from overwhelming thoughts and back to what's happening right now. It helps you pause and then take actions.",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    image: "/lovable-uploads/6434be4f-d09e-4244-a496-5c8b007c9a4b.png"
  },
};

type ActivityParams = {
  activityId: string;
};

const EmotionalHackingActivity = () => {
  const { activityId } = useParams<ActivityParams>();
  const activity = activityId ? activities[activityId as keyof typeof activities] : null;

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Activity Not Found</h1>
          <Link to="/emotional-hacking">
            <Button>Back to Emotional Hacking</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <Link to="/emotional-hacking" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Activities
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-lg shadow-xl">
              <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${activity.color} bg-clip-text text-transparent mb-6`}>
                {activity.title}
              </h1>
              
              <div className="mb-6">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
              </div>
              
              <div className="text-lg text-gray-700 mb-8">
                <p className="mb-4">{activity.description}</p>
                <p>This activity will be implemented in detail soon. For now, try following the instructions above!</p>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  className={`bg-gradient-to-r ${activity.color} text-white px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300`}
                >
                  Start Activity
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default EmotionalHackingActivity;
