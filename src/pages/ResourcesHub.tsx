
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Heart, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ResourcesHub = () => {
  const modules = [
    {
      title: "Self Awareness",
      description: "Because understanding yourself is the ultimate glow-up ✨🧠",
      icon: <Brain className="h-8 w-8 text-[#FF8A48]" />,
      link: "/emotional-airbnb",
      color: "from-[#FF8A48] to-[#FC68B3]",
      bgColor: "bg-[#FFF5F8]",
    },
    {
      title: "Emotional Hacking",
      description: "Learn tricks to stay chill when emotions get extra.",
      icon: <Heart className="h-8 w-8 text-[#3DFDFF]" />,
      link: "/emotional-hacking",
      color: "from-[#3DFDFF] to-[#2AC20E]",
      bgColor: "bg-[#F0FFFE]",
    }
  ];

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">
              Resources Hub
            </h1>
            <p className="text-black text-lg max-w-2xl mx-auto">
              Explore our collection of tools and activities to support your emotional well-being journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${module.bgColor}`}>
                  <CardHeader>
                    <div className="p-3 rounded-full bg-white shadow-md w-fit">
                      {module.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold mt-4">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-6">{module.description}</CardDescription>
                    <Link to={module.link}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${module.color} text-white hover:opacity-90 flex items-center justify-center gap-2`}
                      >
                        <span>Open {module.title}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ResourcesHub;
