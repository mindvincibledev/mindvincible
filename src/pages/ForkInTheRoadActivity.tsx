
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitFork } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import WelcomeScreen from '@/components/fork-in-the-road/WelcomeScreen';
import DecisionInputScreen from '@/components/fork-in-the-road/DecisionInputScreen';
import RoadLabelsScreen from '@/components/fork-in-the-road/RoadLabelsScreen';
import ReflectionScreen from '@/components/fork-in-the-road/ReflectionScreen';
import GutCheckScreen from '@/components/fork-in-the-road/GutCheckScreen';

const ForkInTheRoadActivity = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [decisionData, setDecisionData] = useState({
    choice: '',
    considerationPath: '',
    otherPath: '',
    changeA: '',
    feelA: '',
    changeB: '',
    feelB: '',
    challengesA: '',
    challengesB: '',
    strengthsA: [],
    strengthsB: [],
    valuesA: '',
    valuesB: '',
    tagA: [],
    tagB: [],
    gainA: '',
    gainB: '',
    futureA: '',
    futureB: '',
    selection: ''
  });

  const { user } = useAuth();

  const handleNextStep = (data: Partial<typeof decisionData>) => {
    setDecisionData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmitDecision = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fork_in_road_decisions')
        .insert({
          user_id: user.id,
          ...decisionData
        });

      if (error) throw error;

      // Navigate to past decisions or show completion
    } catch (error) {
      console.error('Error saving decision:', error);
    }
  };

  const screens = [
    <WelcomeScreen onNext={() => setCurrentStep(1)} />,
    <DecisionInputScreen 
      onNext={(choice) => handleNextStep({ choice })} 
      initialValue={decisionData.choice}
    />,
    <RoadLabelsScreen 
      onNext={(paths) => handleNextStep(paths)}
      initialValues={{
        considerationPath: decisionData.considerationPath, 
        otherPath: decisionData.otherPath
      }}
    />,
    <ReflectionScreen 
      onNext={(reflectionData) => handleNextStep(reflectionData)}
      initialValues={decisionData}
    />,
    <GutCheckScreen 
      onComplete={(selection) => handleNextStep({ selection })}
      decisionData={decisionData}
    />
  ];

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
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#3DFDFF]/10 rounded-full">
                    <GitFork className="h-10 w-10 text-[#3DFDFF]" />
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] bg-clip-text text-transparent mb-4">
                  Fork in the Road
                </h1>
                
                <p className="text-gray-700 max-w-xl mx-auto">
                  Explore your options. Choose with clarity.
                </p>
              </div>
              
              <Tabs defaultValue="make-decision" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="make-decision">Make a Decision</TabsTrigger>
                  <TabsTrigger value="past-decisions">Past Decisions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="make-decision">
                  {screens[currentStep]}
                </TabsContent>
                
                <TabsContent value="past-decisions">
                  {/* TODO: Implement past decisions view */}
                  <p className="text-center text-gray-500">No past decisions yet.</p>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ForkInTheRoadActivity;
