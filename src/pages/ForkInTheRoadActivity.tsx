import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitFork, Edit, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import WelcomeScreen from '@/components/fork-in-the-road/WelcomeScreen';
import DecisionInputScreen from '@/components/fork-in-the-road/DecisionInputScreen';
import RoadLabelsScreen from '@/components/fork-in-the-road/RoadLabelsScreen';
import ReflectionScreen from '@/components/fork-in-the-road/ReflectionScreen';
import GutCheckScreen from '@/components/fork-in-the-road/GutCheckScreen';
import FeedbackDialog from '@/components/FeedbackDialog';

const ForkInTheRoadActivity = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [decisionData, setDecisionData] = useState({
    choice: '',
    consideration_path: '',
    other_path: '',
    change_a: '',
    feel_a: '',
    change_b: '',
    feel_b: '',
    challenges_a: '',
    challenges_b: '',
    strengths_a: [] as string[],
    strengths_b: [] as string[],
    values_a: '',
    values_b: '',
    tag_a: [] as string[],
    tag_b: [] as string[],
    gain_a: '',
    gain_b: '',
    future_a: '',
    future_b: '',
    selection: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [pastDecisions, setPastDecisions] = useState<any[]>([]);
  const [loadingPastDecisions, setLoadingPastDecisions] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [editingDecision, setEditingDecision] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [decisionToDelete, setDecisionToDelete] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("make-decision");
  const [showFeedback, setShowFeedback] = useState(false);

  // Fetch past decisions when component loads
  useEffect(() => {
    if (user) {
      fetchPastDecisions();
    }
  }, [user]);

  const fetchPastDecisions = async () => {
    if (!user) return;
    
    try {
      setLoadingPastDecisions(true);
      const { data, error } = await supabase
        .from('fork_in_road_decisions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching past decisions:', error);
        toast.error(`Failed to load your past decisions: ${error.message}`);
        return;
      }
      
      setPastDecisions(data || []);
    } catch (error: any) {
      console.error('Exception fetching past decisions:', error);
    } finally {
      setLoadingPastDecisions(false);
    }
  };

  const handleNextStep = (data: Partial<typeof decisionData>) => {
    // Make a deep copy to ensure we're not losing any data
    const updatedDecisionData = { ...decisionData, ...data };
    
    console.log("handleNextStep - Current step:", currentStep, "Received data:", data);
    setDecisionData(updatedDecisionData);
    
    // Log the updated state after merging data
    console.log("Decision data after update:", updatedDecisionData);
    
    // Check if we're receiving data from GutCheckScreen (it will have a selection property)
    if (data.selection !== undefined) {
      console.log("GutCheck selection received:", data.selection);
      handleSubmitDecision(data.selection);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmitDecision = async (selection: string) => {
    if (!user) {
      toast.error("You need to be logged in to save your decision");
      return;
    }
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      console.log("Preparing to save decision with selection:", selection);
      
      // Include the most up-to-date decision data INCLUDING the selection
      const fullDecisionData = { ...decisionData, selection };
      console.log("Full decision data to save:", fullDecisionData);
      
      const dataToSave = {
        user_id: user.id,
        choice: fullDecisionData.choice,
        consideration_path: fullDecisionData.consideration_path,
        other_path: fullDecisionData.other_path,
        change_a: fullDecisionData.change_a,
        feel_a: fullDecisionData.feel_a,
        change_b: fullDecisionData.change_b,
        feel_b: fullDecisionData.feel_b,
        challenges_a: fullDecisionData.challenges_a,
        challenges_b: fullDecisionData.challenges_b,
        strengths_a: fullDecisionData.strengths_a,
        strengths_b: fullDecisionData.strengths_b,
        values_a: fullDecisionData.values_a,
        values_b: fullDecisionData.values_b,
        tag_a: fullDecisionData.tag_a,
        tag_b: fullDecisionData.tag_b,
        gain_a: fullDecisionData.gain_a,
        gain_b: fullDecisionData.gain_b,
        future_a: fullDecisionData.future_a,
        future_b: fullDecisionData.future_b,
        selection: selection
      };
      
      let result;
      
      // If we're editing, update the existing decision
      if (editingDecision) {
        console.log("Updating existing decision:", editingDecision.decision_id);
        const { data, error } = await supabase
          .from('fork_in_road_decisions')
          .update(dataToSave)
          .eq('decision_id', editingDecision.decision_id)
          .select();
          
        if (error) throw error;
        result = data;
        toast.success("Your decision has been updated!");
        setEditingDecision(null);
      } else {
        // Otherwise insert a new decision
        console.log("Creating new decision");
        const { data, error } = await supabase
          .from('fork_in_road_decisions')
          .insert(dataToSave)
          .select();
          
        if (error) throw error;
        result = data;
        toast.success("Your decision has been saved!");
      }

      console.log("Decision saved successfully:", result);
      
      // Refresh past decisions list
      fetchPastDecisions();
      
      setShowFeedback(true);
      setCurrentStep(prev => prev + 1);
      
    } catch (error: any) {
      console.error('Error saving decision:', error);
      toast.error(`Failed to save your decision: ${error.message}`);
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
                    ? decisionData.other_path 
                    : "Still deciding"
              }</span>
            </p>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <Button 
            onClick={() => navigate("/resources")} 
            variant="outline"
            className="px-6"
          >
            Back to Resources Hub
          </Button>
          <Button 
            onClick={() => {
              setDecisionData({
                choice: '',
                consideration_path: '',
                other_path: '',
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

  const handleEditDecision = (decision: any) => {
    console.log("Editing decision:", decision);
    setEditingDecision(decision);
    setDecisionData({
      choice: decision.choice || '',
      consideration_path: decision.consideration_path || '',
      other_path: decision.other_path || '',
      change_a: decision.change_a || '',
      feel_a: decision.feel_a || '',
      change_b: decision.change_b || '',
      feel_b: decision.feel_b || '',
      challenges_a: decision.challenges_a || '',
      challenges_b: decision.challenges_b || '',
      strengths_a: decision.strengths_a || [],
      strengths_b: decision.strengths_b || [],
      values_a: decision.values_a || '',
      values_b: decision.values_b || '',
      tag_a: decision.tag_a || [],
      tag_b: decision.tag_b || [],
      gain_a: decision.gain_a || '',
      gain_b: decision.gain_b || '',
      future_a: decision.future_a || '',
      future_b: decision.future_b || '',
      selection: decision.selection || ''
    });
    setCurrentStep(0);
    setActiveTab("make-decision");
  };

  const handleDeleteDecision = async (decision: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('fork_in_road_decisions')
        .delete()
        .eq('decision_id', decision.decision_id);

      if (error) {
        console.error('Error deleting decision:', error);
        toast.error(`Failed to delete decision: ${error.message}`);
        return;
      }

      toast.success("Decision deleted successfully!");
      fetchPastDecisions();
      setDeleteConfirmOpen(false);
      setDecisionToDelete(null);
      
      // After successful deletion, redirect to resources hub
      navigate('/resources-hub');
    } catch (error: any) {
      console.error('Exception deleting decision:', error);
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  // Component to display past decisions
  const PastDecisionsView = () => (
    <div className="py-4">
      <h3 className="text-xl font-medium mb-4">Your Past Decisions</h3>
      
      {loadingPastDecisions ? (
        <div className="text-center py-8">Loading your past decisions...</div>
      ) : pastDecisions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't made any decisions yet. Start by making your first decision!
        </div>
      ) : (
        <div className="space-y-4">
          {pastDecisions.map(decision => (
            <Card key={decision.decision_id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-grow">
                  <h4 className="font-medium">{decision.choice}</h4>
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(decision.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    {decision.selection ? (
                      <Badge className={
                        decision.selection === 'A' 
                          ? "bg-gradient-to-r from-[#D5D5F1] to-[#3DFDFF]" 
                          : decision.selection === 'B'
                            ? "bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D]"
                            : "bg-gradient-to-r from-[#FC68B3] to-[#FF8A48]"
                      }>
                        {decision.selection === 'A' 
                          ? `Chose ${decision.consideration_path}` 
                          : decision.selection === 'B'
                            ? `Chose ${decision.other_path}`
                            : "Still deciding"}
                      </Badge>
                    ) : (
                      <Badge variant="outline">No selection made</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleEditDecision(decision)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                    onClick={() => {
                      setDecisionToDelete(decision);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Decision</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this decision? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => decisionToDelete && handleDeleteDecision(decisionToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const screens = [
    <WelcomeScreen onNext={() => setCurrentStep(1)} key="welcome" />,
    <DecisionInputScreen 
      onNext={(data) => handleNextStep({ choice: data })} 
      initialValue={decisionData.choice}
      key="decision-input"
    />,
    <RoadLabelsScreen 
      onNext={(paths) => handleNextStep(paths)}
      initialValues={{
        consideration_path: decisionData.consideration_path, 
        other_path: decisionData.other_path
      }}
      key="road-labels"
    />,
    <ReflectionScreen 
      onNext={(reflectionData) => handleNextStep(reflectionData)}
      initialValues={decisionData}
      key="reflection"
    />,
    <GutCheckScreen 
      onComplete={(selection) => handleNextStep({ selection })}
      decisionData={decisionData}
      key="gut-check"
    />,
    <CompletionScreen key="completion" />
  ];

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
              
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="make-decision">Make a Decision</TabsTrigger>
                  <TabsTrigger value="past-decisions">Past Decisions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="make-decision">
                  {screens[currentStep]}
                </TabsContent>
                
                <TabsContent value="past-decisions">
                  <PastDecisionsView />
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
        
        <FeedbackDialog 
          isOpen={showFeedback}
          onClose={() => {
            setShowFeedback(false);
            navigate('/resources');
          }}
          activityName="Fork in the Road"
          activityId="fork-in-the-road"
        />
      </div>
    </BackgroundWithEmojis>
  );
};

export default ForkInTheRoadActivity;
