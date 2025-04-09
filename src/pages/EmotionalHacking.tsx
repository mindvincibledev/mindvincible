
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, BookOpen, Eye, Navigation, Coffee, Music, Palette, Clock, Brain } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const activities = [
  {
    title: "Digital Detox",
    description: "Give yourself a mental break by unplugging from electronic devices.",
    icon: <svg className="h-8 w-8 text-[#FF8A48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>,
    link: "/emotional-hacking/digital-detox",
    color: "from-[#FC68B3] to-[#FF8A48]",
    bgColor: "bg-[#FFDEE2]"
  },
  {
    title: "Box Breathing",
    description: "Practice a rhythmic breathing pattern to calm your nervous system.",
    icon: <svg className="h-8 w-8 text-[#2AC20E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>,
    link: "/emotional-hacking/box-breathing",
    color: "from-[#3DFDFF] to-[#2AC20E]",
    bgColor: "bg-[#F2FCE2]"
  },
  {
    title: "Expressive Writing",
    description: "Take a moment to write down whatever you're feeling without censoring yourself.",
    icon: <BookOpen className="h-8 w-8 text-[#3DFDFF]" />,
    link: "/emotional-hacking/expressive-writing",
    color: "from-[#3DFDFF] to-[#FC68B3]",
    bgColor: "bg-[#E5DEFF]"
  },
  {
    title: "5-4-3-2-1 Technique",
    description: "Use your senses to ground yourself in the present moment.",
    icon: <Eye className="h-8 w-8 text-[#F5DF4D]" />,
    link: "/emotional-hacking/grounding-technique",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    bgColor: "bg-[#FEF7CD]"
  },
  {
    title: "Music Mindfulness",
    description: "Focus on the lyrics, beats, or instruments of your favorite song.",
    icon: <Music className="h-8 w-8 text-[#FC68B3]" />,
    link: "/emotional-hacking/music-mindfulness",
    color: "from-[#FC68B3] to-[#F5DF4D]",
    bgColor: "bg-[#FDE1D3]"
  },
  {
    title: "Sensory Focus",
    description: "Pop a piece of gum or a mint and focus on the flavor and texture.",
    icon: <Coffee className="h-8 w-8 text-[#F5DF4D]" />,
    link: "/emotional-hacking/sensory-focus",
    color: "from-[#F5DF4D] to-[#FC68B3]",
    bgColor: "bg-[#FFDEE2]"
  },
  {
    title: "Walk It Out",
    description: "Notice the feeling of your feet hitting the ground as you walk, even if it's just around the room.",
    icon: <Navigation className="h-8 w-8 text-[#2AC20E]" />,
    link: "/emotional-hacking/walk-it-out",
    color: "from-[#2AC20E] to-[#3DFDFF]",
    bgColor: "bg-[#F2FCE2]"
  },
  {
    title: "Color Hunt",
    description: "Pick a color and find 5 things around you that match it to bring your mind back to the present.",
    icon: <Palette className="h-8 w-8 text-[#3DFDFF]" />,
    link: "/emotional-hacking/color-hunt",
    color: "from-[#3DFDFF] to-[#F5DF4D]",
    bgColor: "bg-[#D3E4FD]"
  },
  {
    title: "Rewinding-Rewiring",
    description: "Think of a happy or funny memory and walk yourself through all the details.",
    icon: <Brain className="h-8 w-8 text-[#FC68B3]" />,
    link: "/emotional-hacking/rewinding-rewiring",
    color: "from-[#FC68B3] to-[#2AC20E]",
    bgColor: "bg-[#E5DEFF]"
  },
  {
    title: "Grounding Techniques",
    description: "When emotions feel too intense, use grounding techniques to bring yourself back to the present moment.",
    icon: <Clock className="h-8 w-8 text-[#F5DF4D]" />,
    link: "/emotional-hacking/grounding",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    bgColor: "bg-[#FEF7CD]"
  },
];

const EmotionalHacking = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">
              Emotional Hacking
            </h1>
            <p className="text-black text-lg max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              When emotions start to feel too intense, grounding techniques can help bring you back to the present moment. 
              Grounding is like hitting a mental reset button, shifting your focus away from overwhelming thoughts.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activities.map((activity, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={activity.link} className="block h-full">
                  <Card className={`h-full border border-gray-100 ${activity.bgColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-full bg-white shadow-md">
                          {activity.icon}
                        </div>
                        <div 
                          className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${activity.color} text-white`}
                        >
                          Try Now
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-black mt-3">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-black">{activity.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90 text-white transition-all duration-300`}
                      >
                        Open Activity
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-black mb-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg inline-block">
              These activities can help you pause, reset, and then take purposeful action.
            </p>
          </motion.div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default EmotionalHacking;
