
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Wind, ArrowLeft, Moon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const activities = [
  {
    id: "grounding-technique",
    title: "5-4-3-2-1: The Grounding Quest",
    description: "Use your senses to ground yourself in the present moment.",
    icon: <Eye className="h-8 w-8 text-[#F5DF4D]" />,
    link: "/emotional-hacking/grounding-technique",
    color: "from-[#F5DF4D] to-[#3DFDFF]",
    bgColor: "bg-[#FEF7CD]",
    chartColor: "#F5DF4D",
    shortName: "Ground"
  },
  {
    id: "box-breathing",
    title: "Breathe in a Box",
    description: "A calming breathing exercise to help you relax and focus.",
    icon: <Wind className="h-8 w-8 text-[#3DFDFF]" />,
    link: "/emotional-hacking/box-breathing",
    color: "from-[#3DFDFF] to-[#2AC20E]",
    bgColor: "bg-[#E5FFF2]",
    chartColor: "#3DFDFF",
    shortName: "Breathe"
  },
  {
    id: "digital-detox",
    title: "Digital Detox",
    description: "Reconnect with yourself by disconnecting from your devices.",
    icon: <Moon className="h-8 w-8 text-[#2AC20E]" />,
    link: "/emotional-hacking/digital-detox",
    color: "from-[#3DFDFF] to-[#2AC20E]",
    bgColor: "bg-[#E5FFF2]",
    chartColor: "#2AC20E",
    shortName: "Detox"
  }
];

const EmotionalHacking = () => {
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">
              Hack the Feels, Don't Let Them Hack You
            </h1>
            <p className="text-black text-lg max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              Learn tricks to stay chill when emotions get extra.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className={`h-full border border-gray-100 ${activity.bgColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <CardHeader>
                    <div className="p-3 rounded-full bg-white shadow-md w-fit">
                      {activity.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-black mt-3">{activity.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-black mb-6">{activity.description}</CardDescription>
                    <Link to={activity.link}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90`}
                      >
                        Open Activity
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default EmotionalHacking;
