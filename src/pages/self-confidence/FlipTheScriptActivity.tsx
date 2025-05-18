
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const FlipTheScriptActivity = () => {
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-3xl">
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
          
          <Card className="mb-8 bg-white/90 shadow-lg backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-lg text-center">
                Coming soon! This activity is under development.
              </p>
              <div className="flex justify-center mt-6">
                <Link to="/resources">
                  <Button className="bg-gradient-to-r from-[#FC68B3] to-[#D5D5F1] text-white">
                    Return to Resources Hub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default FlipTheScriptActivity;
