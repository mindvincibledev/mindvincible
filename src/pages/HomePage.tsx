
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Book, Archive, AreaChart, Brain, Sparkles, Images, Home as HomeIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  
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

  const modules = [
    {
      title: "Mood Entry",
      description: "Record how you're feeling today with our interactive mood tracker.",
      icon: <Heart className="h-8 w-8 text-[#FC68B3]" />,
      link: "/mood-entry",
      color: "from-[#FC68B3] to-[#FF8A48]"
    },
    {
      title: "Journal",
      description: "Express yourself through text, audio, or drawings in your private journal.",
      icon: <Book className="h-8 w-8 text-[#3DFDFF]" />,
      link: "/journal",
      color: "from-[#3DFDFF] to-[#2AC20E]"
    },
    {
      title: "Mood Jar",
      description: "Visualize your emotions as colorful layers in your personal mood jar.",
      icon: <Archive className="h-8 w-8 text-[#F5DF4D]" />,
      link: "/mood-jar",
      color: "from-[#F5DF4D] to-[#FF8A48]"
    },
    {
      title: "Mood Jar Gallery",
      description: "View all your latest feels, bottled up in a beautiful gallery.",
      icon: <Images className="h-8 w-8 text-[#D5D5F1]" />,
      link: "/recent-mood-jars",
      color: "from-[#D5D5F1] to-[#FC68B3]"
    },
    {
      title: "Self Awareness",
      description: "Because understanding yourself is the ultimate glow-up ✨🧠.",
      icon: <HomeIcon className="h-8 w-8 text-[#FF8A48]" />,
      link: "/emotional-airbnb",
      color: "from-[#FF8A48] to-[#FC68B3]"
    },
    {
      title: "Emotional Hacking",
      description: "Explore activities and techniques to manage intense emotions and ground yourself.",
      icon: <Brain className="h-8 w-8 text-[#FC68B3]" />,
      link: "/emotional-hacking",
      color: "from-[#FC68B3] to-[#3DFDFF]"
    },
    {
      title: "Dashboard",
      description: "View insights and patterns in your emotional journey.",
      icon: <AreaChart className="h-8 w-8 text-[#3DFDFF]" />,
      link: "/dashboard",
      color: "from-[#3DFDFF] to-[#FC68B3]"
    }
  ];

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">
                Welcome to M(in)dvincible
              </h1>
              <p className="text-black text-lg max-w-2xl mx-auto">
                All the mental health stuff you need - tips, activities, and a place to rant, everything kept 100% confidential
              </p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {modules.map((module, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link to={module.link} className="block h-full">
                    <Card className="bg-white/90 backdrop-blur-md border border-gray-100 h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-full bg-white shadow-md">
                            {module.icon}
                          </div>
                          <div 
                            className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${module.color} text-white`}
                          >
                            Explore
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-black mt-3">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-black">{module.description}</CardDescription>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white transition-all duration-300`}
                        >
                          Open {module.title}
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            {user && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-12 text-center"
              >
                <p className="text-black mb-4">Need a quick check-in?</p>
                <Link to="/mood-entry">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:opacity-90 text-black font-medium"
                  >
                    <Heart className="mr-2 h-5 w-5 text-[#FC68B3]" />
                    Record Your Mood
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default HomePage;
