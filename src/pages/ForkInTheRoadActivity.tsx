
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitFork } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import WelcomeScreen from '@/components/fork-in-the-road/WelcomeScreen';
import DecisionInputScreen from '@/components/fork-in-the-road/DecisionInputScreen';
import RoadLabelsScreen from '@/components/fork-in-the-road/RoadLabelsScreen';
import ReflectionScreen from '@/components/fork-in-the-road/ReflectionScreen';
import GutCheckScreen from '@/components/fork-in-the-road/GutCheckScreen';

const ForkInTheRoadActivity = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [decisionData, setDecisionData] = useState({
    choice: '',
    consideration_path: '',
    otherPath: '',
    change_a: '',
    feel_a: '',
    change_b: '',
    feel_b: '',
    challenges_a: '',
    challenges_b: '',
    strengths_a: [],
    strengths_b: [],
    values_a: '',
    values_b: '',
    tag_a: [],
    tag_b: [],
    gain_a: '',
    gain_b: '',
    future_a: '',
    future_b: '',
    selection: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNextStep = (data: Partial<typeof decisionData>) => {
    setDecisionData(prev => ({ ...prev, ...data }));
    
    // If this is the final step (GutCheckScreen), save data to Supabase
    if (currentStep === 3) {
      handleSubmitDecision(data.selection || '');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmitDecision = async (selection: string) => {
    if (!user) {
      toast.error("You need to be logged in to save your decision");
      return;
    }
    
    // Prevent double submissions
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log("Saving decision data to Supabase:", { ...decisionData, selection, user_id: user.id });
      
      const { data, error } = await supabase
        .from('fork_in_road_decisions')
        .insert({
          user_id: user.id,
          ...decisionData,
          selection: selection
        })
        .select();

      if (error) {
        console.error('Error saving decision:', error);
        toast.error(`Failed to save your decision: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      console.log("Decision saved successfully:", data);
      toast.success("Your decision has been saved!");
      setShowCompletionMessage(true);
      setCurrentStep(prev => prev + 1);
      
    } catch (error: any) {
      console.error('Exception saving decision:', error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create a completion screen component
  const CompletionScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] rounded-full flex items-center justify-center">
          <GitFork className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mt-6 mb-2">Decision Journey Complete!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for reflecting on your choices. Your decision has been saved.
        </p>
        
        <div className="bg-[#D5D5F1]/10 p-6 rounded-lg mb-6">
          <p className="text-lg font-medium mb-2">Your decision: {decisionData.choice}</p>
          {decisionData.selection && (
            <p className="text-gray-700">
              You were leaning toward: <span className="font-medium">{
                decisionData.selection === 'A' 
                  ? decisionData.consideration_path 
                  : decisionData.selection === 'B' 
                    ? decisionData.otherPath 
                    : "Still deciding"
              }</span>
            </p>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <Button 
            onClick={() => navigate("/emotional-hacking")} 
            variant="outline"
            className="px-6"
          >
            Back to Activities
          </Button>
          <Button 
            onClick={() => {
              setDecisionData({
                choice: '',
                consideration_path: '',
                otherPath: '',
                change_a: '',
                feel_a: '',
                change_b: '',
                feel_b: '',
                challenges_a: '',
                challenges_b: '',
                strengths_a: [],
                strengths_b: [],
                values_a: '',
                values_b: '',
                tag_a: [],
                tag_b: [],
                gain_a: '',
                gain_b: '',
                future_a: '',
                future_b: '',
                selection: ''
              });
              setCurrentStep(0);
              setShowCompletionMessage(false);
            }}
            className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
          >
            Make Another Decision
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const screens = [
    <WelcomeScreen onNext={() => setCurrentStep(1)} />,
    <DecisionInputScreen 
      onNext={(choice) => handleNextStep({ choice })} 
      initialValue={decisionData.choice}
    />,
    <RoadLabelsScreen 
      onNext={(paths) => handleNextStep(paths)}
      initialValues={{
        consideration_path: decisionData.consideration_path, 
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
    />,
    <CompletionScreen />
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
